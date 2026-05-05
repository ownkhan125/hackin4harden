const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const TARGET_URL = 'http://localhost:3001'
const OUT = path.join(__dirname, 'h4h-scrape', 'marquee')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const VPS = [
    { name: 'desktop', w: 1440, h: 900 },
    { name: 'tablet', w: 768, h: 1024 },
    { name: 'mobile', w: 414, h: 896 },
  ]

  for (const vp of VPS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => console.log(vp.name, 'PAGEERR:', e.message))

    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(800)

    // Scroll the trust strip into view
    await page.evaluate(() => {
      const sec = document.querySelector('section[aria-label="Frameworks and trust signals"]')
      if (sec) sec.scrollIntoView({ block: 'center' })
    })
    await page.waitForTimeout(500)

    const sec = page.locator('section[aria-label="Frameworks and trust signals"]')

    // Capture two frames ~2s apart to verify the marquee is moving
    await sec.screenshot({ path: path.join(OUT, `${vp.name}-t0.png`) })
    const t0 = await page.evaluate(() => {
      const track = document.querySelector('.marquee-track')
      return track ? getComputedStyle(track).transform : 'no-track'
    })
    await page.waitForTimeout(2200)
    await sec.screenshot({ path: path.join(OUT, `${vp.name}-t1.png`) })
    const t1 = await page.evaluate(() => {
      const track = document.querySelector('.marquee-track')
      return track ? getComputedStyle(track).transform : 'no-track'
    })

    console.log(`${vp.name}:`)
    console.log('  t0 transform:', t0)
    console.log('  t1 transform:', t1)
    console.log('  moving:', t0 !== t1)

    // Track width vs viewport — both halves of the loop should fit
    const widths = await page.evaluate(() => {
      const track = document.querySelector('.marquee-track')
      const items = track ? track.querySelectorAll('li') : []
      return {
        trackW: track ? track.scrollWidth : 0,
        viewportW: window.innerWidth,
        itemCount: items.length,
      }
    })
    console.log('  ', widths)

    await ctx.close()
  }

  await browser.close()
  console.log('\ndone')
})()
