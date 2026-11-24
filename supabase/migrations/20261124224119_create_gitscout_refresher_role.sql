-- Haftalık otomatik yenileme için ayrı rol. Sitenin rolü (gitscout_app) yalnızca okuma ve ekleme yapar;
-- ham veriyi güncelleme yetkisi yalnızca bu rolde ve yalnızca zamanlanmış yenileme işi kullanır.
-- Rolün şifresi bu dosyada yok: ayrı olarak SCRAM doğrulayıcısıyla atanır.

create role gitscout_refresher with login noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls connection limit 3;
alter role gitscout_refresher set statement_timeout = '15s';
alter role gitscout_refresher set idle_in_transaction_session_timeout = '15s';
alter role gitscout_refresher set search_path = gitscout;

grant usage on schema gitscout to gitscout_refresher;
grant select on gitscout.players to gitscout_refresher;
grant update (facts, scored, score_version, ovr, fetched_at) on gitscout.players to gitscout_refresher;

create policy players_refresh_read on gitscout.players for select to gitscout_refresher using (true);
create policy players_refresh_update on gitscout.players for update to gitscout_refresher using (true) with check (true);
