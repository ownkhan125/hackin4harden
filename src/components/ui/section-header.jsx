'use client'

import { motion } from 'motion/react'
import PropTypes from 'prop-types'

import { cn } from '@/lib/utils'
import { EASE, VIEWPORT, fadeUpHeader, fadeUpTitle, sweepRule } from '@/constants/motion'

/**
 * Section header — orchestrates the section's "build-in" cascade on viewport entry:
 *   1. Gold hairline rule sweeps in from the left (origin-left, scaleX)
 *   2. Eyebrow label fades up
 *   3. Display title fades up + subtle scale (cinematic anchor)
 *   4. Lead paragraph fades up
 *   5. Children fade up
 *
 * Each tier delayed via staggerChildren — the section feels like it is
 * constructing itself in front of the reader, not just popping in.
 */

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.06 },
  },
}

const SectionHeader = ({
  eyebrow,
  title,
  lead,
  align = 'left',
  invert = false,
  className = '',
  children,
}) => {
  const isCenter = align === 'center'

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={cn('max-w-3xl', isCenter && 'mx-auto text-center', className)}
    >
      <motion.span
        variants={fadeUpHeader}
        className={cn(
          'inline-flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.22em] uppercase',
          invert ? 'text-gold-400' : 'text-gold-500',
        )}
      >
        <motion.span
          variants={sweepRule}
          aria-hidden
          className="bg-gold-400/70 block h-px w-10 origin-left"
          style={{ transformOrigin: 'left center' }}
        />
        {eyebrow}
      </motion.span>

      <motion.h2
        variants={fadeUpTitle}
        className={cn(
          'font-display text-display-lg sm:text-display-xl mt-6 font-semibold tracking-[-0.02em]',
          invert ? 'text-cream-50' : 'text-navy-900',
        )}
      >
        {title}
      </motion.h2>

      {lead ? (
        <motion.p
          variants={fadeUpHeader}
          className={cn(
            'mt-5 max-w-2xl text-base leading-relaxed sm:text-lg',
            isCenter && 'mx-auto',
            invert ? 'text-cream-100/72' : 'text-mesh-600',
          )}
        >
          {lead}
        </motion.p>
      ) : null}

      {children ? (
        <motion.div variants={fadeUpHeader} transition={{ duration: 0.65, ease: EASE.outSoft }}>
          {children}
        </motion.div>
      ) : null}
    </motion.div>
  )
}

SectionHeader.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  lead: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center']),
  invert: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
}

export default SectionHeader
