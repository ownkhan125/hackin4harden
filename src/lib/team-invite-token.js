import crypto from 'node:crypto'

/* Stateless HMAC-signed invite token for the foursome teammate flow.
 *
 * No DB. The token IS the state — base64url(JSON payload) + signature.
 * A captain's invite link to a teammate carries a verifiable claim about
 * which registration + slot the teammate is filling, with an expiry.
 *
 * Trade-off vs DB-backed tokens: we cannot enforce "used once". A leaked
 * link could be replayed. For a one-time tournament with low fraud risk
 * this is acceptable — the worst case is a teammate slot being filled
 * twice, which event-day staff handle manually.
 *
 * Format:  base64url(JSON_payload) + "." + base64url(HMAC-SHA256)
 *
 * Payload (signed):
 *   {
 *     reg_id: "h4h_reg_...",
 *     slot: 2 | 3 | 4,
 *     captain: "Andy Harden",          // shown on the landing page
 *     team: "Team Harden" | "",        // optional team / company name
 *     exp: 1735689600000                // ms epoch
 *   }
 */

const DEFAULT_TTL_MS = 60 * 60 * 24 * 60 * 1000 // 60 days

const b64urlEncode = (buf) =>
  Buffer.from(buf).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

const b64urlDecode = (s) => {
  const pad = s.length % 4 === 2 ? '==' : s.length % 4 === 3 ? '=' : ''
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad
  return Buffer.from(base64, 'base64')
}

const secret = () => {
  const s = process.env.GHL_WEBHOOK_SHARED_SECRET
  if (!s) throw new Error('GHL_WEBHOOK_SHARED_SECRET is not set')
  return s
}

const sign = (data) =>
  b64urlEncode(crypto.createHmac('sha256', secret()).update(data).digest())

/* signTeamInvite — produces a self-contained token a captain can forward
 * to a teammate. Throws if the secret env var is missing. */
const signTeamInvite = ({ regId, slot, captain, team = '', ttlMs = DEFAULT_TTL_MS }) => {
  if (!regId) throw new Error('signTeamInvite: regId required')
  if (![2, 3, 4].includes(slot)) throw new Error('signTeamInvite: slot must be 2|3|4')
  const payload = {
    reg_id: String(regId),
    slot: Number(slot),
    captain: String(captain ?? ''),
    team: String(team ?? ''),
    exp: Date.now() + ttlMs,
  }
  const body = b64urlEncode(JSON.stringify(payload))
  const sig = sign(body)
  return `${body}.${sig}`
}

/* verifyTeamInvite — returns the payload on success, throws on failure.
 * Constant-time signature comparison. Validates expiry. */
const verifyTeamInvite = (token) => {
  if (typeof token !== 'string') throw new Error('Invalid token')
  const dot = token.indexOf('.')
  if (dot <= 0) throw new Error('Malformed token')
  const body = token.slice(0, dot)
  const providedSig = token.slice(dot + 1)
  const expectedSig = sign(body)
  const a = Buffer.from(providedSig)
  const b = Buffer.from(expectedSig)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error('Signature mismatch')
  }
  let payload
  try {
    payload = JSON.parse(b64urlDecode(body).toString('utf-8'))
  } catch {
    throw new Error('Malformed payload')
  }
  if (typeof payload.exp !== 'number' || payload.exp < Date.now()) {
    throw new Error('Token expired')
  }
  if (![2, 3, 4].includes(payload.slot)) throw new Error('Invalid slot')
  if (!payload.reg_id) throw new Error('Missing reg_id')
  return payload
}

export { signTeamInvite, verifyTeamInvite }
