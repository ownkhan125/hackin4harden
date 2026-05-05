import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind utility classes safely, with conflict resolution.
 * Use this everywhere class strings are conditionally composed.
 */
export const cn = (...inputs) => twMerge(clsx(inputs))
