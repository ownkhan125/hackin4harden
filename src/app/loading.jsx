const Loading = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="text-mesh-600 font-mono text-xs tracking-[0.22em] uppercase">Loading</span>
      </div>
    </div>
  )
}

export default Loading
