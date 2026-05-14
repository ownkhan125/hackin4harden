'use client'

import { useEffect, useState } from 'react'

import { CalendarClock } from 'lucide-react'
import PropTypes from 'prop-types'

import { cn } from '@/lib/utils'

/* Days remaining to a fixed event date (default: 2026-06-06 14:30 UTC =
 * 7:30 AM MST). Recomputes on the client every minute so the pill
 * doesn't read "stale" if the user leaves the tab open across midnight. */
const DEFAULT_EVENT_ISO = '2026-06-06T14:30:00Z'

const daysUntil = (targetMs) => {
  const diffMs = targetMs - Date.now()
  if (diffMs <= 0) return 0
  // Round UP — 1 day 1 hour out shows as "2 days to tee-off"
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000))
}

const renderLabel = (days) => {
  if (days === 0) return 'Tournament day — see you on course'
  if (days === 1) return '1 day to tee-off'
  return `${days} days to tee-off`
}

const CountdownPill = ({ eventDate = DEFAULT_EVENT_ISO, className = '' }) => {
  const targetMs = new Date(eventDate).getTime()
  const [days, setDays] = useState(() => daysUntil(targetMs))

  useEffect(() => {
    const tick = () => setDays(daysUntil(targetMs))
    tick()
    const id = setInterval(tick, 60 * 1000)
    return () => clearInterval(id)
  }, [targetMs])

  return (
    <span
      className={cn(
        'border-gold-400/50 bg-gold-50/80 text-gold-700 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.22em] uppercase tabular-nums',
        className,
      )}
      aria-live="polite"
    >
      <CalendarClock className="h-3 w-3" strokeWidth={2} />
      {renderLabel(days)}
    </span>
  )
}

CountdownPill.propTypes = {
  eventDate: PropTypes.string,
  className: PropTypes.string,
}

export default CountdownPill
