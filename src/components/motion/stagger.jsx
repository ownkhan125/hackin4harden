'use client'

import { motion } from 'motion/react'
import PropTypes from 'prop-types'

import { stagger as staggerVariants, VIEWPORT } from '@/constants/motion'

/**
 * Orchestrates a staggered child reveal on viewport entry.
 *
 * Hands off cleanly from the section header above it — `delayChildren`
 * gives the header time to land first, then the cards/items cascade in
 * one after another to create the timeline feel.
 */
const Stagger = ({ delay = 0.09, delayChildren = 0.18, className = '', children, ...rest }) => {
  return (
    <motion.div
      variants={staggerVariants(delay, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

Stagger.propTypes = {
  delay: PropTypes.number,
  delayChildren: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Stagger
