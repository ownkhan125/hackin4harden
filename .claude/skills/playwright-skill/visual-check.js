const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const TARGET_URL = 'http://localhost:3001'
const OUT_DIR = path.join(__dirname, 'h4h-scrape')
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  const errors = []
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console error: ' + msg.text())
  })

  try {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(1500)
    // Auto-scroll
    await page.evaluate(async () => {
      await new Promise((res) => {
        let total = 0
        const t = setInterval(() => {
          window.scrollBy(0, 400)
          total += 400
          if (total >= document.body.scrollHeight) {
            clearInterval(t)
            res()
          }
        }, 120)
      })
    })
    await page.waitForTimeout(1500)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(800)

    await page.screenshot({ path: path.join(OUT_DIR, 'rendered-desktop.png'), fullPage: true })
    console.log('desktop screenshot saved')

    await page.setViewportSize({ width: 390, height: 844 })
    await page.waitForTimeout(800)
    await page.screenshot({ path: path.join(OUT_DIR, 'rendered-mobile.png'), fullPage: true })
    console.log('mobile screenshot saved')

    const headings = await page.evaluate(() => {
      const out = []
      document.querySelectorAll('h1, h2, h3').forEach((h) => {
        const t = (h.innerText || '').trim()
        if (t) out.push({ tag: h.tagName, text: t })
      })
      return out
    })
    fs.writeFileSync(
      path.join(OUT_DIR, 'rendered-headings.json'),
      JSON.stringify(headings, null, 2),
    )
    console.log('headings:', headings.length)

    if (errors.length) {
      console.log('\n*** ERRORS DETECTED ***')
      errors.slice(0, 20).forEach((e) => console.log(' -', e))
    } else {
      console.log('No console/page errors detected')
    }
  } catch (e) {
    console.error('FAIL:', e.message)
  } finally {
    await browser.close()
  }
})()
