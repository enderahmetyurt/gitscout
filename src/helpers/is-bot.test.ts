import { describe, expect, it } from "vitest"

import { isBot } from "@/helpers/is-bot"

describe("isBot", () => {
  it.each([
    undefined,
    "",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Twitterbot/1.0",
    "facebookexternalhit/1.1",
    "curl/8.4.0",
    "python-requests/2.31",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 HeadlessChrome/120.0 Safari/537.36"
  ])("treats %s as a bot", (userAgent) => expect(isBot(userAgent)).toBe(true))

  it.each([
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0"
  ])("treats a browser as a person", (userAgent) => expect(isBot(userAgent)).toBe(false))
})
