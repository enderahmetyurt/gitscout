-- Supabase aynı e-postayı paylaşan iki GitHub hesabını tek kullanıcıya bağlayabilir; kimlik GitHub numarasıdır,
-- Supabase kullanıcı numarası birden çok hesapta tekrar edebilir.
alter table gitscout.accounts drop constraint accounts_auth_user_id_key;
