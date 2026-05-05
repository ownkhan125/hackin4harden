const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 768, height: 1024 } })
  const page = await ctx.newPage()

  page.on('pageerror', (e) => {
    console.log('PAGEERROR:', e.message)
    if (e.stack) console.log(e.stack.split('\n').slice(0, 6).join('\n'))
  })
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('CONSOLE_ERR:', m.text())
  })
  page.on('requestfailed', (r) => console.log('REQ_FAIL:', r.url(), r.failure().errorText))
  page.on('response', async (r) => {
    if (r.status() >= 400) console.log('HTTP', r.status(), r.url().substring(0, 100))
  })

  await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2000)

  const computed = await page.evaluate(() => {
    const h1 = document.querySelector('h1')
    if (!h1) return { found: false }
    const cs = getComputedStyle(h1)
    return {
      found: true,
      text: h1.innerText.substring(0, 60),
      opacity: cs.opacity,
      transform: cs.transform,
      visibility: cs.visibility,
    }
  })
  console.log('h1 state:', computed)

  await browser.close()
})()
