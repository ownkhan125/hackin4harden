import { NextResponse } from 'next/server'

import { postSigned } from '@/lib/ghl-webhook'
import { normalizePhoneForSubmit } from '@/lib/phone'

export const runtime = 'nodejs'

const SHARED_SECRET = process.env.GHL_WEBHOOK_SHARED_SECRET
const URL_CONTACT = process.env.GHL_INBOUND_WEBHOOK_URL_CONTACT
const URL_A2P = process.env.GHL_INBOUND_WEBHOOK_URL_A2P_COMPLIANCE

const trim = (s) => (typeof s === 'string' ? s.trim() : '')
const yesNo = (v) => (v === 'Yes' || v === true ? 'Yes' : 'No')

/* POST /api/contact
 *
 * Forms-compliance-pattern.md §1 fan-out: the contact form posts a
 * single signed payload to TWO GHL inbound webhooks in parallel:
 *
 *   1. URL_CONTACT  — the contact-form workflow (creates a contact,
 *      tags as inbound lead, optionally sends an auto-reply).
 *   2. URL_A2P      — the consent-recording workflow (writes
 *      sms_updates / sms_promo onto the contact's custom fields).
 *
 * Both POSTs use the same HMAC-signed JSON body. A 502 is returned
 * only when EVERY downstream POST fails — a partial failure still
 * returns 200 to the client because the workflow they care most
 * about (the contact one) may have succeeded. */
const POST = async (req) => {
  try {
    const body = await req.json()
    const firstName = trim(body.firstName)
    const lastName = trim(body.lastName)
    const email = trim(body.email)
    const phone = normalizePhoneForSubmit(body.phone)
    const message = trim(body.message)

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'First name, last name, email, and message are required.' },
        { status: 400 },
      )
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email looks invalid.' }, { status: 400 })
    }

    const submittedAt = new Date().toISOString()
    const smsUpdates = yesNo(body.sms_updates)
    const smsPromo = yesNo(body.sms_promo)

    /* Primary contact-form payload. Keep the schema aligned with the
     * paid registration payload so GHL workflow merge-field paths stay
     * predictable across forms (purchaser → contact, plus message). */
    const payload = {
      event_type: 'contact.submitted',
      form: 'contact',
      source: 'src_contact',
      submitted_at: submittedAt,
      contact: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      },
      /* Flat top-level keys so the GHL merge-field picker exposes them
       * directly (the picker can't drill into nested objects in some
       * accounts — same workaround we ship for paid registrations). */
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      message,
      sms_updates: smsUpdates,
      sms_promo: smsPromo,
    }

    /* A2P consent envelope — minimal extract for the compliance
     * workflow. Keeps the consent log lightweight; the contact
     * workflow owns the richer payload. */
    const a2pPayload = {
      event_type: 'consent.recorded',
      form: 'contact',
      submitted_at: submittedAt,
      purchaser: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      },
      sms_updates: smsUpdates,
      sms_promo: smsPromo,
    }

    /* Fire both in parallel. Either may be unset in dev / missing
     * config — postSigned no-ops on a missing URL. */
    const [primary, a2p] = await Promise.all([
      postSigned(URL_CONTACT, payload, SHARED_SECRET),
      postSigned(URL_A2P, a2pPayload, SHARED_SECRET),
    ])

    console.warn('[Contact API] -> GHL', {
      email,
      primary: { attempts: primary.attempts, ok: primary.ok, error: primary.error },
      a2p: { attempts: a2p.attempts, ok: a2p.ok, error: a2p.error },
    })

    /* Per forms-compliance-pattern.md §1: 502 only when EVERY webhook
     * fails. If at least one succeeded, the client gets 200. */
    if (!primary.ok && !a2p.ok) {
      return NextResponse.json(
        { error: 'All webhook deliveries failed. Please try again.' },
        { status: 502 },
      )
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Contact API] handler error:', error)
    return NextResponse.json(
      { error: error.message ?? 'Submission failed' },
      { status: 500 },
    )
  }
}

export { POST }
