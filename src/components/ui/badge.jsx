import PropTypes from 'prop-types'

import { cn } from '@/lib/utils'

const VARIANTS = {
  green: 'bg-green-500/12 text-green-700 border-green-500/30',
  gold: 'bg-gold-400/14 text-gold-600 border-gold-400/35',
  crimson: 'bg-crimson-500/10 text-crimson-500 border-crimson-500/30',
  navy: 'bg-navy-900 text-cream-50 border-navy-700',
  mono: 'bg-cream-100 text-navy-900 border-cream-200',
  inverse: 'bg-cream-50/8 text-cream-50 border-cream-50/20',
}

const Badge = ({ variant = 'green', className = '', children }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1',
        'font-mono text-[10px] font-semibold tracking-[0.20em] uppercase',
        VARIANTS[variant] ?? VARIANTS.green,
        className,
      )}
    >
      {children}
    </span>
  )
}

Badge.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Badge
