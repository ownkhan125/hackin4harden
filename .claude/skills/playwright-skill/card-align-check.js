const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const URL = 'http://localhost:3002/registration'
const OUT = path.join(__dirname, 'h4h-scrape', 'cards')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

const VPS = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'tablet', w: 768, h: 1024 },
  { name: 'mobile', w: 414, h: 896 },
]

;(async () => {
  const browser = await chromium.launch({ headless: true })

  for (const vp of VPS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } })
    const page = await ctx.newPage()
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(800)
    // Force motion to final state for predictable measurement
    await page.addStyleTag({
      content: `
        *[style*="opacity: 0"], *[style*="opacity:0"] { opacity: 1 !important; }
        *[style*="transform"] { transform: none !important; }
      `,
    })
    await page.evaluate(() => {
      const sec = document.querySelector('#tiers')
      if (sec) sec.scrollIntoView({ block: 'start' })
    })
    await page.waitForTimeout(600)

    // Measure each card's height + bottom-of-CTA position relative to card top
    const measurements = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#tiers button.group\\/tier'))
      return cards.map((btn, i) => {
        const cardEl = btn.querySelector(':scope > div')
        const cta = btn.querySelector('p:last-of-type')
        const r = cardEl.getBoundingClientRect()
        const ctar = cta?.getBoundingClientRect() || {}
        return {
          idx: i,
          cardH: Math.round(r.height),
          ctaBottomFromCardTop: Math.round((ctar.bottom || 0) - r.top),
          rowTop: Math.round(r.top),
        }
      })
    })

    // Group by row to verify per-row equality
    const rows = {}
    measurements.forEach((m) => {
      const k = m.rowTop
      if (!rows[k]) rows[k] = []
      rows[k].push(m)
    })

    console.log(`\n=== ${vp.name} (${vp.w}px) ===`)
    Object.keys(rows)
      .sort((a, b) => +a - +b)
      .forEach((rowTop) => {
        const r = rows[rowTop]
        const heights = r.map((m) => m.cardH)
        const ctas = r.map((m) => m.ctaBottomFromCardTop)
        const heightDelta = Math.max(...heights) - Math.min(...heights)
        const ctaDelta = Math.max(...ctas) - Math.min(...ctas)
        console.log(
          `  row@y=${rowTop} [${r.length} cards] heights=${heights.join(',')}  Δh=${heightDelta}  ctaDelta=${ctaDelta}`,
        )
      })

    await page.locator('#tiers').screenshot({ path: path.join(OUT, `${vp.name}.png`) })
    await ctx.close()
  }

  await browser.close()
})()
