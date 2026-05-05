const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const BASE = 'http://localhost:3001'
const ROUTES = ['/', '/about', '/photos', '/registration', '/contact', '/privacy', '/terms']
const OUT = path.join(__dirname, 'h4h-scrape', 'routes')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  const results = []
  for (const r of ROUTES) {
    const url = BASE + r
    const errors = []
    const errHandler = (e) => errors.push(e.message)
    page.on('pageerror', errHandler)

    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForTimeout(800)

      // Force animations to final state for screenshot
      await page.addStyleTag({
        content: `
          *[style*="opacity: 0"], *[style*="opacity:0"] { opacity: 1 !important; }
          *[style*="transform"] { transform: none !important; }
        `,
      })
      await page.waitForTimeout(300)

      const status = resp ? resp.status() : 0
      const title = await page.title()
      const h1 = await page.evaluate(() => document.querySelector('h1')?.innerText || null)
      const slug = r === '/' ? 'home' : r.replace(/\//g, '')
      await page.screenshot({
        path: path.join(OUT, `${slug}.png`),
        fullPage: true,
      })
      results.push({
        route: r,
        status,
        title: title.substring(0, 60),
        h1: h1?.substring(0, 60),
        errors: errors.length,
      })
      console.log(`${r.padEnd(15)} ${status} | h1: ${h1?.substring(0, 50)}`)
    } catch (e) {
      console.log(`${r.padEnd(15)} FAIL: ${e.message.substring(0, 60)}`)
      results.push({ route: r, error: e.message })
    }
    page.off('pageerror', errHandler)
  }

  console.log('\n--- summary ---')
  console.log(JSON.stringify(results, null, 2))

  await browser.close()
})()
