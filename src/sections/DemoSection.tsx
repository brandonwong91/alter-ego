import { useEffect, useMemo, useState } from 'react'

import { ChoiceRow } from '../components/demo/ChoiceRow'
import type { DemoRun } from '../components/demo/HistoryList'
import { HistoryList } from '../components/demo/HistoryList'
import { ProfileCard } from '../components/demo/ProfileCard'
import { Reveal } from '../components/motion/Reveal'
import { CrossfadeImage } from '../components/showcase/CrossfadeImage'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { SelectInput } from '../components/ui/SelectInput'
import { TextInput } from '../components/ui/TextInput'
import type { Archetype, Country, Era } from '../data/demo'
import { archetypes, choices, countries, eras } from '../data/demo'
import { locations } from '../data/showcase'
import { createSeededRng, randomSeed } from '../lib/seededRng'
import { getJson, setJson } from '../lib/storage'

const STORAGE_KEY = 'alterEgo.demoHistory'

function resolveArchetype(input: {
  seed: string
  country: Country
  era: Era
  choiceValues: Record<'c1' | 'c2' | 'c3', 'a' | 'b'>
}) {
  const { seed, country, era, choiceValues } = input
  const rng = createSeededRng(
    `${seed}|${country}|${era}|${choiceValues.c1}${choiceValues.c2}${choiceValues.c3}`,
  )

  const score: Record<Archetype, number> = {
    'The Builder': 0,
    'The Explorer': 0,
    'The Rebel': 0,
    'The Caregiver': 0,
  }

  if (choiceValues.c1 === 'a') {
    score['The Caregiver'] += 2
    score['The Explorer'] += 1
  } else {
    score['The Rebel'] += 2
    score['The Builder'] += 1
  }

  if (choiceValues.c2 === 'a') {
    score['The Explorer'] += 2
    score['The Rebel'] += 1
  } else {
    score['The Caregiver'] += 1
    score['The Builder'] += 1
  }

  if (choiceValues.c3 === 'a') {
    score['The Caregiver'] += 2
    score['The Rebel'] += 1
  } else {
    score['The Builder'] += 2
    score['The Explorer'] += 1
  }

  const countryDrift = Math.floor(rng() * archetypes.length)
  score[archetypes[countryDrift]] += 1

  const max = Math.max(...Object.values(score))
  const top = archetypes.filter((a) => score[a] === max)
  return top[Math.floor(rng() * top.length)]
}

function newRunId() {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`
}

export function DemoSection() {
  const [seed, setSeed] = useState(() => randomSeed())
  const [country, setCountry] = useState<Country>('USA')
  const [era, setEra] = useState<Era>('Near Future')
  const [choiceValues, setChoiceValues] = useState<
    Record<'c1' | 'c2' | 'c3', 'a' | 'b'>
  >({ c1: 'a', c2: 'a', c3: 'a' })

  const [runs, setRuns] = useState<DemoRun[]>(() =>
    getJson<DemoRun[]>(STORAGE_KEY, []),
  )
  const [activeRunId, setActiveRunId] = useState<string | undefined>(() => {
    const initial = getJson<DemoRun[]>(STORAGE_KEY, [])
    return initial[0]?.id
  })
  const [journeyStep, setJourneyStep] = useState<1 | 2 | 3>(() =>
    getJson<DemoRun[]>(STORAGE_KEY, []).length > 0 ? 3 : 1,
  )
  const [momentIndex, setMomentIndex] = useState(0)

  useEffect(() => {
    setJson(STORAGE_KEY, runs)
  }, [runs])

  const activeRun = useMemo(
    () => runs.find((r) => r.id === activeRunId),
    [activeRunId, runs],
  )

  const onReveal = () => {
    const archetype = resolveArchetype({ seed, country, era, choiceValues })
    const run: DemoRun = {
      id: newRunId(),
      createdAt: Date.now(),
      seed,
      country,
      era,
      choiceValues,
      archetype,
    }

    setRuns((prev) => [run, ...prev].slice(0, 16))
    setActiveRunId(run.id)
    setJourneyStep(3)
  }

  const selectRun = (run: DemoRun) => {
    setSeed(run.seed)
    setCountry(run.country)
    setEra(run.era)
    setChoiceValues(run.choiceValues)
    setActiveRunId(run.id)
    setJourneyStep(3)
  }

  const clearHistory = () => {
    setRuns([])
    setActiveRunId(undefined)
    setJourneyStep(1)
  }

  const shownArchetype = activeRun?.archetype
  const selectedLocation = useMemo(
    () => locations.find((l) => l.label === country) ?? locations[0],
    [country],
  )

  const currentChoice = choices[momentIndex]

  return (
    <Section id="demo">
      <Container>
        <Reveal>
          <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
            Playable teaser
          </div>
          <h2 className="mt-3 font-display text-[40px] leading-[1.05] tracking-[-0.03em] text-ink-1">
            Reveal a first version of your life path.
          </h2>
          <p className="mt-4 max-w-[72ch] text-[16px] leading-[1.8] text-ink-2">
            Move through a short sequence: set the scene, face three moments,
            then meet the archetype that answers back.
          </p>
        </Reveal>

        <Reveal delayMs={140} className="mt-10">
          <div className="relative overflow-hidden rounded-[30px] border border-white/16 bg-white/8 shadow-bloom backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0">
              <CrossfadeImage
                src={selectedLocation.imageUrl}
                alt={`${country} journey backdrop`}
                className="absolute inset-0"
                imgClassName="scale-[1.08] blur-[1px]"
                durationMs={720}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-1/70 via-ink-1/22 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(215,200,241,0.20),rgba(215,200,241,0)_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_28%,rgba(255,214,191,0.18),rgba(255,214,191,0)_60%)]" />
            </div>

            <div className="relative p-6 lg:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[12px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-xl">
                  Step {journeyStep} of 3
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={[
                        'h-2 w-10 rounded-full border transition',
                        s <= journeyStep
                          ? 'border-white/30 bg-white/55'
                          : 'border-white/14 bg-white/10',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 max-w-[760px]">
                {journeyStep === 1 ? (
                  <div className="rounded-[26px] border border-white/16 bg-white/10 p-6 backdrop-blur-2xl">
                    <div className="font-display text-[28px] leading-[1.1] text-white">
                      Set the scene.
                    </div>
                    <div className="mt-3 text-[15px] leading-[1.8] text-white/80">
                      Pick a place and an era. The atmosphere becomes your
                      backdrop.
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="text-[12px] uppercase tracking-[0.22em] text-white/70">
                          Country
                        </div>
                        <div className="relative mt-2">
                          <SelectInput
                            value={country}
                            onChange={(e) => setCountry(e.target.value as Country)}
                            className="text-white"
                          >
                            {countries.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </SelectInput>
                          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70">
                            ▾
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[12px] uppercase tracking-[0.22em] text-white/70">
                          Era
                        </div>
                        <div className="relative mt-2">
                          <SelectInput
                            value={era}
                            onChange={(e) => setEra(e.target.value as Era)}
                            className="text-white"
                          >
                            {eras.map((e) => (
                              <option key={e} value={e}>
                                {e}
                              </option>
                            ))}
                          </SelectInput>
                          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70">
                            ▾
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="text-[12px] uppercase tracking-[0.22em] text-white/70">
                        Seed
                      </div>
                      <div className="mt-2 flex gap-2">
                        <TextInput
                          value={seed}
                          onChange={(e) => setSeed(e.target.value)}
                          className="text-white placeholder:text-white/50"
                        />
                        <Button
                          variant="secondary"
                          className="shrink-0 text-white"
                          onClick={() => setSeed(randomSeed())}
                        >
                          New
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                      <div className="text-[13px] leading-[1.6] text-white/70">
                        Your choices become a small trail, not a verdict.
                      </div>
                      <Button
                        size="lg"
                        onClick={() => {
                          setMomentIndex(0)
                          setJourneyStep(2)
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                ) : null}

                {journeyStep === 2 ? (
                  <div className="rounded-[26px] border border-white/16 bg-white/10 p-6 backdrop-blur-2xl">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <div className="text-[12px] uppercase tracking-[0.22em] text-white/70">
                          Moment {momentIndex + 1} of 3
                        </div>
                        <div className="mt-2 font-display text-[28px] leading-[1.1] text-white">
                          Choose what you become next.
                        </div>
                      </div>
                      <div className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[12px] uppercase tracking-[0.22em] text-white/75 backdrop-blur-xl">
                        {country} · {era}
                      </div>
                    </div>

                    <div className="mt-6">
                      <ChoiceRow
                        index={momentIndex + 1}
                        prompt={currentChoice.prompt}
                        a={currentChoice.a}
                        b={currentChoice.b}
                        value={choiceValues[currentChoice.id]}
                        onChange={(v) =>
                          setChoiceValues((prev) => ({
                            ...prev,
                            [currentChoice.id]: v,
                          }))
                        }
                        tone="dark"
                      />
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="text-white"
                        onClick={() => {
                          if (momentIndex > 0) {
                            setMomentIndex((v) => v - 1)
                          } else {
                            setJourneyStep(1)
                          }
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => {
                          if (momentIndex < choices.length - 1) {
                            setMomentIndex((v) => v + 1)
                          } else {
                            onReveal()
                          }
                        }}
                      >
                        {momentIndex < choices.length - 1 ? 'Next' : 'Reveal'}
                      </Button>
                    </div>
                  </div>
                ) : null}

                {journeyStep === 3 ? (
                  <div className="grid gap-6">
                    {shownArchetype ? (
                      <ProfileCard
                        archetype={shownArchetype}
                        country={activeRun!.country}
                        era={activeRun!.era}
                        seed={activeRun!.seed}
                      />
                    ) : (
                      <div className="rounded-[26px] border border-white/16 bg-white/10 p-6 backdrop-blur-2xl">
                        <div className="font-display text-[28px] leading-[1.1] text-white">
                          No result yet.
                        </div>
                        <div className="mt-3 text-[15px] leading-[1.8] text-white/80">
                          Start a journey, answer three moments, and reveal your
                          archetype.
                        </div>
                        <div className="mt-6">
                          <Button size="lg" onClick={() => setJourneyStep(1)}>
                            Begin
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[13px] leading-[1.6] text-white/70">
                        History stays local to your browser.
                      </div>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="text-white"
                        onClick={() => {
                          setSeed(randomSeed())
                          setChoiceValues({ c1: 'a', c2: 'a', c3: 'a' })
                          setJourneyStep(1)
                        }}
                      >
                        Start new journey
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={240} className="mt-8">
          <HistoryList
            runs={runs}
            activeRunId={activeRunId}
            onSelect={selectRun}
            onClear={clearHistory}
          />
        </Reveal>
      </Container>
    </Section>
  )
}
