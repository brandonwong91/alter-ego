import { useMemo } from 'react'

import { Reveal } from '../components/motion/Reveal'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { isDirectVideoUrl, normalizeVideoUrl } from '../lib/video'

const DEFAULT_TRAILER_URL = '/alter-ego-480p.mp4'

export function TrailerSection() {
  const url = useMemo(() => normalizeVideoUrl(DEFAULT_TRAILER_URL), [])
  const isValid = useMemo(() => isDirectVideoUrl(url), [url])

  return (
    <Section id="trailer">
      <Container>
        <Reveal>
          <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
            Trailer
          </div>
          <h2 className="mt-3 font-display text-[40px] leading-[1.05] tracking-[-0.03em] text-ink-1">
            A glimpse of the life you didn’t choose.
          </h2>
        </Reveal>

        <Reveal delayMs={220} className="mt-10">
          <div className="overflow-hidden rounded-[28px] border border-white/18 bg-white/6 shadow-bloom backdrop-blur-2xl">
            <div className="relative aspect-video w-full">
              {isValid ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={url}
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(215,200,241,0.32),rgba(215,200,241,0)_60%),radial-gradient(circle_at_75%_30%,rgba(255,214,191,0.26),rgba(255,214,191,0)_65%),linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(20,16,28,0.28))]">
                  <div className="mx-auto max-w-[560px] px-6 text-center">
                    <div className="font-display text-[30px] leading-[1.05] tracking-[-0.02em] text-white">
                      Trailer unavailable
                    </div>
                    <div className="mt-3 text-[15px] leading-[1.75] text-white/80">
                      Ensure <span className="font-mono">{DEFAULT_TRAILER_URL}</span>{' '}
                      exists in <span className="font-mono">public/</span> and
                      is an MP4/WebM file.
                    </div>
                  </div>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),rgba(255,255,255,0)_45%)]" />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
