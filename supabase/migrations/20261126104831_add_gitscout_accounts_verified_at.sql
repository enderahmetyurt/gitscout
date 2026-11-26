-- Hesabın ilk kez onaylı sayıldığı an. Onay düşerse boşalır, yeniden kazanılınca o anın tarihini alır.
alter table gitscout.accounts add column verified_at timestamptz;
update gitscout.accounts set verified_at = created_at where eligible and verified_at is null;
alter table gitscout.accounts add constraint accounts_verified_at_matches_eligible check ((verified_at is not null) = eligible);
grant update (verified_at) on gitscout.accounts to gitscout_app;
