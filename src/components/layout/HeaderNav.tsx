import { cn } from '../../lib/cn'
import { Container } from '../ui/Container'
import { Link, useLocation } from 'react-router-dom'

const landingNavItems = [
  { id: 'trailer', label: 'Trailer' },
  { id: 'showcase', label: 'Showcase' },
  { id: 'demo', label: 'Demo' },
]

export function HeaderNav() {
  const location = useLocation()
  const onLanding = location.pathname === '/'

  return (
    <header className="sticky top-0 z-20">
      <div className="border-b border-white/10 bg-fog-1/60 backdrop-blur-2xl">
        <Container className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="font-display text-[18px] tracking-[-0.01em] text-ink-1"
          >
            Alter Ego
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {onLanding
              ? landingNavItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      'rounded-full border border-transparent px-4 py-2 text-[13px] tracking-[0.12em] uppercase',
                      'text-ink-2 transition hover:border-white/14 hover:bg-white/10 hover:text-ink-1',
                    )}
                  >
                    {item.label}
                  </a>
                ))
              : null}
            <Link
              to="/game"
              className={cn(
                'rounded-full border border-transparent px-4 py-2 text-[13px] tracking-[0.12em] uppercase',
                location.pathname === '/game'
                  ? 'border-white/14 bg-white/10 text-ink-1'
                  : 'text-ink-2 transition hover:border-white/14 hover:bg-white/10 hover:text-ink-1',
              )}
            >
              Game
            </Link>
          </nav>
        </Container>
      </div>
    </header>
  )
}
