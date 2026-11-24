# Gitscout

**GitHub profilini koleksiyon kartına çevir, liderlik tablosunda yerini gör.**

Gitscout, herkese açık bir GitHub profilini okuyup ona bir puan, altı istatistik ve bir rol veren bir koleksiyon kartı çıkarır. Kullanıcı adını yazman yeterli: birkaç saniye sonra kartın hazır, sıralamadaki yerin belli.

## Nasıl çalışır?

1. Bir GitHub kullanıcı adı yaz.
2. Gitscout profilin herkese açık verisini okur: katkılar, repolar, yıldızlar, takipçiler, kabul edilen pull request'ler.
3. Bu veriden altı istatistik ve bir genel puan hesaplanır, kartın çıkar ve liderlik tablosuna girer.

Puanlar yapay zekâdan değil, herkesin görebildiği basit formüllerden gelir. Tam puan dünyanın en uç profillerine göre belirlendiği için 90 ve üstü gerçekten nadirdir.

## Kartın üzerinde neler var?

**Genel puan ve kart türü**

| Kart  | Puan  |
| ----- | ----- |
| İkon  | 90+   |
| Altın | 75–89 |
| Gümüş | 65–74 |
| Bronz | 0–64  |

**Altı istatistik**

- **Aktivite:** Son bir yıldaki katkılar.
- **Etki:** Repolarının yıldız ve fork'ları.
- **Topluluk:** Takipçi sayısı.
- **Saygınlık:** Başkalarının projelerine kabul edilen PR'lar ve code review'lar.
- **İstikrar:** Ne kadar düzenli katkı verdiğin.
- **Kıdem:** Kaç yıldır aktif olarak kod ürettiğin.

**Rol, unvan ve rozetler**

- **Rol:** Repolarındaki dillerden çıkar: Frontend, Backend, Full Stack, Mobile, Data, DevOps, Systems ya da Game Dev.
- **Unvan:** En güçlü istatistiğinden ve kart türünden gelir.
- **Rozetler:** Uzun seriler, çok sayıda review ya da iyi belgelenmiş repolar gibi başarıları gösterir.

## Örnek kart

[Ömer Gülçiçek](https://github.com/omergulcicek):

> **78 · Altın kart · Frontend**
> _Üretken Geliştirici_
>
> | Aktivite | Etki | Topluluk | Saygınlık | İstikrar | Kıdem |
> | :------: | :--: | :------: | :-------: | :------: | :---: |
> |    86    |  78  |    70    |    59     |    82    |  84   |
>
> **Scout notu:** Son bir yılda çok sayıda katkı verdi · Uzun yıllardır GitHub'da aktif
> **Gelişim alanı:** Başka projelere katkı

## Profil sayfasında başka neler var?

- **Scout notu:** Güçlü yönlerin ve gelişim alanın, kısa cümlelerle.
- **Öne çıkan repolar:** En çok yıldız alan projelerin.
- **Diğer geliştiricilerle kıyas:** Commit, aktif gün, en uzun seri, yıldız ve takipçide listedeki geliştiricilerin yüzde kaçının önünde olduğun.
- **Paylaş ve indir:** Kartını görsel olarak indirip X ya da LinkedIn'de paylaşabilirsin.

## Kapışma

İki geliştiriciyi seç, altı istatistikte karşı karşıya gelsinler. Daha çok istatistikte önde olan kazanır; eşitlikte genel puana bakılır. Sonucu link ya da görsel olarak paylaşabilirsin.

## Bilmen gerekenler

- Puanlar bir yazılımcının ne kadar iyi olduğunu değil, GitHub'daki görünür aktivitesini ölçer. Çok iyi bir yazılımcı GitHub'da sessiz olabilir.
- Bütün veriler GitHub'ın herkese açık API'sinden gelir. Private repoların içeriği okunmaz; e-posta ya da iletişim bilgisi saklanmaz.
- Herkes herhangi bir kullanıcı adını ekleyebilir. Listede yer almak istemiyorsan bir [issue aç](https://github.com/omergulcicek/gitscout/issues/new), kartın kaldırılır.

---

[Ömer Gülçiçek](https://github.com/omergulcicek) tarafından yapıldı.
