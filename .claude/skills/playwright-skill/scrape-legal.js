const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const PAGES = ['/privacy-policy', '/terms-and-conditions']
const OUT = path.join(__dirname, 'h4h-scrape')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext()
  const page = await ctx.newPage()

  for (const p of PAGES) {
    const url = 'https://hackin4harden.com' + p
    const slug = p.replace(/\//g, '_').replace(/^_/, '')
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(1500)
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
      await page.waitForTimeout(800)
      const text = await page.evaluate(() => document.body.innerText)
      fs.writeFileSync(path.join(OUT, `${slug}-text.txt`), text)
      console.log(p, 'len=', text.length)
    } catch (e) {
      console.error(p, 'fail:', e.message)
    }
  }
  await browser.close()
})()
