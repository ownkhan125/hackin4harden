'use client'

import { motion } from 'motion/react'
import PropTypes from 'prop-types'

import { EASE, VIEWPORT } from '@/constants/motion'

const FadeIn = ({ delay = 0, duration = 0.6, y = 24, className = '', children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE.outSoft }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

FadeIn.propTypes = {
  delay: PropTypes.number,
  duration: PropTypes.number,
  y: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default FadeIn
