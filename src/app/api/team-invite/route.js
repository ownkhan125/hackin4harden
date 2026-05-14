import { NextResponse } from 'next/server'

import { postSigned } from '@/lib/ghl-webhook'
import { verifyTeamInvite } from '@/lib/team-invite-token'

export const runtime = 'nodejs'

const SHARED_SECRET = process.env.GHL_WEBHOOK_SHARED_SECRET
const URL_REGISTRATION = process.env.GHL_INBOUND_WEBHOOK_URL_REGISTRATION
const URL_FOURSOME = process.env.GHL_INBOUND_WEBHOOK_URL_FOURSOME

const trim = (s) => (typeof s === 'string' ? s.trim() : '')

/* POST /api/team-invite
 *
 * Receives a teammate's filled-in info + the original signed invite
 * token. Verifies the token (HMAC), then sends a `team_invite.submitted`
 * payload to the Registration Paid + Foursome GHL inbound webhooks.
 *
 * The captain's `H4H — Registration Paid` workflow is expected to
 * match on `registration_id` and patch the corresponding `pN_*` custom
 * fields on the captain contact. */
const POST = async (req) => {
  try {
    const body = await req.json()
    const token = trim(body.token)
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    let payload
    try {
      payload = verifyTeamInvite(token)
    } catch (err) {
      return NextResponse.json(
        { error: `Invite token invalid: ${err.message}` },
        { status: 401 },
      )
    }

    const fullName = trim(body.fullName)
    const email = trim(body.email)
    const phone = trim(body.phone)
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required.' },
        { status: 400 },
      )
    }

    const parts = fullName.split(/\s+/)
    const firstName = parts[0] ?? ''
    const lastName = parts.slice(1).join(' ')
    const slot = payload.slot
    const ghlPayload = {
      event_type: 'team_invite.submitted',
      registration_id: payload.reg_id,
      registration_type: 'foursome',
      submitted_at: new Date().toISOString(),
      captain_name: payload.captain,
      team_name: payload.team,
      slot,
      /* Flat keys matching the same naming convention as the paid
       * registration payload — keeps the GHL workflow mappings
       * consistent. Only one of these slots is filled per call;
       * the other two stay empty strings. */
      [`p${slot}_first_name`]: firstName,
      [`p${slot}_last_name`]: lastName,
      [`p${slot}_full_name`]: fullName,
      [`p${slot}_email`]: email,
      [`p${slot}_phone`]: phone,
      [`p${slot}_group_info`]: trim(body.groupInfo),
      [`p${slot}_notes`]: trim(body.notes),
      /* Nested participant block kept for parity with the paid payload. */
      participant: {
        slot,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        email,
        phone,
        group_info: trim(body.groupInfo),
        notes: trim(body.notes),
      },
    }

    /* Fan out to both the main Registration Paid URL (the captain's
     * primary workflow) and the Foursome-specific URL — so whichever
     * workflow owns the contact-update logic can find it. Either or
     * both may be unset; postSigned no-ops on missing URLs. */
    const [primary, fanout] = await Promise.all([
      postSigned(URL_REGISTRATION, ghlPayload, SHARED_SECRET),
      postSigned(URL_FOURSOME, ghlPayload, SHARED_SECRET),
    ])

    console.warn('[Team invite] submitted -> GHL', {
      regId: payload.reg_id,
      slot,
      primary: { ok: primary.ok, attempts: primary.attempts, error: primary.error },
      fanout: { ok: fanout.ok, attempts: fanout.attempts, error: fanout.error },
    })

    /* Even if GHL delivery fails after retries, the teammate's
     * submission succeeded from their perspective — we'll have logged
     * the failure for ops to replay manually. */
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Team invite] handler error:', error)
    return NextResponse.json(
      { error: error.message ?? 'Submit failed' },
      { status: 500 },
    )
  }
}

export { POST }
