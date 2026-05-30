import { useMemo, useState } from 'react'

import { Reveal } from '../components/motion/Reveal'
import { Stage } from '../components/showcase/Stage'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { characters, locations } from '../data/showcase'

function wrapIndex(index: number, size: number) {
  return ((index % size) + size) % size
}

export function ShowcaseSection() {
  const [locationIndex, setLocationIndex] = useState(0)
  const [characterIndex, setCharacterIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'locations' | 'characters'>('locations')

  const location = useMemo(
    () => locations[wrapIndex(locationIndex, locations.length)],
    [locationIndex],
  )
  const character = useMemo(
    () => characters[wrapIndex(characterIndex, characters.length)],
    [characterIndex],
  )

  return (
    <Section id="showcase">
      <Container>
        <Reveal>
          <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
            Location + Character
          </div>
          <h2 className="mt-3 font-display text-[40px] leading-[1.05] tracking-[-0.03em] text-ink-1">
            A stage for alternate selves.
          </h2>
          <p className="mt-4 max-w-[70ch] text-[16px] leading-[1.8] text-ink-2">
            The world leads. The character follows. Rotate them separately and
            notice what changes in you.
          </p>
        </Reveal>

        <Reveal delayMs={160} className="mt-10">
          <Stage
            location={location}
            character={character}
            onPrevLocation={() => setLocationIndex((v) => v - 1)}
            onNextLocation={() => setLocationIndex((v) => v + 1)}
            onPrevCharacter={() => setCharacterIndex((v) => v - 1)}
            onNextCharacter={() => setCharacterIndex((v) => v + 1)}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            onFilterUSA={() => {
              setLocationIndex(0)
              setViewMode('locations')
            }}
          />
        </Reveal>
      </Container>
    </Section>
  )
}
