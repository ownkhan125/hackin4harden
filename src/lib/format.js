/**
 * Format a number as USD currency.
 * @param {number} value
 * @returns {string}
 */
export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value ?? 0)

/**
 * Format an ISO date as a readable long-form date.
 * @param {string} iso
 * @returns {string}
 */
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
