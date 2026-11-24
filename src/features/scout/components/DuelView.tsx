import { Link } from "@tanstack/react-router"
import { ArrowLeftRight, Link2, Share2 } from "lucide-react"
import { cn } from "cn"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { PlayerCard } from "@/features/scout/components/PlayerCard"
import { STAT_LABELS } from "@/features/scout/constants/scoring.constants"
import { SHARE_TARGETS } from "@/features/scout/constants/share.constants"
import { STAT_TIER_TEXT } from "@/features/scout/constants/stat-tier.constants"
import { computeDuel } from "@/features/scout/helpers/duel"
import type { Duel, DuelSide } from "@/features/scout/helpers/duel"
import { statTier } from "@/features/scout/helpers/stat-tier"
import { usePlayer } from "@/features/scout/hooks/use-player"
import type { ScoredPlayer } from "@/features/scout/types/player.types"

type DuelViewProps = {
  left: string
  right: string
}

const number = new Intl.NumberFormat("tr-TR")

export function DuelView({ left: leftLogin, right: rightLogin }: DuelViewProps) {
  const { data: left } = usePlayer(leftLogin)
  const { data: right } = usePlayer(rightLogin)
  const duel = computeDuel(left, right)
  const winner = duel.winner === "left" ? left : duel.winner === "right" ? right : null

  const copyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("Link kopyalandı"))
      .catch(() => toast.error("Link kopyalanamadı"))
  }

  const shareOnX = () => {
    const x = SHARE_TARGETS[0]
    const text = winner
      ? `Gitscout kapışması: ${left.name} ${duel.score.left}–${duel.score.right} ${right.name}. Kazanan: ${winner.name}`
      : `Gitscout kapışması: ${left.name} ${duel.score.left}–${duel.score.right} ${right.name}. Berabere!`
    window.open(x.buildUrl(window.location.href, text), "_blank", "noopener,noreferrer")
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pt-6 pb-20 sm:px-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Kapışma
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {left.name} <span className="text-muted-foreground">vs</span> {right.name}
        </h1>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[20rem_1fr_20rem]">
        <DuelCorner player={left} isWinner={duel.winner === "left"} />

        <section aria-label="Maç özeti" className="flex flex-col gap-6 lg:order-none">
          <Scoreboard duel={duel} winner={winner} />
          <Rounds duel={duel} />
          <Receipts left={left} right={right} />
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Link2 aria-hidden />
              Linki kopyala
            </Button>
            <Button variant="outline" size="sm" onClick={shareOnX}>
              <Share2 aria-hidden />
              X'te paylaş
            </Button>
            <Link
              to="/vs/$left/$right"
              params={{ left: right.login, right: left.login }}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ArrowLeftRight aria-hidden />
              Yer değiştir
            </Link>
            <Link to="/vs" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Başka kapışma
            </Link>
          </div>
        </section>

        <DuelCorner player={right} isWinner={duel.winner === "right"} />
      </div>
    </main>
  )
}

function DuelCorner({ player, isWinner }: { player: ScoredPlayer; isWinner: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Link
        to="/u/$username"
        params={{ username: player.login }}
        aria-label={`${player.name} kartını aç`}
        className={cn(
          "card-lift rounded-[28px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          !isWinner && "opacity-90"
        )}
      >
        <PlayerCard player={player} />
      </Link>
      <p className="text-sm text-muted-foreground">@{player.login}</p>
    </div>
  )
}

function Scoreboard({ duel, winner }: { duel: Duel; winner: ScoredPlayer | null }) {
  const reason =
    duel.decidedBy === "rounds"
      ? "Daha çok statta önde"
      : duel.decidedBy === "ovr"
        ? "Stat sayısı eşit; genel puan belirledi"
        : "Stat sayısı ve genel puan eşit"

  return (
    <div className="surface flex flex-col items-center gap-3 px-4 py-5 text-center">
      <p
        className="font-display text-6xl leading-none font-semibold tracking-tight"
        aria-label={`Skor ${duel.score.left}-${duel.score.right}`}
      >
        {duel.score.left}
        <span className="px-3 text-muted-foreground">–</span>
        {duel.score.right}
      </p>
      <p className="text-lg font-semibold">{winner ? `Kazanan: ${winner.name}` : "Berabere"}</p>
      <p className="text-sm text-muted-foreground">{reason}</p>
      <div className="flex w-full flex-col gap-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>%{Math.round(duel.dominance.left * 100)}</span>
          <span>Üstünlük</span>
          <span>%{Math.round(duel.dominance.right * 100)}</span>
        </div>
        <div aria-hidden className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
          <span className="bg-foreground" style={{ width: `${duel.dominance.left * 100}%` }} />
          <span
            className="bg-muted-foreground/40"
            style={{ width: `${duel.dominance.right * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function Rounds({ duel }: { duel: Duel }) {
  return (
    <ul className="surface flex flex-col gap-3 px-4 py-4" aria-label="Stat karşılaştırması">
      {duel.rounds.map((round) => (
        <li
          key={round.key}
          className="grid grid-cols-[2.5rem_1fr_3.5rem_1fr_2.5rem] items-center gap-2 text-sm"
        >
          <RoundValue value={round.left} wins={round.winner === "left"} align="left" />
          <RoundBar value={round.left} wins={round.winner === "left"} side="left" />
          <span lang="en" className="text-center text-xs font-semibold text-muted-foreground">
            {STAT_LABELS[round.key].short}
            <span className="sr-only">
              {" "}
              ({STAT_LABELS[round.key].label}
              {round.winner ? `, ${round.winner === "left" ? "sol" : "sağ"} kazandı` : ", eşit"})
            </span>
          </span>
          <RoundBar value={round.right} wins={round.winner === "right"} side="right" />
          <RoundValue value={round.right} wins={round.winner === "right"} align="right" />
        </li>
      ))}
    </ul>
  )
}

function RoundValue({ value, wins, align }: { value: number; wins: boolean; align: DuelSide }) {
  return (
    <span
      className={cn(
        "text-base",
        align === "left" ? "text-left" : "text-right",
        wins ? "font-semibold" : "opacity-60",
        STAT_TIER_TEXT[statTier(value)]
      )}
    >
      {value}
    </span>
  )
}

function RoundBar({ value, wins, side }: { value: number; wins: boolean; side: DuelSide }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-1.5 overflow-hidden rounded-full bg-muted",
        side === "left" && "justify-end"
      )}
    >
      <span
        className={cn("h-full rounded-full", wins ? "bg-foreground" : "bg-muted-foreground/40")}
        style={{ width: `${value}%` }}
      />
    </span>
  )
}

function Receipts({ left, right }: { left: ScoredPlayer; right: ScoredPlayer }) {
  const rows = [
    { label: "Commit (son 1 yıl)", left: left.year.commits, right: right.year.commits },
    { label: "Pull request (son 1 yıl)", left: left.year.prs, right: right.year.prs },
    { label: "Review (son 1 yıl)", left: left.year.reviews, right: right.year.reviews },
    { label: "Aktif gün (son 1 yıl)", left: left.year.activeDays, right: right.year.activeDays },
    { label: "Yıldız", left: left.career.stars, right: right.career.stars },
    { label: "Takipçi", left: left.career.followers, right: right.career.followers },
    {
      label: "Toplam katkı",
      left: left.career.contributions,
      right: right.career.contributions
    }
  ]

  return (
    <div className="surface overflow-hidden">
      <h2 className="px-4 pt-4 pb-2 text-center text-sm font-medium">Rakamlar</h2>
      <table className="w-full text-sm">
        <caption className="sr-only">
          {left.name} ve {right.name} için ham sayılar
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">{left.name}</th>
            <th scope="col">Ölçü</th>
            <th scope="col">{right.name}</th>
          </tr>
        </thead>
        <tbody className="divide-y border-t">
          {rows.map((row) => (
            <tr key={row.label}>
              <td
                className={cn(
                  "w-1/4 px-4 py-2",
                  row.left > row.right ? "font-semibold" : "text-muted-foreground"
                )}
              >
                {number.format(row.left)}
              </td>
              <th
                scope="row"
                className="px-2 py-2 text-center text-xs font-normal text-muted-foreground"
              >
                {row.label}
              </th>
              <td
                className={cn(
                  "w-1/4 px-4 py-2 text-right",
                  row.right > row.left ? "font-semibold" : "text-muted-foreground"
                )}
              >
                {number.format(row.right)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
