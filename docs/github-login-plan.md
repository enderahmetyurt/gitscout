# GitHub ile giriş

Giriş isteğe bağlı. Kart oluşturmak, sıralamaya bakmak ve düello için gerekmez. Profili sahiplenmek, onaylı işareti almak ve profilden ülke seçmek için kullanılır.

## Güvenlik modeli

- **Supabase Auth yalnızca OAuth aracısı.** Tarayıcıda Supabase istemcisi, anahtarı ya da oturumu yok. GitHub kodu sunucuda oturuma çevrilir, kimlik okunur ve Supabase oturumu hemen `signOut({ scope: "global" })` ile kapatılır.
- **Oturum uygulamanın kendisinde.** Tarayıcıda yalnızca `gs_session` adlı httpOnly, `secure`, `sameSite=lax` çerezde 32 baytlık rastgele bir anahtar durur. Veritabanında anahtarın kendisi değil SHA-256 özeti tutulur (`gitscout.sessions`). Süre 30 gün.
- **Doğru hesap kesin seçilir.** Hangi GitHub hesabının giriş yaptığı, bu girişin GitHub anahtarıyla `GET /user` çağrılarak belirlenir. Anahtar saklanmaz. `user_metadata` hiç okunmaz.
- **Hesap verisi GitHub'dan gelir.** Kullanıcı adı, takipçi sayısı ve hesap tarihi sunucunun GitHub API çağrısından alınır.
- **Her yetki kontrolü sunucuda.** `updateProfileCountry` kişiyi yalnızca oturum çerezinden okur. İstekte kullanıcı adı ya da kimlik alınmaz, kişi yalnızca kendi kaydını değiştirebilir. Onay ve 10 saniyelik sıklık sınırı SQL'de kontrol edilir.
- **Veritabanı Data API'ye kapalı.** `accounts` ve `sessions` tablolarında `anon`, `authenticated` ve `service_role` için hiçbir yetki yok. Supabase'in verdiği `authenticated` JWT'si `gitscout` şemasına erişemez. Uygulama rolü hesap silemez, yalnızca gereken sütunları güncelleyebilir.
- **Yönlendirmeler sabit.** Geri dönüş adresi istekten değil `VITE_APP_URL` ayarından kurulur. Girişten sonra her zaman `/u/<login>` sayfasına gidilir.
- **Giriş CSRF'i engelli.** PKCE doğrulayıcısı httpOnly çerezde tutulur; kodu yalnızca girişi başlatan tarayıcı oturuma çevirebilir. Başlatma ve çıkış POST server function, CSRF ara katmanından geçer.

## Onay koşulu

Hesap en az 6 aylık ve en az 5 takipçili olmalı (`src/constants/account.constants.ts`). Her girişte yeniden hesaplanır. Koşulu sağlamayan giriş yapabilir ama onaylı işaret almaz ve ayar değiştiremez.

## Dosyalar

- `supabase/migrations/20261126101332_create_gitscout_accounts.sql`, `…102507_drop_gitscout_accounts_auth_user_unique.sql`
- `src/lib/supabase-auth.ts`: OAuth başlatma, kod değişimi, kimlik okuma
- `src/lib/session.ts`: oturum açma, okuma, silme
- `src/lib/auth.functions.ts`: `getViewer`, `startGithubLogin`, `logout`, sunucuya özel `getCurrentViewer`
- `src/routes/auth/callback.ts`: geri dönüş
- `src/features/scout/api/sync-account.api.ts`: hesabı GitHub'dan doğrulayıp kaydetme, kart yoksa ekleme
- `src/features/scout/api/players.functions.ts`: `updateProfileCountry`
- `src/features/scout/api/player-store.ts`: oyuncu okumalarına onay ve seçilen ülke ekleme
- Arayüz: `AccountButton`, `LoginPage`, `ProfileOwnerPanel`, `VerifiedIcon`

## Ülke önceliği

Onaylı sahibin seçtiği ülke, sonra elle tutulan liste, sonra GitHub konumu (`playerCountry`).

## Ortam değişkenleri

- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`: yalnızca sunucu, `VITE_` öneki yok
- `VITE_APP_URL`: canlıda tam olarak `https://gitscout.io`

## Bilinen sınırlar

- Onaylı bir kişi kullanıcı adını değiştirir ve eski adı başkası alırsa, onay ve ülke eski sahibi yeniden giriş yapana kadar o adda kalır. Haftalık yenilemede temizlenebilir.
- Onaylı işaret kart görselinde ve OG görselinde henüz yok.

## Faz 2

Favori geliştirici oylaması ve sıralaması (kişi başı oy sınırı ve onay koşulu zorunlu).
