/**
 * Yapay zekâ ajanı ve bot hesaplarının commit e-postaları. Bu commit'ler commit payının paydasından
 * düşülür: işi bir insan yönetti ama commit kimin adına atıldığını kaydetmiyor.
 */
export const AGENT_COMMIT_EMAILS = [
  // Claude Code
  "noreply@anthropic.com",
  // GitHub Copilot coding agent
  "198982749+Copilot@users.noreply.github.com",
  // OpenAI Codex
  "199175422+chatgpt-codex-connector[bot]@users.noreply.github.com",
  // Cursor background agent
  "cursoragent@cursor.com",
  // Devin
  "158243242+devin-ai-integration[bot]@users.noreply.github.com",
  // Google Jules
  "161369871+google-labs-jules[bot]@users.noreply.github.com",
  "49699333+dependabot[bot]@users.noreply.github.com",
  "41898282+github-actions[bot]@users.noreply.github.com",
  "29139614+renovate[bot]@users.noreply.github.com"
]
