-- Gitscout şeması. Supabase projesi başka uygulamalarla paylaşılıyor; bu şema Data API'ye açılmaz.
-- Uygulama yalnızca sunucudan, kendi kısıtlı rolüyle (gitscout_app) bağlanır.
-- Rolün şifresi bu dosyada yok: ayrı olarak SCRAM doğrulayıcısıyla atanır, düz metin hiçbir yere yazılmaz.

create schema gitscout;
revoke all on schema gitscout from public;

create table gitscout.players (
  -- GitHub kullanıcı adı, küçük harfle: GitHub'ın kuralı (harf, rakam, tek tire, en fazla 39 karakter).
  login text primary key
    check (login = lower(login) and login ~ '^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$'),
  -- GitHub'dan bir kez çekilen ham veri; puanlamanın kaynağı.
  facts jsonb not null check (jsonb_typeof(facts) = 'object' and octet_length(facts::text) <= 1000000),
  -- Puanlanmış özet: listeler ham veriyi okumadan buradan beslenir.
  scored jsonb not null check (jsonb_typeof(scored) = 'object' and octet_length(scored::text) <= 100000),
  score_version integer not null check (score_version > 0),
  ovr smallint not null check (ovr between 0 and 100),
  fetched_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index players_ovr_idx on gitscout.players (ovr desc, login);
create index players_created_at_idx on gitscout.players (created_at desc);

-- Data API rolleri hiçbir şekilde erişemez.
revoke all on gitscout.players from public, anon, authenticated, service_role;
alter default privileges in schema gitscout revoke all on tables from public, anon, authenticated, service_role;

-- Uygulama rolü: yalnızca bu şema; okuma ve ekleme. Silme yok; güncelleme yalnızca formül
-- değişince yeniden hesaplanan özet sütunlarında.
create role gitscout_app with login noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls connection limit 10;
alter role gitscout_app set statement_timeout = '8s';
alter role gitscout_app set idle_in_transaction_session_timeout = '15s';
alter role gitscout_app set search_path = gitscout;

grant usage on schema gitscout to gitscout_app;
grant select, insert on gitscout.players to gitscout_app;
grant update (scored, score_version, ovr) on gitscout.players to gitscout_app;

alter table gitscout.players enable row level security;
alter table gitscout.players force row level security;
create policy players_read on gitscout.players for select to gitscout_app using (true);
create policy players_insert on gitscout.players for insert to gitscout_app with check (true);
create policy players_rescore on gitscout.players for update to gitscout_app using (true) with check (true);
