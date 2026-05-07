const { chromium } = require('playwright')
const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3003'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  // Desktop — capture navbar + footer site column
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${TARGET_URL}/`, { waitUntil: 'networkidle' })
  await sleep(700)

  // Read nav link texts
  const desktopNavLinks = await page.evaluate(() =>
    [...document.querySelectorAll('header nav a')].map((a) => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href'),
    })),
  )
  console.log('Desktop nav links:', JSON.stringify(desktopNavLinks, null, 2))

  // Capture top of page (navbar)
  await page.screenshot({
    path: '/tmp/nav-cleanup-desktop-navbar.png',
    clip: { x: 0, y: 0, width: 1440, height: 90 },
  })

  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await sleep(800)

  const footerSiteLinks = await page.evaluate(() => {
    const footer = document.querySelector('footer')
    if (!footer) return []
    return [...footer.querySelectorAll('a')]
      .filter((a) => {
        const href = a.getAttribute('href') || ''
        return (
          href.startsWith('/') &&
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:') &&
          !href.includes('://')
        )
      })
      .map((a) => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
  })
  console.log('Footer internal links:', JSON.stringify(footerSiteLinks, null, 2))

  await page.screenshot({
    path: '/tmp/nav-cleanup-desktop-footer.png',
    fullPage: false,
  })

  // Mobile — open menu, snap, list links
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${TARGET_URL}/`, { waitUntil: 'networkidle' })
  await sleep(700)
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(200)

  // open menu
  await page.click('button[aria-controls="mobile-menu"]')
  await sleep(700)
  await page.screenshot({ path: '/tmp/nav-cleanup-mobile-menu.png', fullPage: false })

  const mobileMenuLinks = await page.evaluate(() =>
    [...document.querySelectorAll('#mobile-menu a')]
      .filter((a) => a.getAttribute('href'))
      .map((a) => ({ text: a.textContent.trim().replace(/\s+/g, ' '), href: a.getAttribute('href') })),
  )
  console.log('Mobile menu links:', JSON.stringify(mobileMenuLinks, null, 2))

  // Verify every internal link points to an existing route (200)
  const allHrefs = new Set([...desktopNavLinks, ...footerSiteLinks, ...mobileMenuLinks].map((l) => l.href))
  console.log('Verifying routes:')
  for (const href of allHrefs) {
    if (!href.startsWith('/')) continue
    const resp = await page.request.get(`${TARGET_URL}${href === '/' ? '/' : href}`)
    console.log(` ${href} → ${resp.status()}`)
  }

  // Sanity — no anchor (#) links anywhere in nav/footer
  const anchorLinks = [
    ...desktopNavLinks,
    ...footerSiteLinks,
    ...mobileMenuLinks,
  ].filter((l) => (l.href || '').includes('#'))
  console.log('Anchor links remaining (should be empty):', JSON.stringify(anchorLinks))

  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
