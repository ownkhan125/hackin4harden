import PropTypes from 'prop-types'

import { cn } from '@/lib/utils'

const Eyebrow = ({ className = '', children }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 font-mono text-xs font-semibold uppercase',
        'text-gold-400 tracking-[0.22em]',
        'before:bg-gold-400/60 before:block before:h-px before:w-10',
        className,
      )}
    >
      {children}
    </span>
  )
}

Eyebrow.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Eyebrow
