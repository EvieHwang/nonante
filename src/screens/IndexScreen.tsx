import { Link } from 'react-router-dom'
import { DataError } from '@/components/DataError'
import { Headword } from '@/components/Headword'
import type { ParseResult } from '@/lib/verbs'

export function IndexScreen({ result }: { result: ParseResult }) {
  if (!result.ok) return <DataError error={result.error} />

  return (
    <>
      <h1 className="mb-4 font-display text-xl text-chalk">Verbs</h1>
      <ul className="space-y-2.5">
        {result.verbs.map((verb) => (
          <li key={verb.infinitive}>
            <Link
              to={`/verbs/${encodeURIComponent(verb.infinitive)}`}
              className="block rounded-[10px] bg-surface px-4 py-3.5"
            >
              <Headword
                infinitive={verb.infinitive}
                phonetic={verb.phonetic}
                meaning={verb.meaning}
              />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-muted">
        <span
          aria-hidden="true"
          className="mr-1.5 inline-block size-2.5 rounded-[2px] bg-brass align-baseline"
        />
        memorized primitive
        <span
          aria-hidden="true"
          className="mr-1.5 ml-4 inline-block size-2.5 rounded-[2px] bg-slate align-baseline"
        />
        derived by formula
      </p>
    </>
  )
}
