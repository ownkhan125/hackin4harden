'use client'

import { motion } from 'motion/react'
import { cva } from 'class-variance-authority'
import PropTypes from 'prop-types'

import { cn } from '@/lib/utils'
import { EASE } from '@/constants/motion'

/**
 * Premium SaaS button — refined radius, motion-driven hover, sheen sweep.
 * Use `asChild` to wrap a Link/anchor without losing motion on the trigger.
 */

const base = cn(
  // Outer button — flex row, never wrap
  'group/btn relative inline-flex flex-row items-center justify-center gap-2 whitespace-nowrap',
  'overflow-hidden rounded-lg select-none',
  'font-mono text-[11px] font-semibold uppercase tracking-[0.16em] leading-none',
  'transition-[background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2',
  'focus-visible:ring-offset-cream-50',
  'disabled:pointer-events-none disabled:opacity-45',
  // Any direct svg inside the button (or inside an anchor child) — no shrink, sized, animated
  '[&_svg]:h-4 [&_svg]:w-4 [&_svg]:flex-none',
  '[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-[cubic-bezier(0.22,1,0.36,1)]',
  'hover:[&_svg:last-child]:translate-x-0.5',
  // CRITICAL — when asChild wraps a <Link>/<a>, force the anchor itself to be a
  // full-bleed horizontal flex row so text + icon stay inline. Eliminates the
  // arrow-wrapping-below-text bug on every variant and every breakpoint.
  '[&_a]:inline-flex [&_a]:h-full [&_a]:w-full [&_a]:flex-row [&_a]:items-center',
  '[&_a]:justify-center [&_a]:gap-2 [&_a]:whitespace-nowrap [&_a]:no-underline',
)

const buttonVariants = cva(base, {
  variants: {
    variant: {
      primary: cn(
        'bg-green-600 text-cream-50',
        'shadow-[0_8px_24px_-14px_rgba(46,125,63,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]',
        'hover:bg-green-500',
        'hover:shadow-[0_22px_46px_-18px_rgba(46,125,63,0.65),inset_0_1px_0_rgba(255,255,255,0.12)]',
      ),
      gold: cn(
        'bg-gold-400 text-navy-900',
        'shadow-[0_8px_24px_-14px_rgba(194,138,32,0.6),inset_0_1px_0_rgba(255,255,255,0.20)]',
        'hover:bg-gold-300',
        'hover:shadow-[0_22px_46px_-18px_rgba(194,138,32,0.75),inset_0_1px_0_rgba(255,255,255,0.30)]',
      ),
      ghost: cn(
        'border border-navy-900/85 bg-transparent text-navy-900',
        'hover:bg-navy-900 hover:text-cream-50',
        'hover:shadow-[0_14px_36px_-16px_rgba(11,18,32,0.45)]',
      ),
      ghostLight: cn(
        'border border-cream-50/30 bg-cream-50/[0.03] text-cream-50 backdrop-blur-sm',
        'hover:border-cream-50/70 hover:bg-cream-50/10',
        'hover:shadow-[0_14px_36px_-14px_rgba(0,0,0,0.55)]',
      ),
      link: cn(
        'h-auto rounded-none px-0 text-green-600',
        'tracking-normal normal-case text-sm font-medium font-sans',
        'underline-offset-4 hover:underline',
      ),
    },
    size: {
      sm: 'h-9 px-4',
      md: 'h-11 px-5',
      lg: 'h-[52px] px-7 text-[12px]',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

const HOVER_MOTION = {
  whileHover: { y: -1.5 },
  whileTap: { scale: 0.975 },
  transition: { duration: 0.22, ease: EASE.outSoft },
}

const Sheen = () => (
  <span
    aria-hidden
    className={cn(
      'pointer-events-none absolute inset-y-0 left-0 w-1/2',
      'bg-gradient-to-r from-transparent via-white/12 to-transparent',
      '-translate-x-full skew-x-[-12deg] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
      'group-hover/btn:translate-x-[220%]',
    )}
  />
)

const Button = ({
  asChild = false,
  variant = 'primary',
  size = 'md',
  className = '',
  children = null,
  ...props
}) => {
  const Tag = asChild ? motion.span : motion.button
  const showSheen = variant !== 'link' && variant !== 'ghost' && variant !== 'ghostLight'

  return (
    <Tag {...HOVER_MOTION} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {showSheen ? <Sheen /> : null}
      <span className="relative z-10 inline-flex h-full w-full flex-row items-center justify-center gap-2 whitespace-nowrap">
        {children}
      </span>
    </Tag>
  )
}

Button.propTypes = {
  asChild: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'gold', 'ghost', 'ghostLight', 'link']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  children: PropTypes.node,
}

export { buttonVariants }
export default Button
