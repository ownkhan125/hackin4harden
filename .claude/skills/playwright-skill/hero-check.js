const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const TARGET_URL = 'http://localhost:3001'
const OUT_DIR = path.join(__dirname, 'h4h-scrape')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console error: ' + msg.text())
  })

  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)

  // Capture only the hero (the first <section>)
  const hero = page.locator('section').first()
  await hero.screenshot({ path: path.join(OUT_DIR, 'hero-desktop.png') })
  console.log('hero desktop saved')

  // Mobile
  await page.setViewportSize({ width: 390, height: 1100 })
  await page.waitForTimeout(800)
  await hero.screenshot({ path: path.join(OUT_DIR, 'hero-mobile.png') })
  console.log('hero mobile saved')

  if (errors.length) {
    console.log('ERRORS:')
    errors.forEach((e) => console.log(' -', e))
  } else {
    console.log('no errors')
  }

  await browser.close()
})()
