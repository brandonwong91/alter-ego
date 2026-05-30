import type { Archetype } from '../../data/demo'

import { archetypeProfiles } from '../../data/demo'

export function ProfileCard(props: {
  archetype: Archetype
  country: string
  era: string
  seed: string
}) {
  const { archetype, country, era, seed } = props
  const profile = archetypeProfiles[archetype]

  return (
    <div className="overflow-hidden rounded-[26px] border border-white/16 bg-white/10 shadow-bloom backdrop-blur-2xl">
      <div className="relative px-6 py-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(215,200,241,0.22),rgba(215,200,241,0)_55%),radial-gradient(circle_at_80%_30%,rgba(255,214,191,0.18),rgba(255,214,191,0)_62%)]" />
        <div className="relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
                Resulting archetype
              </div>
              <div className="mt-2 font-display text-[30px] leading-[1.05] tracking-[-0.03em] text-ink-1">
                {archetype}
              </div>
              <div className="mt-2 text-[15px] leading-[1.7] text-ink-2">
                {profile.subtitle}
              </div>
            </div>
            <div className="rounded-2xl border border-white/14 bg-white/10 px-4 py-3 text-[13px] leading-[1.6] text-ink-2 backdrop-blur-xl">
              <div>
                {country} · {era}
              </div>
              <div className="mt-1 font-mono text-[12px] text-ink-3">
                seed {seed}
              </div>
            </div>
          </div>
          <div className="mt-5 text-[15px] leading-[1.85] text-ink-2">
            {profile.description}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {profile.tells.map((tell) => (
              <div
                key={tell}
                className="rounded-2xl border border-white/14 bg-white/8 px-4 py-3 text-[13px] leading-[1.65] text-ink-2"
              >
                {tell}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

