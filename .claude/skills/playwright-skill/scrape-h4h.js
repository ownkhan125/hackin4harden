const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const TARGET_URL = 'https://hackin4harden.com/'
const OUT_DIR = path.join(__dirname, 'h4h-scrape')

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
  })
  const page = await context.newPage()

  try {
    console.log('Navigating to', TARGET_URL)
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(2500)

    const title = await page.title()
    console.log('Title:', title)

    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let total = 0
        const distance = 300
        const timer = setInterval(() => {
          window.scrollBy(0, distance)
          total += distance
          if (total >= document.body.scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 200)
      })
    })
    await page.waitForTimeout(1500)

    const fullText = await page.evaluate(() => document.body.innerText)
    fs.writeFileSync(path.join(OUT_DIR, 'home-fulltext.txt'), fullText)
    console.log('Wrote full text:', fullText.length, 'chars')

    const headings = await page.evaluate(() => {
      const items = []
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
        const text = (h.innerText || '').trim()
        if (text) items.push({ tag: h.tagName, text })
      })
      return items
    })
    fs.writeFileSync(path.join(OUT_DIR, 'home-headings.json'), JSON.stringify(headings, null, 2))

    const ctas = await page.evaluate(() => {
      const items = []
      document.querySelectorAll('a, button').forEach((el) => {
        const text = (el.innerText || '').trim()
        const href = el.getAttribute('href') || ''
        if (text && text.length < 80) items.push({ tag: el.tagName, text, href })
      })
      return items
    })
    fs.writeFileSync(path.join(OUT_DIR, 'home-ctas.json'), JSON.stringify(ctas, null, 2))

    const meta = await page.evaluate(() => {
      const m = document.querySelector('meta[name="description"]')
      const og = document.querySelector('meta[property="og:description"]')
      return {
        description: m ? m.getAttribute('content') : null,
        og: og ? og.getAttribute('content') : null,
        title: document.title,
      }
    })
    fs.writeFileSync(path.join(OUT_DIR, 'home-meta.json'), JSON.stringify(meta, null, 2))

    const sections = await page.evaluate(() => {
      const out = []
      document
        .querySelectorAll('section, .elementor-section, .vc_section, [class*="section"]')
        .forEach((s, i) => {
          const text = (s.innerText || '').trim()
          if (text && text.length > 30 && text.length < 4000) {
            out.push({
              idx: i,
              cls: s.className.substring(0, 100),
              text,
            })
          }
        })
      return out
    })
    fs.writeFileSync(path.join(OUT_DIR, 'home-sections.json'), JSON.stringify(sections, null, 2))
    console.log('Sections:', sections.length)

    const images = await page.evaluate(() => {
      const out = []
      document.querySelectorAll('img').forEach((img) => {
        out.push({ alt: img.alt || '', src: img.src || '', title: img.title || '' })
      })
      return out
    })
    fs.writeFileSync(path.join(OUT_DIR, 'home-images.json'), JSON.stringify(images, null, 2))

    await page.screenshot({ path: path.join(OUT_DIR, 'home.png'), fullPage: true })
    console.log('Screenshot saved')

    const internalLinks = await page.evaluate(() => {
      const set = new Set()
      document.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href')
        if (
          href &&
          (href.startsWith('/') || href.includes('hackin4harden.com')) &&
          !href.startsWith('#') &&
          !href.includes('mailto') &&
          !href.includes('tel:')
        ) {
          set.add(href)
        }
      })
      return Array.from(set)
    })
    fs.writeFileSync(
      path.join(OUT_DIR, 'home-internal-links.json'),
      JSON.stringify(internalLinks, null, 2),
    )
    console.log('Internal links:', internalLinks.length)

    console.log('\nDONE')
  } catch (err) {
    console.error('Error:', err.message)
    console.error(err.stack)
  } finally {
    await browser.close()
  }
})()
