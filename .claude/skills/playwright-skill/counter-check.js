const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const TARGET_URL = 'http://localhost:3001'
const OUT = path.join(__dirname, 'h4h-scrape', 'counter')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(800)

  // Locate the metrics section by its eyebrow text
  const eyebrow = page.locator('text=/the legacy in numbers/i').first()
  await eyebrow.scrollIntoViewIfNeeded()
  await page.waitForTimeout(80)

  // Sample the rendered count-up text right after entering view, then again later
  const samples = []
  const grab = async () => {
    return await page.evaluate(() => {
      const labels = [
        'Annual tournament',
        'Per individual golfer',
        'Top sponsor tier',
        'Beneficiary mission',
      ]
      const out = {}
      labels.forEach((l) => {
        const p = Array.from(document.querySelectorAll('p')).find((n) => n.innerText.trim() === l)
        if (p) {
          const card = p.closest('div.relative') || p.parentElement
          const num = card?.querySelector('span[aria-label]')
          out[l] = num ? num.innerText : null
        }
      })
      return out
    })
  }

  for (let i = 0; i < 12; i++) {
    samples.push({ ms: i * 150, vals: await grab() })
    await page.waitForTimeout(150)
  }

  console.log('Counter animation samples (ms : values):')
  samples.forEach((s) => console.log('  +' + s.ms + 'ms', JSON.stringify(s.vals)))

  // Final screenshot of the metrics section
  await page
    .locator('section', { has: page.locator('text=/the legacy in numbers/i') })
    .first()
    .screenshot({
      path: path.join(OUT, 'metrics-final.png'),
    })
  console.log('\nfinal screenshot saved')

  await browser.close()
})()
