const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const TARGET_URL = 'http://localhost:3001'
const ROOT = path.join(__dirname, 'h4h-scrape', 'audit3')

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
      reducedMotion: 'reduce', // disables motion animations entirely
    })
    const page = await ctx.newPage()

    console.log(`\n=== ${vp.name} ===`)
    try {
      await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(800)

      // Force-show any elements still under whileInView animation by triggering scroll-by-section
      const sections = await page.$$('section')
      console.log('sections detected:', sections.length)

      for (let i = 0; i < sections.length; i++) {
        await sections[i].scrollIntoViewIfNeeded()
        await page.waitForTimeout(300)
        const heading = await sections[i].evaluate(
          (el) =>
            el.querySelector('h1, h2')?.innerText?.substring(0, 50) || `section-${el.id || ''}`,
        )
        const safe = heading.replace(/[^\w]+/g, '_').substring(0, 40)
        await sections[i].screenshot({
          path: path.join(dir, `${String(i).padStart(2, '0')}-${safe}.png`),
        })
        console.log(`  saved ${i}: ${heading}`)
      }

      // Also full page now
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(400)
      await page.screenshot({
        path: path.join(dir, 'fullpage.png'),
        fullPage: true,
      })

      // Overflow check (excluding pointer-events-none decorative blobs)
      const overflow = await page.evaluate(() => {
        const winW = window.innerWidth
        const offenders = []
        document.querySelectorAll('*').forEach((el) => {
          if (el.matches('[aria-hidden="true"], .pointer-events-none, .pointer-events-none *'))
            return
          // skip elements inside aria-hidden ancestors
          let parent = el
          while (parent) {
            if (
              parent.getAttribute &&
              (parent.getAttribute('aria-hidden') === 'true' ||
                parent.classList?.contains('pointer-events-none'))
            ) {
              return
            }
            parent = parent.parentElement
          }
          const r = el.getBoundingClientRect()
          if ((r.right > winW + 1 || r.left < -1) && r.width > 0 && r.height > 0) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className || '').toString().substring(0, 80),
              text: (el.innerText || '').substring(0, 40),
              w: Math.round(r.width),
              l: Math.round(r.left),
              r: Math.round(r.right),
            })
          }
        })
        return offenders.slice(0, 20)
      })
      if (overflow.length) {
        console.log(`  REAL OVERFLOW (${overflow.length}):`)
        overflow.forEach((o) =>
          console.log(`    <${o.tag}> w=${o.w} l=${o.l} r=${o.r} :: "${o.text}"`),
        )
      } else {
        console.log('  no real overflow')
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
