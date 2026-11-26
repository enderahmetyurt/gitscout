-- Şehir, cinsiyet ve rüya takımı kayıtlarının sıklık sınırı için. Ülke ve girişteki güncellemelerden bağımsızdır.
alter table gitscout.accounts add column profile_updated_at timestamptz;
grant update (profile_updated_at) on gitscout.accounts to gitscout_app;
