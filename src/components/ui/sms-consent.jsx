'use client'

import PropTypes from 'prop-types'

import { Checkbox } from '@/components/ui/form-field'

import { SMS_CONSENT_INFORMATIONAL, SMS_CONSENT_PROMOTIONAL } from '@/constants/site'

/**
 * SmsConsentInline — the *informational* (transactional) consent checkbox.
 *
 * Designed to sit inline directly under the phone input. No card wrapper —
 * just the checkbox + the SOP-required full compliance label. Operation
 * 1776 A2P 10DLC SOP requires the legal entity, use case, frequency, STOP,
 * and HELP language verbatim, which is exactly what
 * {@link SMS_CONSENT_INFORMATIONAL} provides.
 */
const SmsConsentInline = ({ idPrefix }) => (
  <div className="bg-cream-50 border-cream-200 mt-2 rounded-md border p-3">
    <Checkbox
      id={`${idPrefix}-sms-info`}
      name="smsConsentInformational"
      label={SMS_CONSENT_INFORMATIONAL}
    />
  </div>
)

SmsConsentInline.propTypes = {
  idPrefix: PropTypes.string.isRequired,
}

/**
 * SmsConsentPromotional — the *optional* promotional consent block.
 *
 * Visually separated from the transactional consent so users don't perceive
 * the form's bottom as "three legal checkboxes in a row". Headed with a
 * clear "Optional" label to signal the choice; full SOP-compliant copy
 * preserved via {@link SMS_CONSENT_PROMOTIONAL}.
 */
const SmsConsentPromotional = ({ idPrefix }) => (
  <div className="border-cream-200 bg-cream-50 space-y-2 rounded-lg border p-5">
    <p className="text-mesh-500 font-mono text-[11px] font-semibold tracking-[0.22em] uppercase">
      Optional · stay in the loop
    </p>
    <Checkbox
      id={`${idPrefix}-sms-promo`}
      name="smsConsentPromotional"
      label={SMS_CONSENT_PROMOTIONAL}
    />
  </div>
)

SmsConsentPromotional.propTypes = {
  idPrefix: PropTypes.string.isRequired,
}

/**
 * SmsConsent — combined, backwards-compatible wrapper. Renders both
 * consents in a single bordered block. Prefer the two split helpers
 * above (SmsConsentInline / SmsConsentPromotional) for new forms.
 */
const SmsConsent = ({ idPrefix }) => (
  <div className="space-y-4">
    <SmsConsentInline idPrefix={idPrefix} />
    <SmsConsentPromotional idPrefix={idPrefix} />
  </div>
)

SmsConsent.propTypes = {
  idPrefix: PropTypes.string.isRequired,
}

export { SmsConsentInline, SmsConsentPromotional }
export default SmsConsent
