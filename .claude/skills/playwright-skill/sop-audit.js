/* A2P 10DLC Website Compliance Audit — runs every checklist item from
 * the Operation 1776 SOP against the live site and reports pass/fail.
 */
const { chromium } = require('playwright')

const BASE = 'http://localhost:3002'
const LEGAL_ENTITY = 'Josh C Harden Memorial Golf'

const ALL_ROUTES = [
  '/',
  '/about',
  '/photos',
  '/registration',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
]

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  const results = []
  const pass = (id, area, detail) => results.push({ id, status: 'PASS', area, detail })
  const fail = (id, area, detail) => results.push({ id, status: 'FAIL', area, detail })

  // ─── Item 1: ToS page exists ─────────────────────────────────────────
  let resp = await page.goto(BASE + '/terms-of-service', { waitUntil: 'networkidle' })
  if (resp.status() === 200) pass(1, 'ToS Page', '/terms-of-service/ → 200')
  else fail(1, 'ToS Page', `status ${resp.status()}`)

  // ─── Item 3: Privacy Policy page exists ──────────────────────────────
  resp = await page.goto(BASE + '/privacy-policy', { waitUntil: 'networkidle' })
  if (resp.status() === 200) pass(3, 'Privacy Page', '/privacy-policy/ → 200')
  else fail(3, 'Privacy Page', `status ${resp.status()}`)

  // ─── Items 2 & 4 & 18: Footer links + contact info on every page ─────
  for (const route of ALL_ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    const footerData = await page.evaluate(() => {
      const f = document.querySelector('footer')
      if (!f) return null
      const links = Array.from(f.querySelectorAll('a[href]')).map((a) => a.getAttribute('href'))
      const text = f.innerText
      return { links, text }
    })
    if (!footerData) {
      fail(2, 'Footer', `no <footer> on ${route}`)
      continue
    }
    if (footerData.links.includes('/terms-of-service')) {
      pass(2, 'ToS Footer Link', `${route}`)
    } else fail(2, 'ToS Footer Link', `missing on ${route}`)
    if (footerData.links.includes('/privacy-policy')) {
      pass(4, 'Privacy Footer Link', `${route}`)
    } else fail(4, 'Privacy Footer Link', `missing on ${route}`)
    const hasPhone = /480-414-8891/.test(footerData.text)
    const hasEmail = /hackinforeharden@gmail\.com/i.test(footerData.text)
    const hasAddr = /6808 S 32nd St/i.test(footerData.text)
    if (hasPhone && hasEmail && hasAddr) {
      pass(18, 'Footer Contact Info', `${route}: phone+email+address`)
    } else {
      fail(
        18,
        'Footer Contact Info',
        `${route}: phone=${hasPhone} email=${hasEmail} addr=${hasAddr}`,
      )
    }
  }

  // ─── Items 5 & 6: Privacy Policy SMS section + business name ─────────
  await page.goto(BASE + '/privacy-policy', { waitUntil: 'networkidle' })
  const privacyText = await page.evaluate(() => document.body.innerText)
  if (privacyText.includes(LEGAL_ENTITY)) pass(6, 'Privacy Business Name', LEGAL_ENTITY + ' present')
  else fail(6, 'Privacy Business Name', LEGAL_ENTITY + ' missing')

  const smsKeywords = [
    'SMS',
    'text messaging',
    'phone number',
    'STOP',
    'HELP',
    'opt-in data',
    'will not share or sell',
  ]
  const missing = smsKeywords.filter((k) => !new RegExp(k, 'i').test(privacyText))
  if (missing.length === 0) pass(5, 'Privacy SMS Section', 'all keywords present')
  else fail(5, 'Privacy SMS Section', 'missing: ' + missing.join(', '))

  // ─── Item 17: ToS carrier liability disclaimer ───────────────────────
  await page.goto(BASE + '/terms-of-service', { waitUntil: 'networkidle' })
  const tosText = await page.evaluate(() => document.body.innerText)
  if (/Carriers are not liable for delayed or undelivered/i.test(tosText)) {
    pass(17, 'ToS Carrier Disclaimer', 'present')
  } else fail(17, 'ToS Carrier Disclaimer', 'missing')

  // ─── Items 12, 13, 14, 15: ToS STOP, HELP, frequency, data rates ─────
  if (/reply\s+STOP/i.test(tosText)) pass(12, 'ToS STOP', 'present')
  else fail(12, 'ToS STOP', 'missing')
  if (/reply\s+HELP|keyword\s+HELP/i.test(tosText)) pass(13, 'ToS HELP', 'present')
  else fail(13, 'ToS HELP', 'missing')
  if (/Message frequency/i.test(tosText)) pass(14, 'ToS Frequency', 'present')
  else fail(14, 'ToS Frequency', 'missing')
  if (/Message and data rates|Message & data rates/i.test(tosText)) {
    pass(15, 'ToS Data Rates', 'present')
  } else fail(15, 'ToS Data Rates', 'missing')

  // ─── Items 7, 8, 9, 10, 11, 12, 13, 14, 15: Form consent checkboxes ──
  for (const formRoute of ['/registration', '/contact']) {
    await page.goto(BASE + formRoute, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    const formAnalysis = await page.evaluate((LE) => {
      const form = document.querySelector('form')
      if (!form) return null
      const checkboxes = Array.from(form.querySelectorAll('input[type="checkbox"]'))
      const submit = form.querySelector('button[type="submit"], input[type="submit"]')
      const phoneField = form.querySelector('input[type="tel"], input[name*="phone" i]')

      const consentInfo = checkboxes.find((c) =>
        (c.closest('label')?.innerText || '').toLowerCase().includes('updates'),
      )
      const consentPromo = checkboxes.find((c) =>
        (c.closest('label')?.innerText || '').toLowerCase().includes('promotional'),
      )

      const result = {
        checkboxCount: checkboxes.length,
        hasInfoCheckbox: !!consentInfo,
        hasPromoCheckbox: !!consentPromo,
        infoText: consentInfo?.closest('label')?.innerText || '',
        promoText: consentPromo?.closest('label')?.innerText || '',
        infoChecked: consentInfo?.checked || false,
        promoChecked: consentPromo?.checked || false,
        infoRequired: consentInfo?.required || false,
        promoRequired: consentPromo?.required || false,
      }

      // Position check: are consent checkboxes BELOW the phone field and ABOVE submit?
      if (phoneField && consentInfo && submit) {
        const phoneY = phoneField.getBoundingClientRect().top
        const consentY = consentInfo.getBoundingClientRect().top
        const submitY = submit.getBoundingClientRect().top
        result.consentBelowPhone = consentY > phoneY
        result.consentAboveSubmit = consentY < submitY
        // Side-by-side with phone? (within 50px vertically)
        result.consentNotBesidePhone = Math.abs(consentY - phoneY) > 50
      }

      result.infoHasEntity = result.infoText.includes(LE)
      result.promoHasEntity = result.promoText.includes(LE)
      result.infoHasStop = /STOP/.test(result.infoText)
      result.promoHasStop = /STOP/.test(result.promoText)
      result.infoHasHelp = /HELP/.test(result.infoText)
      result.promoHasHelp = /HELP/.test(result.promoText)
      result.infoHasFreq = /frequency/i.test(result.infoText)
      result.promoHasFreq = /frequency/i.test(result.promoText)
      result.infoHasRates = /rates may apply/i.test(result.infoText)
      result.promoHasRates = /rates may apply/i.test(result.promoText)

      return result
    }, LEGAL_ENTITY)

    if (!formAnalysis) {
      fail(7, 'SMS Consent Checkboxes', `no form on ${formRoute}`)
      continue
    }

    const tag = `[${formRoute}]`
    if (formAnalysis.hasInfoCheckbox) pass(7, 'Info SMS Checkbox', tag)
    else fail(7, 'Info SMS Checkbox', tag + ' missing')
    if (formAnalysis.hasPromoCheckbox) pass(8, 'Promo SMS Checkbox', tag)
    else fail(8, 'Promo SMS Checkbox', tag + ' missing')

    if (formAnalysis.consentAboveSubmit && formAnalysis.consentNotBesidePhone) {
      pass(9, 'Consent Position', tag + ' bottom-of-form')
    } else {
      fail(
        9,
        'Consent Position',
        `${tag} below=${formAnalysis.consentBelowPhone} above-submit=${formAnalysis.consentAboveSubmit}`,
      )
    }

    if (formAnalysis.infoHasEntity && formAnalysis.promoHasEntity) {
      pass(10, 'Business Name in Consent', tag)
    } else fail(10, 'Business Name in Consent', tag + ' missing entity name')

    if (!formAnalysis.infoChecked && !formAnalysis.promoChecked) {
      pass(11, 'Checkboxes Not Pre-Checked', tag)
    } else fail(11, 'Checkboxes Not Pre-Checked', tag + ' one or more pre-checked')

    if (!formAnalysis.infoRequired && !formAnalysis.promoRequired) {
      pass(11, 'Checkboxes Optional', tag)
    } else fail(11, 'Checkboxes Optional', tag + ' marked required')

    if (formAnalysis.infoHasStop && formAnalysis.promoHasStop) {
      pass(12, 'STOP in form consent', tag)
    } else fail(12, 'STOP in form consent', tag)
    if (formAnalysis.infoHasHelp && formAnalysis.promoHasHelp) {
      pass(13, 'HELP in form consent', tag)
    } else fail(13, 'HELP in form consent', tag)
    if (formAnalysis.infoHasFreq && formAnalysis.promoHasFreq) {
      pass(14, 'Frequency in form consent', tag)
    } else fail(14, 'Frequency in form consent', tag)
    if (formAnalysis.infoHasRates && formAnalysis.promoHasRates) {
      pass(15, 'Data rates in form consent', tag)
    } else fail(15, 'Data rates in form consent', tag)
  }

  // ─── Item 19: Contact page detailed contact info ─────────────────────
  await page.goto(BASE + '/contact', { waitUntil: 'networkidle' })
  const contactText = await page.evaluate(() => document.body.innerText)
  const cHasPhone = /480-414-8891|602-305-5550/.test(contactText)
  const cHasEmail = /hackinforeharden@gmail\.com/i.test(contactText)
  const cHasAddr = /6808 S 32nd St/i.test(contactText)
  if (cHasPhone && cHasEmail && cHasAddr) {
    pass(19, 'Contact Page Info', 'phone+email+address')
  } else {
    fail(19, 'Contact Page Info', `phone=${cHasPhone} email=${cHasEmail} addr=${cHasAddr}`)
  }

  // ─── Item 16: Business name consistency ──────────────────────────────
  const consistencyChecks = [
    ['Privacy Policy', BASE + '/privacy-policy'],
    ['Terms of Service', BASE + '/terms-of-service'],
    ['Contact', BASE + '/contact'],
    ['Footer (home)', BASE + '/'],
  ]
  for (const [label, url] of consistencyChecks) {
    await page.goto(url, { waitUntil: 'networkidle' })
    const t = await page.evaluate(() => document.body.innerText)
    if (t.includes(LEGAL_ENTITY)) pass(16, `Entity in ${label}`, 'present')
    else fail(16, `Entity in ${label}`, 'missing')
  }

  // ─── Report ──────────────────────────────────────────────────────────
  const passed = results.filter((r) => r.status === 'PASS').length
  const failed = results.filter((r) => r.status === 'FAIL').length

  console.log('\n=== A2P 10DLC SOP COMPLIANCE AUDIT ===\n')
  results.forEach((r) => {
    const mark = r.status === 'PASS' ? '✓' : '✗'
    console.log(`  ${mark} [#${String(r.id).padStart(2)}] ${r.area.padEnd(30)} ${r.detail}`)
  })
  console.log(`\n  Total: ${passed} pass, ${failed} fail`)
  if (failed === 0) console.log('  ALL SOP CHECKS PASS ✓')
  else console.log('  SEE FAILURES ABOVE ✗')

  await browser.close()
})()
