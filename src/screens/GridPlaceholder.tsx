import { Link, Navigate, useParams } from 'react-router-dom'
import type { ParseResult } from '@/lib/verbs'

// Owned by feature 3 — real title, stub body.
export function GridPlaceholder({ result }: { result: ParseResult }) {
  const { infinitive } = useParams()
  if (!result.ok) return <Navigate to="/" replace />

  const verb = result.verbs.find((v) => v.infinitive === infinitive)
  if (!verb) return <Navigate to="/" replace />

  return (
    <>
      <Link
        to="/"
        className="mb-3 inline-flex min-h-11 items-center font-mono text-xs text-muted"
      >
        ← Verbs
      </Link>
      <h1 className="font-display text-[28px] leading-tight text-chalk">
        {verb.infinitive}
      </h1>
      <p className="mt-0.5 font-mono text-xs tracking-[0.06em] text-muted">
        {verb.phonetic}
      </p>
      <p className="mt-2 text-sm text-muted">
        Conjugation grid lives here — feature 3.
      </p>
    </>
  )
}
