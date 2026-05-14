/* Next.js renders this UI between route navigations while the next
 * page's data is fetching. Originally the placeholder displayed a
 * literal "Loading" word, which Operation 1776 caught lingering on
 * the rendered home page during slow fetches. The visual pulse is
 * enough — no text needed. */
const Loading = () => {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
      <span className="sr-only">Loading</span>
    </div>
  )
}

export default Loading
