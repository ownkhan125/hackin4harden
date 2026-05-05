const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const BASE = 'https://hackin4harden.com'
const PAGES = ['/', '/about-us', '/registration', '/contact-us', '/photos']
const OUT = path.join(__dirname, 'h4h-scrape', 'fresh')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
  })
  const page = await ctx.newPage()

  for (const p of PAGES) {
    const url = BASE + p
    const slug = p === '/' ? 'home' : p.replace(/\//g, '_').replace(/^_/, '')
    try {
      console.log('GET', url)
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(1500)
      // auto-scroll to load lazy
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
          }, 130)
        })
      })
      await page.waitForTimeout(800)
      const text = await page.evaluate(() => document.body.innerText)
      fs.writeFileSync(path.join(OUT, `${slug}.txt`), text)
      console.log('  ', text.length, 'chars')
    } catch (e) {
      console.error('  FAIL', e.message)
    }
  }
  await browser.close()
})()
