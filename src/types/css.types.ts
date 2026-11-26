import "react"

declare module "react" {
  /** Satır içi stilde CSS değişkenleri (`--card-accent` gibi) tip dönüşümü olmadan yazılabilsin. */
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
