-- Kişinin beyan ettiği doğum tarihi. Herkese açık gösterilmez; yalnızca o gün doğum günü olup olmadığı hesaplanır.
-- İlk kayıt ve bir düzeltme hakkı: en fazla iki kez yazılabilir, sonra kilitlenir.
alter table gitscout.accounts add column birth_date date check (birth_date >= date '1900-01-01');
alter table gitscout.accounts add column birth_date_changes smallint not null default 0 check (birth_date_changes between 0 and 2);
grant update (birth_date, birth_date_changes) on gitscout.accounts to gitscout_app;
