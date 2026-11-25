/**
 * Profil README'sine eklenecek rozet. Görsel ve bağlantı aynı kullanıcı adını taşır; bağlantı oyuncu
 * sayfasına gider. Biçim `public/llms.txt` içindeki örnekle aynı kalmalı: ajanlar rozeti oradan tanır.
 */
export function readmeBadgeMarkdown(siteUrl: string, login: string): string {
  return `[![Gitscout](${siteUrl}/badge/${login}.svg)](${siteUrl}/u/${login})`
}
