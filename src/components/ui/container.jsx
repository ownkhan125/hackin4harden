import PropTypes from 'prop-types'

import { cn } from '@/lib/utils'

const Container = ({ as: Component = 'div', className = '', children, ...props }) => {
  return (
    <Component
      className={cn('mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

Container.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Container
