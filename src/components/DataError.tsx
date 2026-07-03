// Explicit error surface for a malformed dataset — never a blank screen.
export function DataError({ error }: { error: string }) {
  return (
    <div role="alert">
      <h1 className="font-display text-xl text-chalk">
        Verb data didn&rsquo;t load
      </h1>
      <p className="mt-2 text-sm text-muted">{error}</p>
    </div>
  )
}
