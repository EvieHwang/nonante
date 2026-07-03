// @scaffolding — the surface named ahead of implementation: default-exported
// App component from '@/App' that renders routes (no router of its own) and
// accepts an optional `verbsData: unknown` prop overriding the shipped
// dataset. The asserted behaviors (data-driven index, explicit error state)
// are the spec's requirements 1 and its edge case, and must hold as written.
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '@/App'
import twoVerbs from '../fixtures/two-verbs.json'
import malformed from '../fixtures/malformed.json'

function renderAt(route: string, verbsData?: unknown) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App {...(verbsData !== undefined ? { verbsData } : {})} />
    </MemoryRouter>,
  )
}

describe('index screen', () => {
  it('shows the shipped verb with infinitive, meaning, and phonetic', () => {
    renderAt('/')
    expect(screen.getByText('être')).toBeInTheDocument()
    expect(screen.getByText('to be')).toBeInTheDocument()
    expect(screen.getByText('EH-truh')).toBeInTheDocument()
  })

  it('renders one entry per verb in the dataset — two verbs, no code change', () => {
    renderAt('/', twoVerbs)
    expect(screen.getByText('être')).toBeInTheDocument()
    expect(screen.getByText('avoir')).toBeInTheDocument()
    expect(screen.getByText('to have')).toBeInTheDocument()
    // The phonetic line must come from the data too — a hardcoded respelling
    // would render EH-truh here.
    expect(screen.getByText('ah-VWAHR')).toBeInTheDocument()
  })

  it('shows an explicit error state naming the problem for a malformed dataset', () => {
    renderAt('/', malformed)
    // Never a blank screen: an error heading, plus a body that names what is
    // wrong with the data (the fixture verb is missing its present forms).
    expect(screen.getByText(/verb data/i)).toBeInTheDocument()
    expect(screen.getByText(/present/i)).toBeInTheDocument()
    // And no half-rendered verb entry.
    expect(screen.queryByText('to be')).not.toBeInTheDocument()
  })

  it('shows the error state for a dataset that is not a list at all', () => {
    renderAt('/', { not: 'a list' })
    expect(screen.getByText(/verb data/i)).toBeInTheDocument()
  })
})
