import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const items = [
  { to: '/', label: 'Verbs' },
  { to: '/drill', label: 'Drill' },
]

// Persistent bottom bar, right-weighted for the right thumb in portrait.
export function NavBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 flex justify-end gap-2 border-t border-chalk/10 bg-surface px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
      aria-label="Main"
    >
      {items.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex min-h-11 min-w-24 items-center justify-center rounded-[10px] text-sm font-medium text-muted',
              isActive && 'bg-brass/10 text-brass',
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
