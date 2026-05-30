import { Container } from '../components/ui/Container'

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="font-display text-[18px] text-ink-1">Alter Ego</div>
          <div className="mt-1 text-[13px] leading-[1.6] text-ink-3">
            A cozy-surreal life-path game teaser. Built as a local-only
            prototype.
          </div>
        </div>
      </Container>
    </footer>
  )
}
