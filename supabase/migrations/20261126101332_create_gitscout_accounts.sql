-- GitHub ile giriş: profil sahiplenme ve oturumlar. Yalnızca ekleme yapan, geri alınabilir bir değişiklik.
-- Supabase Auth yalnızca GitHub OAuth aracısı olarak kullanılır; Supabase oturumu tarayıcıya hiç gitmez.
-- Oturumu uygulama kendisi tutar: tarayıcıda yalnızca httpOnly bir çerezde rastgele anahtar, burada onun SHA-256 özeti.

create table gitscout.accounts (
  -- GitHub'ın değişmeyen sayısal kimliği. Kullanıcı adı değişebilir, bu değişmez.
  github_id bigint primary key check (github_id > 0),
  auth_user_id uuid not null unique,
  -- Son girişteki kullanıcı adı, küçük harfle. Başka bir hesap bu adı aldıysa eski sahibinde boşaltılır.
  login text unique
    check (login = lower(login) and login ~ '^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$'),
  avatar_url text not null
    check (avatar_url ~ '^https://avatars\.githubusercontent\.com/' and length(avatar_url) <= 500),
  github_created_at timestamptz not null,
  followers integer not null check (followers >= 0),
  -- Eşiği geçen hesap onaylı sayılır ve profil ayarlarını değiştirebilir. Her girişte yeniden hesaplanır.
  eligible boolean not null,
  -- Kişinin kendi seçtiği ülke (ISO 3166-1 alfa-2). Geçerli liste uygulamada doğrulanır.
  country text check (country ~ '^[A-Z]{2}$'),
  country_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table gitscout.sessions (
  token_hash bytea primary key check (octet_length(token_hash) = 32),
  github_id bigint not null references gitscout.accounts (github_id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index sessions_github_id_idx on gitscout.sessions (github_id);

-- Data API rolleri hiçbir şekilde erişemez.
revoke all on gitscout.accounts, gitscout.sessions from public, anon, authenticated, service_role;

-- Uygulama rolü: hesap okur, ekler ve yalnızca gereken sütunları günceller; hesap silemez.
-- Oturumlarda çıkış ve süresi dolanları temizlemek için silme yetkisi var.
grant select, insert on gitscout.accounts to gitscout_app;
grant update (auth_user_id, login, avatar_url, github_created_at, followers, eligible, country, country_updated_at, updated_at)
  on gitscout.accounts to gitscout_app;
grant select, insert, delete on gitscout.sessions to gitscout_app;

alter table gitscout.accounts enable row level security;
alter table gitscout.accounts force row level security;
alter table gitscout.sessions enable row level security;
alter table gitscout.sessions force row level security;

create policy accounts_read on gitscout.accounts for select to gitscout_app using (true);
create policy accounts_insert on gitscout.accounts for insert to gitscout_app with check (true);
create policy accounts_update on gitscout.accounts for update to gitscout_app using (true) with check (true);
create policy sessions_read on gitscout.sessions for select to gitscout_app using (true);
create policy sessions_insert on gitscout.sessions for insert to gitscout_app with check (true);
create policy sessions_delete on gitscout.sessions for delete to gitscout_app using (true);
