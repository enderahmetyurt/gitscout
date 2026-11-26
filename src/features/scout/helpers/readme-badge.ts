/** Rozet Markdown'ının parçaları; ayarlar sayfası satırı bunlarla renklendirir. */
export function readmeBadgeParts(siteUrl: string, login: string) {
  return {
    alt: "Gitscout",
    image: `${siteUrl}/badge/${login}.svg`,
    link: `${siteUrl}/u/${login}`
  }
}

/**
 * Profil README'sine eklenecek rozet. Görsel ve bağlantı aynı kullanıcı adını taşır; bağlantı oyuncu
 * sayfasına gider. Biçim `public/llms.txt` içindeki örnekle aynı kalmalı: ajanlar rozeti oradan tanır.
 */
export function readmeBadgeMarkdown(siteUrl: string, login: string): string {
  const { alt, image, link } = readmeBadgeParts(siteUrl, login)
  return `[![${alt}](${image})](${link})`
}
