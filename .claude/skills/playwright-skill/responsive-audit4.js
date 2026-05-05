const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const TARGET_URL = 'http://localhost:3001'
const ROOT = path.join(__dirname, 'h4h-scrape', 'audit4')

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'large-mobile-414', width: 414, height: 896 },
  { name: 'small-mobile-360', width: 360, height: 640 },
]

;(async () => {
  const browser = await chromium.launch({ headless: true })

  for (const vp of VIEWPORTS) {
    const dir = path.join(ROOT, vp.name)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    })
    const page = await ctx.newPage()

    console.log(`\n=== ${vp.name} ===`)
    try {
      await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 })

      // Inject CSS that forces motion elements to their final state, so screenshots
      // never miss content because whileInView didn't fire during a fullPage capture.
      await page.addStyleTag({
        content: `
          /* Force any framer-motion element to be visible in screenshots */
          *[style*="opacity: 0"],
          *[style*="opacity:0"] {
            opacity: 1 !important;
          }
          *[style*="transform"] {
            transform: none !important;
          }
        `,
      })
      await page.waitForTimeout(800)

      // Slow scroll to trigger any IntersectionObserver-based motion that we missed
      const totalH = await page.evaluate(() => document.body.scrollHeight)
      const step = Math.floor(vp.height * 0.5)
      for (let y = 0; y < totalH + step; y += step) {
        await page.evaluate((y) => window.scrollTo(0, y), y)
        await page.waitForTimeout(180)
      }
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(500)

      // Per-section element screenshots
      const sectionInfo = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('section')).map((s, i) => ({
          idx: i,
          id: s.id || '',
          aria: s.getAttribute('aria-label') || '',
          heading: (s.querySelector('h1, h2')?.innerText || '').substring(0, 60),
        }))
      })
      console.log('sections:', sectionInfo.length)

      for (const info of sectionInfo) {
        const sel = `section >> nth=${info.idx}`
        const handle = await page.locator(sel).first()
        const safe = (info.heading || info.id || info.aria || `section-${info.idx}`)
          .replace(/[^\w]+/g, '_')
          .substring(0, 40)
        try {
          await handle.scrollIntoViewIfNeeded()
          await page.waitForTimeout(200)
          await handle.screenshot({
            path: path.join(dir, `${String(info.idx).padStart(2, '0')}-${safe}.png`),
          })
          console.log(`  ${info.idx} -> ${safe}`)
        } catch (e) {
          console.log(`  ${info.idx} fail:`, e.message.substring(0, 80))
        }
      }

      // Full page screenshot
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(300)
      await page.screenshot({ path: path.join(dir, 'fullpage.png'), fullPage: true })

      // Real overflow check
      const overflow = await page.evaluate(() => {
        const winW = window.innerWidth
        const offenders = []
        document.querySelectorAll('*').forEach((el) => {
          let parent = el
          while (parent) {
            if (
              parent.getAttribute &&
              (parent.getAttribute('aria-hidden') === 'true' ||
                (parent.classList && parent.classList.contains('pointer-events-none')))
            )
              return
            parent = parent.parentElement
          }
          const r = el.getBoundingClientRect()
          if ((r.right > winW + 1 || r.left < -1) && r.width > 0 && r.height > 0) {
            const cs = getComputedStyle(el)
            if (cs.position === 'fixed') return // skip fixed (e.g. header)
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className || '').toString().substring(0, 80),
              text: (el.innerText || '').substring(0, 30),
              w: Math.round(r.width),
              l: Math.round(r.left),
              r: Math.round(r.right),
            })
          }
        })
        // dedupe
        const seen = new Set()
        const out = []
        for (const o of offenders) {
          const k = `${o.tag}|${o.cls}|${o.w}`
          if (seen.has(k)) continue
          seen.add(k)
          out.push(o)
        }
        return out.slice(0, 15)
      })
      if (overflow.length) {
        console.log(`  REAL OVERFLOW (${overflow.length}):`)
        overflow.forEach((o) =>
          console.log(
            `    <${o.tag}> w=${o.w} l=${o.l} r=${o.r} :: "${o.text}" :: ${o.cls.substring(0, 60)}`,
          ),
        )
      } else {
        console.log('  no overflow')
      }
    } catch (e) {
      console.error('FAIL', vp.name, e.message)
    } finally {
      await ctx.close()
    }
  }

  await browser.close()
  console.log('\nDONE')
})()
