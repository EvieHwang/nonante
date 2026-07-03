import { useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import shippedVerbs from '@/data/verbs.json'
import { parseVerbs } from '@/lib/verbs'
import { DrillPlaceholder } from '@/screens/DrillPlaceholder'
import { GridPlaceholder } from '@/screens/GridPlaceholder'
import { IndexScreen } from '@/screens/IndexScreen'

// `verbsData` overrides the shipped dataset — a testability seam only.
export default function App({ verbsData }: { verbsData?: unknown }) {
  const result = useMemo(
    () => parseVerbs(verbsData === undefined ? shippedVerbs : verbsData),
    [verbsData],
  )

  return (
    <div className="mx-auto min-h-dvh max-w-lg">
      <main className="px-4 pt-5 pb-28">
        <Routes>
          <Route path="/" element={<IndexScreen result={result} />} />
          <Route
            path="/verbs/:infinitive"
            element={<GridPlaceholder result={result} />}
          />
          <Route path="/drill" element={<DrillPlaceholder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <NavBar />
    </div>
  )
}
