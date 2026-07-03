// The app's signature element: a verb rendered as a dictionary headword.
export function Headword({
  infinitive,
  phonetic,
  meaning,
}: {
  infinitive: string
  phonetic: string
  meaning?: string
}) {
  return (
    <span className="block">
      <span className="block font-display text-[28px] leading-tight text-chalk">
        {infinitive}
      </span>
      <span className="mt-0.5 block font-mono text-xs tracking-[0.06em] text-muted">
        {phonetic}
      </span>
      {meaning !== undefined && (
        <span className="mt-1 block text-sm text-muted">{meaning}</span>
      )}
    </span>
  )
}
