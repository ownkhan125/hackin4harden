import { NextResponse } from 'next/server'

import { postSigned } from '@/lib/ghl-webhook'
import { groupFoursomeId, registrationId } from '@/lib/ids'
import { normalizePhoneForSubmit } from '@/lib/phone'
import { priceIdForSlug, stripe } from '@/lib/stripe'

export const runtime = 'nodejs'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hackin4harden.com'
const TOURNAMENT_DATE = process.env.TOURNAMENT_DATE || '2026-06-06'
const SHARED_SECRET = process.env.GHL_WEBHOOK_SHARED_SECRET
const URL_A2P_COMPLIANCE = process.env.GHL_INBOUND_WEBHOOK_URL_A2P_COMPLIANCE

const yesNo = (v) => (v === 'Yes' || v === true ? 'Yes' : 'No')

const trim = (s) => (typeof s === 'string' ? s.trim() : '')

/* Flatten the form payload into the Stripe Session metadata. Stripe
 * limits metadata to 50 keys * 500 chars each; we stay well within that.
 * Values must be strings — coerce to '' for null / undefined. */
const buildSessionMetadata = (input, regId, groupId) => {
  const md = {
    registration_id: regId,
    registration_type: input.registration_type,
    tier_slug: input.tier_slug,
    product_name: trim(input.product_name),
    amount_cents: String(Math.round((input.amount ?? 0) * 100)),
    amount_display: `$${(input.amount ?? 0).toLocaleString()}`,
    tournament_date: TOURNAMENT_DATE,
    group_foursome_id: groupId ?? '',
  }
  const p = input.purchaser ?? {}
  md.purchaser_first = trim(p.firstName)
  md.purchaser_last = trim(p.lastName)
  md.purchaser_email = trim(p.email)
  /* Phone is normalized into the canonical +1 (xxx) xxx-xxxx shape. A
   * partial value (less than 10 digits) becomes an empty string — we
   * never ship half a phone number to Stripe or GHL. */
  md.purchaser_phone = normalizePhoneForSubmit(p.phone)
  md.purchaser_org = trim(p.organization)
  md.purchaser_notes = trim(p.notes).slice(0, 480)

  if (input.registration_type === 'foursome' && Array.isArray(input.players)) {
    input.players.forEach((player, idx) => {
      const k = idx + 1
      const fullName = trim(player.fullName)
      const parts = fullName.split(/\s+/)
      const first = parts[0] ?? ''
      const last = parts.slice(1).join(' ')
      md[`p${k}_first`] = first
      md[`p${k}_last`] = last
      md[`p${k}_full_name`] = fullName
      md[`p${k}_email`] = trim(player.email)
      md[`p${k}_phone`] = normalizePhoneForSubmit(player.phone)
      md[`p${k}_group_info`] = trim(player.groupInfo).slice(0, 480)
      md[`p${k}_notes`] = trim(player.notes).slice(0, 480)
    })
  }

  if (input.registration_type === 'sponsor' && input.sponsor) {
    md.sponsor_company = trim(input.sponsor.company).slice(0, 480)
    md.sponsor_tier = trim(input.sponsor.tier)
    md.sponsor_website = trim(input.sponsor.website).slice(0, 480)
    md.sponsor_logo_url = trim(input.sponsor.logoUrl).slice(0, 480)
    md.sponsor_notes = trim(input.sponsor.notes).slice(0, 480)
  }

  if (input.registration_type === 'donation') {
    md.donation_amount_cents = String(Math.round((input.amount ?? 0) * 100))
  }

  /* A2P consent state — sent verbatim Yes/No so GHL can store on the
   * contact's custom fields directly. */
  md.sms_updates = yesNo(input.sms_updates)
  md.sms_promo = yesNo(input.sms_promo)

  // Strip empty strings to stay tidy (Stripe accepts empty but it bloats the dashboard view).
  for (const k of Object.keys(md)) {
    if (md[k] === '') delete md[k]
  }
  return md
}

const POST = async (req) => {
  try {
    const body = await req.json()
    const slug = trim(body.tier_slug)
    const regType = trim(body.registration_type)

    if (!slug) return NextResponse.json({ error: 'Missing tier_slug' }, { status: 400 })
    if (!regType)
      return NextResponse.json({ error: 'Missing registration_type' }, { status: 400 })

    const priceId = priceIdForSlug(slug)
    if (!priceId)
      return NextResponse.json({ error: `Unknown tier: ${slug}` }, { status: 400 })

    /* Foursome validation: all four players require name, email, and a
     * normalize-able 10-digit phone. Player 1 also acts as the purchaser,
     * so we backfill body.purchaser from players[0] if the client didn't
     * send it explicitly. */
    if (regType === 'foursome') {
      const players = Array.isArray(body.players) ? body.players : []
      if (players.length !== 4) {
        return NextResponse.json({ error: 'Foursome requires 4 players' }, { status: 400 })
      }
      for (let i = 0; i < 4; i++) {
        const p = players[i] ?? {}
        if (
          !trim(p.fullName) ||
          !trim(p.email) ||
          normalizePhoneForSubmit(p.phone) === ''
        ) {
          return NextResponse.json(
            { error: `Player ${i + 1} is missing required fields` },
            { status: 400 },
          )
        }
      }
      const lead = players[0]
      const parts = trim(lead.fullName).split(/\s+/)
      body.purchaser = {
        firstName: trim(body.purchaser?.firstName) || parts[0] || '',
        lastName: trim(body.purchaser?.lastName) || parts.slice(1).join(' '),
        email: trim(body.purchaser?.email) || trim(lead.email),
        /* Inherit raw phone from lead; buildSessionMetadata will
         * normalize once at the final write to Stripe metadata. */
        phone: trim(body.purchaser?.phone) || trim(lead.phone),
        organization: trim(body.purchaser?.organization) || trim(lead.groupInfo),
        notes: trim(body.purchaser?.notes) || trim(lead.notes),
      }
    }

    const purchaser = body.purchaser ?? {}
    if (!trim(purchaser.email)) {
      return NextResponse.json({ error: 'Purchaser email is required' }, { status: 400 })
    }
    if (!trim(purchaser.firstName) && regType !== 'foursome') {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 })
    }

    if (regType === 'sponsor') {
      const sponsor = body.sponsor ?? {}
      if (!trim(sponsor.company)) {
        return NextResponse.json(
          { error: 'Sponsor company name is required' },
          { status: 400 },
        )
      }
    }

    const regId = registrationId()
    const groupId = regType === 'foursome' ? groupFoursomeId() : null
    const metadata = buildSessionMetadata(body, regId, groupId)

    /* A2P compliance fan-out — fires in parallel with the Stripe Session
     * creation. Records the consent state at the moment of form submit,
     * regardless of whether payment completes. Per forms-compliance-
     * pattern.md, this URL is shared across every form that collects an
     * SMS consent checkbox. Failure here does not block checkout — we
     * just log it loudly and let Stripe proceed. */
    const a2pPayload = {
      event_type: 'consent.recorded',
      form: 'registration',
      registration_id: regId,
      registration_type: regType,
      tier_slug: trim(body.tier_slug),
      package_name: metadata.product_name ?? '',
      tournament_date: TOURNAMENT_DATE,
      submitted_at: new Date().toISOString(),
      purchaser: {
        first_name: metadata.purchaser_first ?? '',
        last_name: metadata.purchaser_last ?? '',
        email: metadata.purchaser_email ?? '',
        phone: metadata.purchaser_phone ?? '',
      },
      sms_updates: metadata.sms_updates,
      sms_promo: metadata.sms_promo,
    }
    /* Side-by-side with the Stripe call so we don't add user-perceptible
     * latency. If the A2P endpoint is slow we still ship the user to
     * Stripe; the compliance call retries internally. */
    const a2pPromise = URL_A2P_COMPLIANCE
      ? postSigned(URL_A2P_COMPLIANCE, a2pPayload, SHARED_SECRET)
      : Promise.resolve(null)

    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: trim(purchaser.email) || trim(body.players?.[0]?.email),
      /* Blueprint §4 requires the billing address — Stripe collects it
       * directly inside the hosted Checkout so we don't have to ask
       * for it in our React form. */
      billing_address_collection: 'required',
      success_url: `${SITE_URL}/registration/success?reg_id=${regId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/registration/cancel?reg_id=${regId}`,
      metadata,
      payment_intent_data: {
        metadata,
        description: `${metadata.product_name ?? 'Hackin4Harden'} (${regType}) · ${regId}`,
      },
    })

    /* Drain the A2P fan-out — Vercel kills background promises after the
     * response. We wait so the delivery log lines reach Vercel logs. */
    try {
      const a2p = await a2pPromise
      if (a2p) {
        console.warn('[Checkout API] A2P consent -> GHL', {
          regId,
          sms_updates: a2pPayload.sms_updates,
          sms_promo: a2pPayload.sms_promo,
          attempts: a2p.attempts,
          ok: a2p.ok,
          error: a2p.error,
        })
      }
    } catch (e) {
      console.error('[Checkout API] A2P fan-out failure:', e.message)
    }

    return NextResponse.json({ url: session.url, registrationId: regId })
  } catch (error) {
    console.error('[Checkout API]:', error)
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 },
    )
  }
}

export { POST }
