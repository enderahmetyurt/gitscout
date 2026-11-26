-- Sitenin kendi sayımı (source = 'site'). Uygulama rolü tablolara doğrudan yazamaz; yalnızca bu iki
-- fonksiyonu çağırır ve fonksiyonlar sayacı birer artırır. Gün UTC'dir, Vercel verisiyle aynı.
-- Ziyaretçi kimliği tutulmadığı için (çerez yok) site satırlarında visitors 0 kalır.

create function gitscout.record_page_view(p_path text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  today date := (now() at time zone 'utc')::date;
  login_re constant text := '^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$';
  parts text[];
  a text;
  b text;
begin
  if p_path is null or p_path !~ '^/' or char_length(p_path) > 2048 then
    raise exception 'invalid path' using errcode = '22023';
  end if;

  insert into gitscout.page_views as t (day, path, pageviews, visitors, source)
  values (today, p_path, 1, 0, 'site')
  on conflict (day, path, source) do update set pageviews = t.pageviews + 1;

  -- Profil ve kapışma sayaçları yoldan türetilir: dil öneki ve harf farkı birleşir, A–B ile B–A aynı satırdır.
  parts := regexp_match(p_path, '^(?:/(?:tr|en))?/u/([^/]+)/?$');
  if parts is not null then
    a := lower(parts[1]);
    if a ~ login_re then
      insert into gitscout.profile_views as t (login, day, views, source)
      values (a, today, 1, 'site')
      on conflict (login, day, source) do update set views = t.views + 1;
    end if;
    return;
  end if;

  parts := regexp_match(p_path, '^(?:/(?:tr|en))?/vs/([^/]+)/([^/]+)/?$');
  if parts is not null then
    a := least(lower(parts[1]), lower(parts[2]));
    b := greatest(lower(parts[1]), lower(parts[2]));
    if a <> b and a ~ login_re and b ~ login_re then
      insert into gitscout.duel_views as t (left_login, right_login, day, views, source)
      values (a, b, today, 1, 'site')
      on conflict (left_login, right_login, day, source) do update set views = t.views + 1;
    end if;
  end if;
end;
$$;

create function gitscout.record_event(p_name text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_name is null or p_name not in (
    'card_requested', 'card_request_failed', 'card_downloaded', 'card_shared',
    'duel_shared', 'github_star_clicked', 'readme_badge_copied'
  ) then
    raise exception 'unknown event' using errcode = '22023';
  end if;

  insert into gitscout.events as t (day, name, data, count, visitors, source)
  values ((now() at time zone 'utc')::date, p_name, coalesce(p_data, '{}'), 1, 0, 'site')
  on conflict (day, name, data, source) do update set count = t.count + 1;
end;
$$;

revoke all on function gitscout.record_page_view(text), gitscout.record_event(text, jsonb)
  from public, anon, authenticated, service_role;
grant execute on function gitscout.record_page_view(text), gitscout.record_event(text, jsonb)
  to gitscout_app;
