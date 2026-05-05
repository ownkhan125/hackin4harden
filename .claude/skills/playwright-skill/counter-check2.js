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

  page.on('pageerror', (e) => console.log('PAGEERR:', e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('CONSOLE_ERR:', m.text())
  })

  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(800)

  // Sample BEFORE scrolling — count should still be 0/initial because not in view
  const initialSamples = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('span[aria-label]'))
      .filter((s) => s.closest('section'))
      .map((s) => ({ aria: s.getAttribute('aria-label'), text: s.innerText }))
  })
  console.log('BEFORE scroll:', JSON.stringify(initialSamples, null, 0))

  // Scroll the metrics grid into view
  await page.evaluate(() => {
    const allH2 = Array.from(document.querySelectorAll('h2'))
    const target = allH2.find((h) => h.innerText.includes('Eleven years on the same course'))
    if (target) target.scrollIntoView({ block: 'center' })
  })

  // Sample over time to capture animation progress
  console.log('\nAfter scroll-into-view:')
  for (let i = 0; i < 14; i++) {
    await page.waitForTimeout(150)
    const vals = await page.evaluate(() =>
      Array.from(document.querySelectorAll('span[aria-label]'))
        .filter((s) => s.closest('section'))
        .map((s) => `${s.getAttribute('aria-label')}=${s.innerText}`)
        .join(' | '),
    )
    console.log(`  +${(i * 150).toString().padStart(4)}ms ${vals}`)
  }

  await page.screenshot({ path: path.join(OUT, 'metrics-final.png'), fullPage: false })
  console.log('\ndone')
  await browser.close()
})()
