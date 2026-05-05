const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const TARGET_URL = 'http://localhost:3001'
const OUT_DIR = path.join(__dirname, 'h4h-scrape', 'audit2')
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'large-mobile-414', width: 414, height: 896 },
  { name: 'small-mobile-360', width: 360, height: 640 },
]

;(async () => {
  const browser = await chromium.launch({ headless: true })

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      hasTouch: vp.width < 600,
    })
    const page = await ctx.newPage()

    console.log(`\n=== ${vp.name} ===`)
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(800)

    // Slowly scroll through the entire page so motion in-view animations fire
    const totalHeight = await page.evaluate(() => document.body.scrollHeight)
    const step = Math.floor(vp.height * 0.6)
    for (let y = 0; y < totalHeight + step; y += step) {
      await page.evaluate((y) => window.scrollTo(0, y), y)
      await page.waitForTimeout(280)
    }
    await page.waitForTimeout(600)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)

    // Now take fullPage — animations should be in final state
    await page.screenshot({
      path: path.join(OUT_DIR, `${vp.name}.png`),
      fullPage: true,
    })

    // Per-section heights to detect collapse / overflow
    const sectionInfo = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'))
      return sections.map((s, i) => {
        const r = s.getBoundingClientRect()
        const id = s.id || s.getAttribute('aria-label') || `section-${i}`
        const firstHeading = s.querySelector('h1, h2')?.innerText?.substring(0, 60) || ''
        return {
          idx: i,
          id,
          h: Math.round(r.height),
          firstHeading,
        }
      })
    })
    console.log('section heights:')
    sectionInfo.forEach((s) =>
      console.log(`  ${s.idx} h=${s.h.toString().padStart(5)} ${s.id} :: ${s.firstHeading}`),
    )

    // Detect any element with horizontal overflow
    const overflow = await page.evaluate(() => {
      const winW = window.innerWidth
      const offenders = []
      document.querySelectorAll('*').forEach((el) => {
        const r = el.getBoundingClientRect()
        if ((r.right > winW + 1 || r.left < -1) && r.width > 0) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || '').toString().substring(0, 70),
            w: Math.round(r.width),
            l: Math.round(r.left),
            r: Math.round(r.right),
          })
        }
      })
      return offenders.slice(0, 15)
    })
    if (overflow.length) {
      console.log('OVERFLOW offenders:')
      overflow.forEach((o) =>
        console.log(`  <${o.tag} class="${o.cls.substring(0, 50)}"> w=${o.w} l=${o.l} r=${o.r}`),
      )
    }

    await ctx.close()
  }

  await browser.close()
  console.log('\nDONE')
})()
