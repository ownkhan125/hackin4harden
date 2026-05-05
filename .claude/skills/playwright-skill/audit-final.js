/* Final source-alignment audit. For each route, fetch all rendered text
 * and check it against the authoritative source content. Flag any line
 * containing words/phrases that previously appeared in fabricated copy.
 */
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const BASE = 'http://localhost:3001'
const ROUTES = ['/', '/about', '/photos', '/registration', '/contact', '/privacy', '/terms']
const OUT = path.join(__dirname, 'h4h-scrape', 'final-audit')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

// Phrases that, if found, signal fabricated/embellished content.
// These were ALL present prior to cleanup — they MUST be gone now.
const FAB_FLAGS = [
  'Honor a life',
  'Fund the next swing',
  'Top-of-page recognition',
  'Co-branded signage',
  'Two complimentary foursomes',
  'On-course signage',
  'Co-headline placement',
  'A pin flag carrying your name',
  'Co-branded signage on every cart',
  'Hole signage at one of the eighteen',
  '100% routed',
  'Beneficiary mission',
  'Andy Harden personally reviews',
  'Every message is read and answered',
  '1983 — 2015',
  '1983–2015',
  '2026 · Live',
  'Foursomes filling weekly',
  'Photos uploaded weekly',
  'Carrying his name forward',
  'kid can take their first swing',
  'In memoriam',
  'Sky Harbor',
  'Headline sponsor of the day',
  'Premier on-course presence',
  'Logo on every player shirt',
  'Featured tier',
  'Branded across every cart',
  'Your name on a designated hole',
  "Can't play · still give",
]

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const issues = []

  for (const r of ROUTES) {
    console.log(`\n--- ${r} ---`)
    await page.goto(BASE + r, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(800)
    // Force content to its final visible state
    await page.addStyleTag({
      content: `*[style*="opacity: 0"], *[style*="opacity:0"] { opacity: 1 !important; }
                *[style*="transform"] { transform: none !important; }`,
    })
    await page.waitForTimeout(500)

    const text = await page.evaluate(() => document.body.innerText)
    const slug = r === '/' ? 'home' : r.replace(/\//g, '')
    fs.writeFileSync(path.join(OUT, `${slug}.txt`), text)

    let routeIssues = 0
    for (const phrase of FAB_FLAGS) {
      const idx = text.indexOf(phrase)
      if (idx !== -1) {
        const ctx = text
          .substring(Math.max(0, idx - 20), idx + phrase.length + 30)
          .replace(/\s+/g, ' ')
        issues.push({ route: r, phrase, ctx })
        routeIssues++
      }
    }
    console.log(
      routeIssues === 0 ? '  ✓ no fabricated phrases found' : `  ✗ ${routeIssues} flag(s)`,
    )
  }

  console.log('\n========================')
  if (issues.length === 0) {
    console.log('PASS — all 7 routes clean of flagged fabricated phrases.')
  } else {
    console.log(`FAIL — ${issues.length} fabricated phrase(s) still present:`)
    issues.forEach((i) => console.log(`  [${i.route}] "${i.phrase}" → "${i.ctx}"`))
  }
  console.log('========================')

  await browser.close()
})()
