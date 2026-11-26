const COLORS = ["var(--github-star)", "var(--verified)", "var(--chart-away)", "var(--chart-home)"]
const PIECES = 36

/**
 * Doğum günü kartı açılınca bir kez yağan konfeti. Konumlar sabit bir diziden türetilir:
 * sunucu ve tarayıcı aynı HTML'i üretir. Hareketi azaltma tercihinde parçalar hiç görünmez.
 */
export function BirthdayConfetti() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-40 h-0">
      {Array.from({ length: PIECES }, (_, index) => {
        const left = (index * 37) % 100
        const delay = (index % 9) * 90
        const drift = ((index * 53) % 120) - 60
        const spin = 180 + ((index * 71) % 540)
        return (
          <span
            key={`piece-${left}-${delay}`}
            className="birthday-confetti-piece"
            style={{
              left: `${left}%`,
              backgroundColor: COLORS[index % COLORS.length],
              animationDelay: `${delay}ms`,
              ["--drift" as string]: `${drift}px`,
              ["--spin" as string]: `${spin}deg`
            }}
          />
        )
      })}
    </div>
  )
}
