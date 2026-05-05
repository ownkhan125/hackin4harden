'use client'

import PropTypes from 'prop-types'

import { cn } from '@/lib/utils'

const labelClass =
  'block font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-mesh-600'

const requiredAsterisk = (
  <span aria-hidden className="text-crimson-500 ml-1">
    *
  </span>
)

const baseInput = cn(
  'block w-full appearance-none rounded-lg border border-cream-300 bg-cream-50 px-4 py-3.5 text-base text-navy-900 placeholder:text-mesh-400',
  'transition-[border-color,box-shadow,background-color] duration-200',
  'focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20',
  'disabled:cursor-not-allowed disabled:opacity-60',
)

/** Label + control wrapper. */
const Field = ({ id, label, required = false, hint, error, children, className = '' }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <label htmlFor={id} className={labelClass}>
          {label}
          {required ? requiredAsterisk : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="text-mesh-500 text-xs">{hint}</p> : null}
      {error ? <p className="text-crimson-500 text-xs font-medium">{error}</p> : null}
    </div>
  )
}

Field.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  hint: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

const Input = ({ className = '', ...props }) => (
  <input className={cn(baseInput, className)} {...props} />
)

Input.propTypes = { className: PropTypes.string }

const Textarea = ({ rows = 5, className = '', ...props }) => (
  <textarea
    rows={rows}
    className={cn(baseInput, 'min-h-[120px] resize-y leading-relaxed', className)}
    {...props}
  />
)

Textarea.propTypes = { rows: PropTypes.number, className: PropTypes.string }

const Select = ({ className = '', children, ...props }) => (
  <div className="relative">
    <select
      className={cn(baseInput, 'bg-cream-50 cursor-pointer appearance-none pr-12', className)}
      {...props}
    >
      {children}
    </select>
    <span
      aria-hidden
      className="text-mesh-500 pointer-events-none absolute inset-y-0 right-4 flex items-center"
    >
      ▾
    </span>
  </div>
)

Select.propTypes = { className: PropTypes.string, children: PropTypes.node.isRequired }

const Checkbox = ({ id, label, className = '', ...props }) => (
  <label htmlFor={id} className={cn('group flex cursor-pointer items-start gap-3', className)}>
    <span className="relative mt-0.5 flex h-5 w-5 flex-none items-center justify-center">
      <input
        id={id}
        type="checkbox"
        className="peer border-cream-300 bg-cream-50 absolute inset-0 h-full w-full cursor-pointer appearance-none rounded border transition-colors checked:border-green-500 checked:bg-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
        {...props}
      />
      <svg
        viewBox="0 0 16 16"
        className="pointer-events-none relative h-3 w-3 opacity-0 peer-checked:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 8 7 12 13 4" className="text-cream-50" />
      </svg>
    </span>
    <span className="text-mesh-600 text-sm leading-relaxed">{label}</span>
  </label>
)

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export { Field, Input, Textarea, Select, Checkbox }
