'use client'

import { useEffect } from 'react'

import PropTypes from 'prop-types'

import Button from '@/components/ui/button'

const ErrorBoundary = ({ error, reset }) => {
  useEffect(() => {
    console.error('[ErrorBoundary]:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="font-display text-display-lg">We hit a bunker.</h1>
      <p className="text-mesh-600 max-w-md">
        An unexpected error occurred. Try again — and if it keeps happening, let us know.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}

ErrorBoundary.propTypes = {
  error: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
}

export default ErrorBoundary
