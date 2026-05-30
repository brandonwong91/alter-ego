import { cn } from '../../lib/cn'
import { Container } from '../ui/Container'

const navItems = [
  { id: 'trailer', label: 'Trailer' },
  { id: 'showcase', label: 'Showcase' },
  { id: 'demo', label: 'Demo' },
]

export function HeaderNav() {
  return (
    <header className="sticky top-0 z-20">
      <div className="border-b border-white/10 bg-fog-1/60 backdrop-blur-2xl">
        <Container className="flex h-16 items-center justify-between">
          <a
            href="#top"
            className="font-display text-[18px] tracking-[-0.01em] text-ink-1"
          >
            Alter Ego
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
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
            ))}
          </nav>
        </Container>
      </div>
    </header>
  )
}

