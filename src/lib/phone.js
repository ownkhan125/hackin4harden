/* Canonical phone helpers per forms-compliance-pattern.md.
 *
 * Every form on the project that collects a phone number uses these two
 * helpers exclusively — never a raw `phone?.trim() || ''` fallback. The
 * client-side formatter binds to the input's onChange; the server-side
 * normalizer runs in every API route that ships a phone number to GHL
 * or Stripe.
 *
 *   formatPhoneInput     — live formatter for client onChange
 *   normalizePhoneForSubmit — server-side canonical producer
 *
 * Both keep the rule book identical:
 *   • Visible pattern: +1 (xxx) xxx-xxxx
 *   • We own the +1; any user-typed +1 / leading 1 is stripped
 *   • Partial values (<10 digits) → empty string on the server
 *   • Empty input → empty string (never the literal "+1")
 */

const onlyDigits = (s) => (typeof s === 'string' ? s.replace(/\D+/g, '') : '')

/* Drop the user's country code if they typed it. We OWN +1; the visible
 * "+1" prefix in the input is ours, not theirs. */
const stripCountryCode = (digits) => {
  if (digits.startsWith('1') && digits.length >= 11) return digits.slice(1)
  if (digits === '1') return ''
  return digits
}

const formatFromDigits = (rawDigits) => {
  const stripped = stripCountryCode(rawDigits).slice(0, 10)
  if (stripped.length === 0) return ''
  if (stripped.length < 4) return `+1 (${stripped}`
  if (stripped.length < 7) return `+1 (${stripped.slice(0, 3)}) ${stripped.slice(3)}`
  return `+1 (${stripped.slice(0, 3)}) ${stripped.slice(3, 6)}-${stripped.slice(6, 10)}`
}

/* Client-side onChange formatter. Returns the next display value for the
 * input. Always returns a fully-formatted partial — typing 5 → "+1 (5". */
const formatPhoneInput = (input) => formatFromDigits(onlyDigits(input))

/* Server-side canonical producer. Yields "" for any input that doesn't
 * have a full 10-digit local number. Used in every API route before the
 * value gets stored / forwarded. */
const normalizePhoneForSubmit = (input) => {
  const stripped = stripCountryCode(onlyDigits(input)).slice(0, 10)
  if (stripped.length !== 10) return ''
  return `+1 (${stripped.slice(0, 3)}) ${stripped.slice(3, 6)}-${stripped.slice(6, 10)}`
}

/* Cheap predicate for the consent-gating UX: a phone counts as "has a
 * value" the moment the user types any digit beyond our prefix. */
const phoneHasValue = (input) =>
  stripCountryCode(onlyDigits(input)).length > 0

export { formatPhoneInput, normalizePhoneForSubmit, phoneHasValue }
