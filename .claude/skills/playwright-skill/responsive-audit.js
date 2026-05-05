const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const TARGET_URL = 'http://localhost:3001'
const OUT_DIR = path.join(__dirname, 'h4h-scrape')
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-portrait-768', width: 768, height: 1024 },
  { name: 'large-mobile-414', width: 414, height: 896 },
  { name: 'small-mobile-360', width: 360, height: 640 },
]

const SECTIONS = [
  { id: 'hero', selector: 'section:nth-of-type(1)' },
  { id: 'trust-strip', selector: 'section[aria-label="Frameworks and trust signals"]' },
  { id: 'why', selector: '#why' },
  { id: 'journey', selector: '#journey' },
  { id: 'ecosystem', selector: '#ecosystem' },
  { id: 'metrics', selector: 'section:has(h2:has-text("Eleven years"))' },
  { id: 'testimonials', selector: 'section:has(h2:has-text("Why this morning"))' },
  { id: 'founders', selector: 'section:has(h2:has-text("The man, the family"))' },
  { id: 'faq', selector: '#faq' },
  { id: 'final-cta', selector: 'section:has(h2:has-text("7:30 AM shotgun"))' },
]

;(async () => {
  const browser = await chromium.launch({ headless: true })

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push('console: ' + m.text())
    })

    console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`)
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(1200)

    // Auto-scroll once to fire viewport-triggered animations
    await page.evaluate(async () => {
      await new Promise((res) => {
        let total = 0
        const t = setInterval(() => {
          window.scrollBy(0, 500)
          total += 500
          if (total >= document.body.scrollHeight) {
            clearInterval(t)
            res()
          }
        }, 80)
      })
    })
    await page.waitForTimeout(800)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)

    // Full-page
    await page.screenshot({
      path: path.join(OUT_DIR, `audit-${vp.name}-fullpage.png`),
      fullPage: true,
    })

    // Detect horizontal overflow
    const overflow = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth
      const winW = window.innerWidth
      const offenders = []
      if (docW > winW) {
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect()
          if (r.right > winW + 1 || r.left < -1) {
            const tag = el.tagName.toLowerCase()
            const cls = (el.className || '').toString().substring(0, 60)
            offenders.push({
              tag,
              cls,
              left: Math.round(r.left),
              right: Math.round(r.right),
              w: Math.round(r.width),
            })
          }
        })
      }
      return { docW, winW, overflow: docW - winW, offenders: offenders.slice(0, 15) }
    })

    console.log('overflow:', overflow.overflow, 'px')
    if (overflow.offenders.length) {
      console.log('  top offenders:')
      overflow.offenders
        .slice(0, 8)
        .forEach((o) =>
          console.log(`    <${o.tag} class="${o.cls}"> w=${o.w} left=${o.left} right=${o.right}`),
        )
    }

    if (errors.length) {
      console.log('errors:', errors.length)
      errors.slice(0, 5).forEach((e) => console.log('  -', e))
    }

    await ctx.close()
  }

  await browser.close()
  console.log('\nDONE — screenshots in', OUT_DIR)
})()
