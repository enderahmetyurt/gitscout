-- Kişinin isteğe bağlı profil bilgileri: şehir, cinsiyet ve rüya takımı. Yalnızca ekleme yapan, geri alınabilir bir değişiklik.
-- Hiçbiri herkese açık oyuncu verisine eklenmez; yalnızca kişinin kendisine ve toplu istatistiklere gider.

-- Serbest metin şehir adı. Harf denetimi uygulamada yapılır; burada yalnızca boşluk, uzunluk ve rakam sınırı var.
alter table gitscout.accounts add column city text
  check (
    char_length(city) between 2 and 60
    and city = btrim(city)
    and city !~ '\s{2}'
    and city !~ '[[:digit:][:cntrl:]]'
  );
alter table gitscout.accounts add column city_updated_at timestamptz;

-- Beyan edilen cinsiyet; boş bırakılabilir.
alter table gitscout.accounts add column gender text check (gender in ('female', 'male'));
alter table gitscout.accounts add column gender_updated_at timestamptz;

grant update (city, city_updated_at, gender, gender_updated_at) on gitscout.accounts to gitscout_app;

-- Rüya takımı: en fazla beş oyuncu, her biri bir kez. Sıra (slot) kişinin seçtiği sıradır.
create table gitscout.dream_team_picks (
  github_id bigint not null references gitscout.accounts (github_id) on delete cascade,
  slot smallint not null check (slot between 1 and 5),
  player_login text not null references gitscout.players (login) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (github_id, slot),
  unique (github_id, player_login)
);

-- "En çok seçilen" sayımları için.
create index dream_team_picks_player_login_idx on gitscout.dream_team_picks (player_login);

-- Data API rolleri hiçbir şekilde erişemez.
revoke all on gitscout.dream_team_picks from public, anon, authenticated, service_role;

-- Kadro her kayıtta silinip yeniden yazılır; güncelleme yetkisi gerekmez.
grant select, insert, delete on gitscout.dream_team_picks to gitscout_app;

alter table gitscout.dream_team_picks enable row level security;
alter table gitscout.dream_team_picks force row level security;

create policy dream_team_picks_read on gitscout.dream_team_picks for select to gitscout_app using (true);
create policy dream_team_picks_insert on gitscout.dream_team_picks for insert to gitscout_app with check (true);
create policy dream_team_picks_delete on gitscout.dream_team_picks for delete to gitscout_app using (true);
