'use client'

import { motion } from 'motion/react'
import PropTypes from 'prop-types'

import { fadeUp } from '@/constants/motion'

const StaggerItem = ({ className = '', children }) => {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  )
}

StaggerItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default StaggerItem
