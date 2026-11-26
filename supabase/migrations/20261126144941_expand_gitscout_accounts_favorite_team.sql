-- Favori takım listesi dört büyüklerden 30 takıma genişler (Türkiye, İngiltere, İspanya, Almanya, İtalya, Fransa).
-- Yalnızca izin verilen değerleri genişletir; mevcut kayıtlar zaten yeni listenin içinde. Liste
-- `src/constants/team.constants.ts` içindeki `TEAMS` ile aynı tutulur.
alter table gitscout.accounts drop constraint accounts_favorite_team_check;
alter table gitscout.accounts add constraint accounts_favorite_team_check
  check (favorite_team in (
    'galatasaray', 'fenerbahce', 'besiktas', 'trabzonspor', 'bursaspor', 'goztepe',
    'arsenal', 'chelsea', 'liverpool', 'manchester-city', 'manchester-united', 'tottenham',
    'real-madrid', 'barcelona', 'atletico-madrid', 'athletic-club', 'sevilla', 'valencia',
    'bayern-munchen', 'borussia-dortmund', 'bayer-leverkusen',
    'inter', 'juventus', 'milan', 'napoli', 'roma', 'lazio',
    'paris-saint-germain', 'marseille', 'lyon'
  ));
