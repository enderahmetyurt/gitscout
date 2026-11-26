-- Görüntülenme ve olay sayaçları. İlk veri Vercel Web Analytics'ten aktarılır (source = 'vercel');
-- sitenin kendi sayımı aynı tablolara source = 'site' ile yazılacak.
-- Satırlar kalıcıdır: hiçbir role silme yetkisi verilmez.

-- Vercel'deki bütün sayfa görüntülemeleri, yol ve gün bazında; ham arşiv.
create table gitscout.page_views (
  day date not null,
  path text not null check (char_length(path) between 1 and 2048),
  pageviews integer not null check (pageviews >= 0),
  visitors integer not null check (visitors >= 0),
  source text not null check (source in ('vercel', 'site')),
  imported_at timestamptz not null default now(),
  primary key (day, path, source)
);

-- Profil görüntülenmeleri: /u/<login>, dil öneki ve büyük-küçük harf farkı birleştirilmiş.
create table gitscout.profile_views (
  login text not null
    check (login = lower(login) and login ~ '^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$'),
  day date not null,
  views integer not null check (views >= 0),
  source text not null check (source in ('vercel', 'site')),
  primary key (login, day, source)
);
create index profile_views_day_idx on gitscout.profile_views (day, views desc);

-- Kapışma görüntülenmeleri: A–B ile B–A aynı satırdır, kullanıcı adları alfabetik sıralı tutulur.
create table gitscout.duel_views (
  left_login text not null
    check (left_login = lower(left_login) and left_login ~ '^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$'),
  right_login text not null
    check (right_login = lower(right_login) and right_login ~ '^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$'),
  day date not null,
  views integer not null check (views >= 0),
  source text not null check (source in ('vercel', 'site')),
  check (left_login < right_login),
  primary key (left_login, right_login, day, source)
);
create index duel_views_day_idx on gitscout.duel_views (day, views desc);

-- Özel olaylar (kart isteği, paylaşım, rozet kopyalama...), gün ve olay verisine göre.
create table gitscout.events (
  day date not null,
  name text not null check (name ~ '^[a-z_]{1,64}$'),
  data jsonb not null default '{}'
    check (jsonb_typeof(data) = 'object' and octet_length(data::text) <= 2000),
  count integer not null check (count >= 0),
  visitors integer not null check (visitors >= 0),
  source text not null check (source in ('vercel', 'site')),
  primary key (day, name, data, source)
);
create index events_name_day_idx on gitscout.events (name, day);

-- Data API rolleri erişemez; uygulama şimdilik yalnızca okur.
revoke all on gitscout.page_views, gitscout.profile_views, gitscout.duel_views, gitscout.events
  from public, anon, authenticated, service_role;
grant select on gitscout.page_views, gitscout.profile_views, gitscout.duel_views, gitscout.events
  to gitscout_app;

alter table gitscout.page_views enable row level security;
alter table gitscout.page_views force row level security;
alter table gitscout.profile_views enable row level security;
alter table gitscout.profile_views force row level security;
alter table gitscout.duel_views enable row level security;
alter table gitscout.duel_views force row level security;
alter table gitscout.events enable row level security;
alter table gitscout.events force row level security;

create policy page_views_read on gitscout.page_views for select to gitscout_app using (true);
create policy profile_views_read on gitscout.profile_views for select to gitscout_app using (true);
create policy duel_views_read on gitscout.duel_views for select to gitscout_app using (true);
create policy events_read on gitscout.events for select to gitscout_app using (true);
