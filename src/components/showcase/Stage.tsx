import type { ShowcaseCharacter, ShowcaseLocation } from '../../data/showcase'

import { cn } from '../../lib/cn'
import { CrossfadeImage } from './CrossfadeImage'

function Toggle(props: {
  value: 'locations' | 'characters'
  onChange: (value: 'locations' | 'characters') => void
}) {
  const { value, onChange } = props
  return (
    <div className="relative flex items-center rounded-full border border-white/16 bg-white/8 p-1 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => onChange('locations')}
        className={cn(
          'relative z-10 h-9 rounded-full px-4 text-[12px] uppercase tracking-[0.22em] transition',
          value === 'locations' ? 'text-ink-1' : 'text-white/70 hover:text-white',
        )}
      >
        Locations
      </button>
      <button
        type="button"
        onClick={() => onChange('characters')}
        className={cn(
          'relative z-10 h-9 rounded-full px-4 text-[12px] uppercase tracking-[0.22em] transition',
          value === 'characters' ? 'text-ink-1' : 'text-white/70 hover:text-white',
        )}
      >
        Characters
      </button>
      <div
        className={cn(
          'absolute top-1 bottom-1 rounded-full border border-white/22 bg-fog-1/60 shadow-glass backdrop-blur-xl transition-all duration-300',
          value === 'locations' ? 'left-1 w-[124px]' : 'left-[129px] w-[134px]',
        )}
      />
    </div>
  )
}

function Arrows(props: { onPrev: () => void; onNext: () => void }) {
  const { onPrev, onNext } = props
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full border border-white/16 bg-white/10 text-[14px] text-white/85 backdrop-blur-xl transition hover:bg-white/14 active:bg-white/18"
        onClick={onPrev}
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full border border-white/16 bg-white/10 text-[14px] text-white/85 backdrop-blur-xl transition hover:bg-white/14 active:bg-white/18"
        onClick={onNext}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  )
}

export function Stage(props: {
  location: ShowcaseLocation
  character: ShowcaseCharacter
  onPrevLocation: () => void
  onNextLocation: () => void
  onPrevCharacter: () => void
  onNextCharacter: () => void
  viewMode: 'locations' | 'characters'
  onChangeViewMode: (value: 'locations' | 'characters') => void
  onFilterUSA: () => void
}) {
  const {
    location,
    character,
    onPrevLocation,
    onNextLocation,
    onPrevCharacter,
    onNextCharacter,
    viewMode,
    onChangeViewMode,
    onFilterUSA,
  } = props

  const onPrev = viewMode === 'locations' ? onPrevLocation : onPrevCharacter
  const onNext = viewMode === 'locations' ? onNextLocation : onNextCharacter

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/18 bg-white/8 shadow-bloom">
      <div className="relative aspect-[16/10] w-full lg:aspect-[16/8]">
        <CrossfadeImage
          src={location.imageUrl}
          alt={`${location.label} location`}
          className="absolute inset-0"
          imgClassName="scale-[1.01]"
          durationMs={720}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-1/52 via-ink-1/18 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,214,191,0.20),rgba(255,214,191,0)_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(215,200,241,0.22),rgba(215,200,241,0)_58%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,16,28,0)_30%,rgba(20,16,28,0.26)_100%)]" />

        <div className="absolute left-5 top-5 right-5 z-10 flex items-start justify-between gap-4">
          <div className="max-w-[520px] rounded-3xl border border-white/14 bg-white/8 px-5 py-4 backdrop-blur-2xl">
            <div className="text-[12px] uppercase tracking-[0.22em] text-white/80">
              Showcase
            </div>
            <div className="mt-2 font-display text-[28px] leading-[1.05] text-white lg:text-[34px]">
              Choose the world. Choose who appears inside it.
            </div>
            <div className="mt-2 text-[14px] leading-[1.55] text-white/80">
              {location.mood}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-5 bottom-5 z-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative w-full max-w-[380px]">
            <div className="relative overflow-hidden rounded-[22px] border border-white/18 bg-white/10 shadow-glass backdrop-blur-2xl">
              <div className="flex">
                <div className="relative w-[138px] shrink-0">
                  <div className="relative aspect-[3/4]">
                    <CrossfadeImage
                      src={character.imageUrl}
                      alt={character.label}
                      className="absolute inset-0"
                      imgClassName="scale-[1.04] object-[50%_22%]"
                      durationMs={640}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-1/62 via-ink-1/18 to-transparent" />
                  </div>
                </div>

                <div className="min-w-0 flex-1 px-4 py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="min-w-0 font-display text-[20px] leading-none text-white">
                      {character.label}
                    </div>
                    <div className="shrink-0 text-[12px] uppercase tracking-[0.22em] text-white/70">
                      Character
                    </div>
                  </div>
                  <div className="mt-2 text-[14px] leading-[1.55] text-white/80">
                    {character.essence}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-3 self-start lg:self-auto">
            <button
              type="button"
              onClick={onFilterUSA}
              className="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[12px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-xl transition hover:bg-white/14 active:bg-white/18"
            >
              USA
            </button>

            <Toggle value={viewMode} onChange={onChangeViewMode} />

            <Arrows onPrev={onPrev} onNext={onNext} />
          </div>
        </div>
      </div>
    </div>
  )
}
