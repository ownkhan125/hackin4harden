const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const TARGET_URL = 'http://localhost:3001'
const OUT = path.join(__dirname, 'h4h-scrape', 'timeline')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  page.on('pageerror', (e) => console.log('PAGEERR:', e.message.substring(0, 200)))

  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(800)

  // Sample a section's reveal in real time as we scroll into it.
  // Pick the WhyWeWin section as the test subject.
  const sample = async (label) => {
    const data = await page.evaluate(() => {
      const sec = document.querySelector('#why')
      if (!sec) return null
      const head = sec.querySelector('h2')
      const eyebrow = sec.querySelector('span.font-mono')
      const lead = sec.querySelector('p')
      const cards = sec.querySelectorAll('[class*="MotionCard"], .group')
      const pick = (el) => {
        if (!el) return null
        const cs = getComputedStyle(el)
        return {
          opacity: parseFloat(cs.opacity).toFixed(2),
          transform: cs.transform === 'none' ? 'none' : 'animating',
        }
      }
      // Get the top build-line of the section
      const buildLine = sec.querySelector(':scope > span.pointer-events-none')
      return {
        line: pick(buildLine),
        eyebrow: pick(eyebrow),
        head: pick(head),
        lead: pick(lead),
        firstCard: pick(sec.querySelectorAll('div.relative')[1]),
      }
    })
    console.log(`${label.padEnd(20)}`, JSON.stringify(data))
  }

  // Scroll #why into view and watch the cascade
  console.log('--- WhyWeWin section reveal cascade ---')
  await page.evaluate(() => {
    const target = document.querySelector('#why')
    target?.scrollIntoView({ block: 'start' })
  })

  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(120)
    await sample(`+${(i * 120).toString().padStart(4)}ms`)
  }

  await browser.close()
  console.log('done')
})()
