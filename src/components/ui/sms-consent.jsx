'use client'

import PropTypes from 'prop-types'

import { Checkbox } from '@/components/ui/form-field'

import { LEGAL_ENTITY, SMS_CONSENT_INFORMATIONAL, SMS_CONSENT_PROMOTIONAL } from '@/constants/site'

/**
 * SmsConsent — drop-in compliance block for any form that collects a phone number.
 *
 * Implements the Operation 1776 A2P 10DLC SOP requirements:
 *   • Two separate, optional, NOT-pre-checked checkboxes
 *   • Each checkbox names the legal entity ({@link LEGAL_ENTITY})
 *   • Each checkbox includes STOP, HELP, frequency, and rate disclosures
 *   • Rendered at the bottom of the form, above the submit button
 *
 * Pass an `idPrefix` to keep checkbox IDs unique when more than one form
 * appears on the same route.
 */
const SmsConsent = ({ idPrefix }) => {
  return (
    <div className="border-cream-200 bg-cream-50 space-y-3 rounded-lg border p-5">
      <Checkbox
        id={`${idPrefix}-sms-info`}
        name="smsConsentInformational"
        label={SMS_CONSENT_INFORMATIONAL}
      />
      <Checkbox
        id={`${idPrefix}-sms-promo`}
        name="smsConsentPromotional"
        label={SMS_CONSENT_PROMOTIONAL}
      />
    </div>
  )
}

SmsConsent.propTypes = {
  idPrefix: PropTypes.string.isRequired,
}

export default SmsConsent
