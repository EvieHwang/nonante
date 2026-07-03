// @scaffolding — same provisional surface as index-screen.test.tsx (App from
// '@/App' rendered inside a MemoryRouter). The asserted behaviors are the
// spec's requirement 2 (navigation shell) and the unknown-route edge case,
// and must hold as written.
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '@/App'

function renderAt(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )
}

describe('navigation shell', () => {
  it('tapping a verb opens its grid placeholder: infinitive title, stub body', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('link', { name: /être/ }))
    expect(
      screen.getByRole('heading', { name: 'être' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/conjugation grid/i)).toBeInTheDocument()
  })

  it('reaches the drill placeholder from persistent navigation', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const nav = screen.getByRole('navigation')
    await user.click(within(nav).getByRole('link', { name: /drill/i }))
    expect(screen.getByRole('heading', { name: /drill/i })).toBeInTheDocument()
    expect(screen.getByText(/drill loop/i)).toBeInTheDocument()
  })

  it('keeps the navigation present on placeholder screens', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('link', { name: /être/ }))
    const nav = screen.getByRole('navigation')
    expect(within(nav).getByRole('link', { name: /drill/i })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: /verbs/i })).toBeInTheDocument()
  })

  it('one back action from the grid placeholder returns to the index', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('link', { name: /être/ }))
    expect(screen.getByText(/conjugation grid/i)).toBeInTheDocument()

    await user.click(screen.getAllByRole('link', { name: /verbs/i })[0])
    // Back on the index: the verb list is visible again.
    expect(screen.getByText('to be')).toBeInTheDocument()
    expect(screen.queryByText(/conjugation grid/i)).not.toBeInTheDocument()
  })

  it('lands on the index for an unknown route', () => {
    renderAt('/definitely-not-a-route')
    expect(screen.getByText('être')).toBeInTheDocument()
    expect(screen.getByText('to be')).toBeInTheDocument()
  })
})
