import { Users } from "lucide-react"

export function EmptyLeaderboard() {
  return (
    <div className="surface flex flex-col items-center gap-2 px-6 py-14 text-center">
      <Users aria-hidden className="size-6 text-muted-foreground" />
      <p className="font-medium">Henüz oyuncu yok</p>
      <p className="text-sm text-muted-foreground">İlk kartı ana sayfadaki formdan çıkar.</p>
    </div>
  )
}
