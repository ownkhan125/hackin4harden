'use client'

import useMediaQuery from '@/hooks/use-media-query'

const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

export default usePrefersReducedMotion
