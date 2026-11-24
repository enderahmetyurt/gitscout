import type { Rarity, StatKey } from "@/features/scout/types/player.types"

/**
 * Unvan, oyuncunun en güçlü statı ve kart nadirliğiyle belirlenen tek bir ifadedir.
 * Her kombinasyonda birkaç seçenek var; seçim kullanıcı adına göre sabit olduğundan aynı profil hep aynı unvanı alır.
 */
export const TITLES = {
  act: {
    icon: ["Üretkenliğin Simgesi", "Yorulmak Bilmeyen Efsane", "Sahanın Hâkimi"],
    gold: ["Üretken Usta", "Tempolu Oyun Kurucu", "Verimli Usta"],
    silver: ["Çalışkan Yetenek", "Hırslı Geliştirici", "Tempolu Yetenek"],
    bronze: ["Hevesli Başlangıç", "Isınan Yetenek", "Yolun Başındaki Yetenek"]
  },
  imp: {
    icon: ["Ekosistem Mimarı", "Çığır Açan", "Sektörün Yön Vericisi"],
    gold: ["Etkili Geliştirici", "İz Bırakan Usta", "Değer Üreten Geliştirici"],
    silver: ["Fark Yaratan Yetenek", "Dikkat Çeken Geliştirici", "Parlayan Proje Sahibi"],
    bronze: ["Umut Vadeden Proje Sahibi", "İlk Izini Bırakan", "Gelecek Vaat Eden"]
  },
  com: {
    icon: ["Topluluk İkonu", "Neslinin İlham Kaynağı", "Kitlelerin Rehberi"],
    gold: ["Topluluk Lideri", "İlham Veren Geliştirici", "Sözü Dinlenen Usta"],
    silver: ["Sevilen Geliştirici", "Takip Edilen Yetenek", "Topluluğun Yükselen Sesi"],
    bronze: ["Yükselen İsim", "Tanınmaya Başlayan", "Topluluğun Yeni Yüzü"]
  },
  rep: {
    icon: ["Açık Kaynak Efsanesi", "Açık Kaynağın Mihenk Taşı", "Güvenin Adresi"],
    gold: ["Güvenilir Katkıcı", "Açık Kaynak Elçisi", "Saygın Usta"],
    silver: ["Saygın Katkıcı", "Yardımsever Geliştirici", "Takım Oyuncusu"],
    bronze: ["Açık Kaynak Gönüllüsü", "Katkıya Hevesli", "İlk Katkısını Yapan"]
  },
  con: {
    icon: ["İstikrar Abidesi", "Zamana Meydan Okuyan", "Hiç Durmayan Efsane"],
    gold: ["İstikrarlı Usta", "Kararlı Lider", "Demir İradeli Usta"],
    silver: ["Disiplinli Geliştirici", "Kararlı Yetenek", "Güvenilir Oyuncu"],
    bronze: ["İstikrarlı Yetenek", "Sabırlı Başlangıç", "Kararlı Çaylak"]
  },
  exp: {
    icon: ["Yaşayan Efsane", "Kuşakların Ustası", "Zamansız Usta"],
    gold: ["Deneyimli Kaptan", "Kıdemli Usta", "Tecrübenin Sesi"],
    silver: ["Tecrübeli Geliştirici", "Kıdemli Oyuncu", "Yılların Geliştiricisi"],
    bronze: ["Sessiz Emektar", "Deneyimli Başlangıç", "Yılların Birikimi"]
  }
} as const satisfies Record<StatKey, Record<Rarity, readonly string[]>>
