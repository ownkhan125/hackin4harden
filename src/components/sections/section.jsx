'use client'

import { motion } from 'motion/react'
import PropTypes from 'prop-types'

import Container from '@/components/ui/container'

import { cn } from '@/lib/utils'
import { EASE, VIEWPORT } from '@/constants/motion'

/**
 * Section wrapper used across the homepage.
 *
 * Adds a subtle "build line" — a thin gold hairline that sweeps in along
 * the top edge as the section enters viewport. It's the visual handoff
 * from one section to the next, reinforcing the timeline-reveal feel.
 * The line is decorative (`aria-hidden`), pointer-events-none, and never
 * affects layout or spacing.
 */
const Section = ({
  id,
  as: Component = 'section',
  className = '',
  containerClassName = '',
  showBuildLine = true,
  children,
}) => {
  return (
    <Component id={id} className={cn('section-pad relative', className)}>
      {showBuildLine ? (
        <motion.span
          aria-hidden
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 0.55 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.1, ease: EASE.outExpo, delay: 0.05 }}
          style={{ transformOrigin: 'left center' }}
          className="via-gold-400/55 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
        />
      ) : null}
      <Container className={containerClassName}>{children}</Container>
    </Component>
  )
}

Section.propTypes = {
  id: PropTypes.string,
  as: PropTypes.elementType,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  showBuildLine: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Section
