-- Kişinin favori futbol takımı; şimdilik dört büyükler. Boş bırakılabilir. Yalnızca ekleme yapan, geri alınabilir bir değişiklik.
-- Takım kartı ve ileride takıma göre sıralama için. Diğer profil bilgileri gibi aynı sıklık sınırıyla yazılır.
alter table gitscout.accounts add column favorite_team text
  check (favorite_team in ('galatasaray', 'fenerbahce', 'besiktas', 'trabzonspor'));
alter table gitscout.accounts add column favorite_team_updated_at timestamptz;

grant update (favorite_team, favorite_team_updated_at) on gitscout.accounts to gitscout_app;
