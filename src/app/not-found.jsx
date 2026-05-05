import Link from 'next/link'

import Button from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display text-display-lg">Out of bounds.</h1>
      <p className="text-mesh-600 max-w-md">
        The page you’re looking for isn’t on the course. Head back to the clubhouse.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  )
}

export default NotFound
