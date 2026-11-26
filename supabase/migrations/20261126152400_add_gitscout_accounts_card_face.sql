-- Onaylı hesabın profil sayfasında varsayılan olarak gösterilecek kart yüzü. Boşsa gerçek kart.
-- 'team' favori takımın kartı, 'github-star' yalnızca GitHub Stars programındakilere açık kart (denetim
-- uygulamada). Sıralama ve kapışmalar her zaman gerçek kartı kullanır. Yalnızca ekleme yapan, geri alınabilir.
alter table gitscout.accounts add column card_face text
  check (card_face in ('team', 'github-star'));

grant update (card_face) on gitscout.accounts to gitscout_app;
