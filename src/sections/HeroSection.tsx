import { Reveal } from '../components/motion/Reveal'
import { PointerField } from '../components/motion/PointerField'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'

export function HeroSection() {
  return (
    <Section id="top" className="pt-10 lg:pt-14">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[12px] tracking-[0.22em] uppercase text-ink-2 backdrop-blur-xl">
                Cozy surreal · life-path teaser
              </div>
            </Reveal>
            <Reveal delayMs={120}>
              <h1 className="mt-6 font-display text-[56px] leading-[0.95] tracking-[-0.04em] text-ink-1 sm:text-[68px] lg:text-[82px]">
                <span className="relative inline-block">
                  <span className="bg-[linear-gradient(110deg,rgba(20,16,28,1)_0%,rgba(20,16,28,1)_35%,rgba(140,111,193,0.92)_55%,rgba(213,139,100,0.92)_68%,rgba(20,16,28,1)_90%)] bg-[length:220%_100%] bg-clip-text text-transparent animate-glint">
                    Alter Ego
                  </span>
                  <span className="pointer-events-none absolute -bottom-2 left-0 h-[10px] w-full bg-[radial-gradient(circle_at_50%_50%,rgba(215,200,241,0.42),rgba(215,200,241,0)_65%)] blur-md" />
                </span>
              </h1>
            </Reveal>
            <Reveal delayMs={220}>
              <p className="mt-5 max-w-[52ch] text-[18px] leading-[1.7] text-ink-2">
                A quiet game about the selves you almost lived. Step through warm
                fog, choose a world, and meet the person that emerges inside it.
              </p>
            </Reveal>
            <Reveal delayMs={320}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#demo">
                  <Button size="lg">Reveal my Alter Ego</Button>
                </a>
                <a href="#trailer">
                  <Button size="lg" variant="ghost">
                    Watch trailer
                  </Button>
                </a>
              </div>
            </Reveal>
            <Reveal delayMs={420}>
              <div className="mt-10 grid gap-3 border-t border-white/12 pt-8 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/14 bg-white/8 px-5 py-4 backdrop-blur-xl">
                  <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
                    Explore
                  </div>
                  <div className="mt-2 text-[14px] leading-[1.6] text-ink-2">
                    Rotate locations. Let atmospheres change your answers.
                  </div>
                </div>
                <div className="rounded-3xl border border-white/14 bg-white/8 px-5 py-4 backdrop-blur-xl">
                  <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
                    Meet
                  </div>
                  <div className="mt-2 text-[14px] leading-[1.6] text-ink-2">
                    Four archetypes. Each one a mirror with a soft edge.
                  </div>
                </div>
                <div className="rounded-3xl border border-white/14 bg-white/8 px-5 py-4 backdrop-blur-xl">
                  <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
                    Remember
                  </div>
                  <div className="mt-2 text-[14px] leading-[1.6] text-ink-2">
                    Your run history stays local. No accounts, no servers.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="relative">
            <PointerField className="group relative mx-auto aspect-square w-full max-w-[520px]">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(215,200,241,0.65),rgba(215,200,241,0)_62%)] blur-2xl transition group-hover:opacity-90" />
              <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle_at_45%_45%,rgba(255,214,191,0.55),rgba(255,214,191,0)_62%)] blur-2xl transition group-hover:opacity-90" />
              <div className="absolute inset-16 rounded-full bg-[radial-gradient(circle_at_45%_45%,rgba(167,185,170,0.46),rgba(167,185,170,0)_66%)] blur-2xl transition group-hover:opacity-90" />

              <div className="absolute inset-0 rounded-full border border-white/18 bg-white/10 shadow-bloom backdrop-blur-2xl" />
              <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_calc(var(--mx)*100%)_calc(var(--my)*100%),rgba(255,255,255,0.42),rgba(255,255,255,0)_60%)] opacity-80 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-10 rounded-full border border-white/14 bg-white/6 backdrop-blur-2xl" />
              <div className="absolute inset-12 rounded-full bg-[conic-gradient(from_180deg,rgba(140,111,193,0.0),rgba(140,111,193,0.18),rgba(213,139,100,0.14),rgba(140,111,193,0.0))] opacity-70 animate-orb-breathe" />
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-[10px] animate-soft-float" />

              <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/14" />
                <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
              </div>
            </PointerField>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
