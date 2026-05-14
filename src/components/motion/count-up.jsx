'use client'

import { useEffect, useRef, useState } from 'react'

import { useInView } from 'motion/react'
import PropTypes from 'prop-types'

// Parses values like "11", "$150", "$10K", "100" into a numeric `to`,
// a `prefix`, and an inferred `unit` (none | K | M).
const parseDisplayValue = (raw) => {
  const str = String(raw).trim()
  const prefixMatch = str.match(/^[^\d-]+/)
  const prefix = prefixMatch ? prefixMatch[0] : ''
  const numeric = str.slice(prefix.length)
  const unitMatch = numeric.match(/[A-Za-z]+$/)
  const unit = unitMatch ? unitMatch[0].toUpperCase() : ''
  const numStr = unit ? numeric.slice(0, -unit.length) : numeric
  const parsed = parseFloat(numStr.replace(/,/g, ''))
  return {
    prefix,
    unit,
    to: Number.isFinite(parsed) ? parsed : 0,
  }
}

const formatNumber = (n, decimals) => {
  const fixed = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString()
  const [intPart, decPart] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart ? `${grouped}.${decPart}` : grouped
}

// Cubic ease-out (matches the project's EASE.outSoft visually).
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

const CountUp = ({ value, duration = 1.6, delay = 0, decimals = 0, className = '' }) => {
  const ref = useRef(null)
  /* `amount: 0.2` was `0.4` — the old threshold required 40 % of the
   * card to enter the viewport. On small phones one card can fill more
   * than 250 % of the visible area, so 0.4 never triggered and the
   * counter sat at 0 forever (the "$0K / 0th" bug Operation 1776 flagged). */
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const { prefix, unit, to } = parseDisplayValue(value)
  /* Initialize to the FINAL value so SSR + first paint show real numbers.
   * Worst case (observer never fires) the user just sees the final value
   * — never the broken "0" state. The animation still plays on first
   * in-view; we briefly reset to 0 right before kicking off the tick so
   * the visible animation still goes 0 → final. */
  const finalDisplay = `${prefix}${formatNumber(to, decimals)}${unit}`
  const [display, setDisplay] = useState(finalDisplay)
  const animatedRef = useRef(false)

  useEffect(() => {
    if (!inView || animatedRef.current) return
    animatedRef.current = true

    let rafId
    let cancelled = false
    const startDelay = delay * 1000
    const totalMs = duration * 1000

    /* Reset to 0 immediately so the count-up animation is visible — the
     * initial-state final value is only the no-animation fallback. */
    setDisplay(`${prefix}${formatNumber(0, decimals)}${unit}`)

    const startTimer = setTimeout(() => {
      if (cancelled) return
      const start = performance.now()

      const tick = (now) => {
        if (cancelled) return
        const elapsed = now - start
        const t = Math.min(elapsed / totalMs, 1)
        const eased = easeOut(t)
        const current = to * eased
        setDisplay(`${prefix}${formatNumber(current, decimals)}${unit}`)
        if (t < 1) {
          rafId = requestAnimationFrame(tick)
        } else {
          setDisplay(finalDisplay)
        }
      }
      rafId = requestAnimationFrame(tick)
    }, startDelay)

    return () => {
      cancelled = true
      clearTimeout(startTimer)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [inView, to, prefix, unit, duration, delay, decimals, finalDisplay])

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums' }}
      aria-label={String(value)}
    >
      {display}
    </span>
  )
}

CountUp.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  duration: PropTypes.number,
  delay: PropTypes.number,
  decimals: PropTypes.number,
  className: PropTypes.string,
}

export default CountUp
