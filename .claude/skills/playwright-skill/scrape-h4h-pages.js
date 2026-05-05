const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const BASE = 'https://hackin4harden.com'
const PAGES = ['/about-us', '/registration', '/contact-us', '/photos']
const OUT_DIR = path.join(__dirname, 'h4h-scrape')
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
  })
  const page = await context.newPage()

  for (const p of PAGES) {
    const url = BASE + p
    const slug = p.replace(/\//g, '_').replace(/^_/, '')
    try {
      console.log('Visit', url)
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(1500)
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let total = 0
          const distance = 400
          const timer = setInterval(() => {
            window.scrollBy(0, distance)
            total += distance
            if (total >= document.body.scrollHeight) {
              clearInterval(timer)
              resolve()
            }
          }, 150)
        })
      })
      await page.waitForTimeout(1000)

      const text = await page.evaluate(() => document.body.innerText)
      fs.writeFileSync(path.join(OUT_DIR, `${slug}-text.txt`), text)

      const headings = await page.evaluate(() => {
        const items = []
        document.querySelectorAll('h1, h2, h3, h4').forEach((h) => {
          const t = (h.innerText || '').trim()
          if (t) items.push({ tag: h.tagName, text: t })
        })
        return items
      })
      fs.writeFileSync(
        path.join(OUT_DIR, `${slug}-headings.json`),
        JSON.stringify(headings, null, 2),
      )

      await page.screenshot({ path: path.join(OUT_DIR, `${slug}.png`), fullPage: true })
      console.log('  saved', slug, 'text=', text.length)
    } catch (e) {
      console.error('  fail', url, e.message)
    }
  }
  await browser.close()
  console.log('DONE')
})()
