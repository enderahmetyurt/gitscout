-- Sayaçlar günlük tekil ziyaretçi sayar: aynı kişi aynı profili, kapışmayı, yolu ya da olayı UTC günü
-- başına bir kez artırır. Kişi, her gün yeniden üretilen gizli bir tuzla hash(tuz + IP + tarayıcı) olarak
-- tanınır; ham IP hiçbir yere yazılmaz. Tuz ertesi gün silindiği için eski hash'ler kimseyle eşleştirilemez.
-- Silme yalnızca bu iki yardımcı tabloda olur; analitik tablolarından hiçbir satır silinmez.

create table gitscout.daily_salts (
  day date primary key,
  salt bytea not null
);

create table gitscout.seen (
  day date not null,
  visitor bytea not null,
  kind text not null check (kind in ('path', 'profile', 'duel', 'event')),
  target text not null check (char_length(target) <= 2200),
  primary key (day, visitor, kind, target)
);

revoke all on gitscout.daily_salts, gitscout.seen from public, anon, authenticated, service_role;
alter table gitscout.daily_salts enable row level security;
alter table gitscout.daily_salts force row level security;
alter table gitscout.seen enable row level security;
alter table gitscout.seen force row level security;

-- Bugünün ziyaretçi hash'i. Günün ilk çağrısı tuzu üretir ve önceki günlerin tuzlarını ve
-- tekilleştirme kayıtlarını temizler; ayrı bir zamanlanmış işe gerek kalmaz.
create function gitscout.visitor_hash(p_ip text, p_ua text)
returns bytea
language plpgsql
security definer
set search_path = ''
as $$
declare
  today date := (now() at time zone 'utc')::date;
  today_salt bytea;
begin
  select salt into today_salt from gitscout.daily_salts where day = today;
  if today_salt is null then
    insert into gitscout.daily_salts (day, salt)
    values (today, uuid_send(gen_random_uuid()) || uuid_send(gen_random_uuid()))
    on conflict (day) do nothing;
    select salt into today_salt from gitscout.daily_salts where day = today;
    delete from gitscout.daily_salts where day < today;
    delete from gitscout.seen where day < today;
  end if;
  return sha256(today_salt || convert_to(coalesce(p_ip, '') || '|' || coalesce(p_ua, ''), 'UTF8'));
end;
$$;

-- Bu ziyaretçi bu hedefi bugün ilk kez mi görüyor? İlkse kaydeder ve true döner.
create function gitscout.first_seen(p_visitor bytea, p_kind text, p_target text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted integer;
begin
  insert into gitscout.seen (day, visitor, kind, target)
  values ((now() at time zone 'utc')::date, p_visitor, p_kind, p_target)
  on conflict do nothing;
  get diagnostics inserted = row_count;
  return inserted = 1;
end;
$$;

-- Bir ziyaretçinin günde sayılabilecek farklı profil ve kapışma sayısı; betikle toplu gezinti sayaçları şişirmesin.
create function gitscout.under_daily_cap(p_visitor bytea)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select count(*) < 300 from gitscout.seen
  where day = (now() at time zone 'utc')::date and visitor = p_visitor and kind in ('profile', 'duel');
$$;

create function gitscout.record_page_view(p_path text, p_ip text, p_ua text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  today date := (now() at time zone 'utc')::date;
  login_re constant text := '^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$';
  v bytea;
  is_new boolean;
  parts text[];
  a text;
  b text;
begin
  if p_path is null or p_path !~ '^/' or char_length(p_path) > 2048 then
    raise exception 'invalid path' using errcode = '22023';
  end if;
  v := gitscout.visitor_hash(p_ip, p_ua);

  -- pageviews her açılışı (trafik), visitors günlük tekil kişiyi sayar.
  is_new := gitscout.first_seen(v, 'path', p_path);
  insert into gitscout.page_views as t (day, path, pageviews, visitors, source)
  values (today, p_path, 1, case when is_new then 1 else 0 end, 'site')
  on conflict (day, path, source) do update
    set pageviews = t.pageviews + 1,
        visitors = t.visitors + case when is_new then 1 else 0 end;

  if not gitscout.under_daily_cap(v) then
    return;
  end if;

  -- Profil ve kapışma yalnızca tekil ziyaretçiyi sayar: dil öneki ve harf farkı birleşir, A–B ile B–A aynıdır.
  parts := regexp_match(p_path, '^(?:/(?:tr|en))?/u/([^/]+)/?$');
  if parts is not null then
    a := lower(parts[1]);
    if a ~ login_re and gitscout.first_seen(v, 'profile', a) then
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
    if a <> b and a ~ login_re and b ~ login_re and gitscout.first_seen(v, 'duel', a || '|' || b) then
      insert into gitscout.duel_views as t (left_login, right_login, day, views, source)
      values (a, b, today, 1, 'site')
      on conflict (left_login, right_login, day, source) do update set views = t.views + 1;
    end if;
  end if;
end;
$$;

-- Olaylar da tekil: aynı kişinin aynı olayı aynı veriyle (ör. aynı kartı indirmesi) günde bir kez sayılır.
create function gitscout.record_event(p_name text, p_data jsonb, p_ip text, p_ua text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_data jsonb := coalesce(p_data, '{}');
begin
  if p_name is null or p_name not in (
    'card_requested', 'card_request_failed', 'card_downloaded', 'card_shared',
    'duel_shared', 'github_star_clicked', 'readme_badge_copied'
  ) then
    raise exception 'unknown event' using errcode = '22023';
  end if;
  if not gitscout.first_seen(gitscout.visitor_hash(p_ip, p_ua), 'event', p_name || v_data::text) then
    return;
  end if;

  insert into gitscout.events as t (day, name, data, count, visitors, source)
  values ((now() at time zone 'utc')::date, p_name, v_data, 1, 1, 'site')
  on conflict (day, name, data, source) do update
    set count = t.count + 1, visitors = t.visitors + 1;
end;
$$;

revoke all on function
  gitscout.visitor_hash(text, text),
  gitscout.first_seen(bytea, text, text),
  gitscout.under_daily_cap(bytea),
  gitscout.record_page_view(text, text, text),
  gitscout.record_event(text, jsonb, text, text)
  from public, anon, authenticated, service_role;
grant execute on function
  gitscout.record_page_view(text, text, text),
  gitscout.record_event(text, jsonb, text, text)
  to gitscout_app;
