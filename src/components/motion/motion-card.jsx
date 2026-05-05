'use client'

import { motion } from 'motion/react'
import PropTypes from 'prop-types'

import { cn } from '@/lib/utils'
import { EASE } from '@/constants/motion'

/**
 * Premium motion card — adds a refined hover micro-interaction to any container:
 *   · subtle 4 px lift
 *   · 1.012 scale
 *   · soft outer glow ring (green or gold) that fades in
 *   · a sheen sweep that crosses left → right on hover
 *
 * The card itself remains free to provide its own background, border, padding,
 * and top accent rule. This component is purely the motion + glow layer.
 */

const GLOW = {
  green: 'shadow-[0_0_0_1px_rgba(46,125,63,0.32),0_30px_60px_-25px_rgba(46,125,63,0.45)]',
  gold: 'shadow-[0_0_0_1px_rgba(194,138,32,0.40),0_30px_60px_-25px_rgba(194,138,32,0.45)]',
  navy: 'shadow-[0_0_0_1px_rgba(11,18,32,0.30),0_30px_60px_-25px_rgba(11,18,32,0.50)]',
  none: '',
}

const MotionCard = ({
  className = '',
  hoverY = -4,
  hoverScale = 1.012,
  glow = 'green',
  sheen = true,
  children,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ y: hoverY, scale: hoverScale }}
      transition={{ duration: 0.36, ease: EASE.outSoft }}
      className={cn('group/card relative will-change-transform', className)}
      {...props}
    >
      {/* Hover glow ring — outside the card by 1 px, fades in on hover */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute -inset-px rounded-[inherit] opacity-0',
          'transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'group-hover/card:opacity-100',
          GLOW[glow] ?? GLOW.green,
        )}
      />

      {/* Sheen sweep — diagonal highlight that crosses on hover */}
      {sheen ? (
        <span
          aria-hidden
          className={cn('pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]')}
        >
          <span
            className={cn(
              'absolute inset-y-0 left-0 w-1/2 -translate-x-full skew-x-[-12deg]',
              'bg-gradient-to-r from-transparent via-white/[0.07] to-transparent',
              'transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
              'group-hover/card:translate-x-[220%]',
            )}
          />
        </span>
      ) : null}

      {children}
    </motion.div>
  )
}

MotionCard.propTypes = {
  className: PropTypes.string,
  hoverY: PropTypes.number,
  hoverScale: PropTypes.number,
  glow: PropTypes.oneOf(['green', 'gold', 'navy', 'none']),
  sheen: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default MotionCard
