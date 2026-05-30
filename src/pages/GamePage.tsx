import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { BeatOverlay } from '../components/game/BeatOverlay'
import { SmartImage } from '../components/game/SmartImage'
import { SwipeCard } from '../components/game/SwipeCard'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { cn } from '../lib/cn'
import {
  beginPollinationsAuthState,
  buildPollinationsAuthorizeUrl,
  buildPollinationsImageUrl,
  consumePollinationsRedirect,
  getPollinationsUserKey,
} from '../lib/pollinations'
import { characters } from '../data/showcase'
import { alterEgoAvatarPrompt, personaAvatarPrompt } from '../game/imagePrompts'
import { useAlterEgoSession } from '../game/useAlterEgoSession'

function traitChip(label: string, value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '' : ''
  return `${label} ${sign}${value}`
}

export function GamePage() {
  const [apiKey, setApiKey] = useState(() => getPollinationsUserKey())
  const [copied, setCopied] = useState(false)
  const session = useAlterEgoSession()

  useEffect(() => {
    const result = consumePollinationsRedirect()
    if (result.apiKey) {
      setApiKey(result.apiKey)
      session.setApiKey(result.apiKey)
    }
  }, [session])

  const connect = () => {
    const stateParam = beginPollinationsAuthState()
    const clientId = import.meta.env.VITE_POLLINATIONS_CLIENT_ID as string | undefined
    const url = buildPollinationsAuthorizeUrl({
      redirectUri: `${window.location.origin}/game`,
      clientId,
      state: stateParam,
    })
    window.location.href = url
  }

  const stageImageUrl = useMemo(() => {
    if (!apiKey) return null
    if (!session.runState) return null
    const stage = session.runState.stageIndex
    if (stage < 1 || stage > 5) return null
    const prompt = session.runState.stageImagePrompts[stage as 1 | 2 | 3 | 4 | 5]
    if (!prompt) return null
    return buildPollinationsImageUrl({ prompt, apiKey, model: 'flux' })
  }, [apiKey, session.runState])

  const personaAvatarUrl = useMemo(() => {
    if (!apiKey) return null
    if (!session.persona) return null
    return buildPollinationsImageUrl({
      prompt: personaAvatarPrompt(session.persona),
      apiKey,
      model: 'flux',
    })
  }, [apiKey, session.persona])

  const posterImageUrl = useMemo(() => {
    if (!apiKey) return null
    if (!session.runState?.finalPosterPrompt) return null
    if (!session.isComplete) return null
    return buildPollinationsImageUrl({ prompt: session.runState.finalPosterPrompt, apiKey, model: 'flux' })
  }, [apiKey, session.isComplete, session.runState?.finalPosterPrompt])

  const backgroundUrl = session.isComplete
    ? posterImageUrl ?? stageImageUrl ?? session.location.imageUrl
    : stageImageUrl ?? session.location.imageUrl

  const personaSummary = session.persona
    ? `${session.persona.gender}, ${session.persona.age} · ${session.persona.country}`
    : null

  const revealCharacter = useMemo(() => {
    if (session.revealedArchetype) return session.revealedArchetype
    const t =
      session.runState?.finalRevealOverride?.topTraits?.[0] ??
      session.plan?.finalReveal?.topTraits?.[0]
    if (!t) return null
    return characters.find((c) => c.label.toLowerCase() === t.toLowerCase()) ?? null
  }, [
    session.plan?.finalReveal?.topTraits,
    session.revealedArchetype,
    session.runState?.finalRevealOverride?.topTraits,
  ])

  const finalReveal = session.runState?.finalRevealOverride ?? session.plan?.finalReveal ?? null
  const alterEgoAvatarUrl = useMemo(() => {
    if (!apiKey) return null
    if (!session.persona) return null
    if (!finalReveal) return null
    const archetype = finalReveal.topTraits?.[0]
    if (!archetype) return null
    return buildPollinationsImageUrl({
      prompt: alterEgoAvatarPrompt({
        archetype,
        persona: session.persona,
        locationLabel: session.location.label,
        locationMood: session.location.mood,
        memoryToken: session.runState?.memoryTokens?.[session.runState.memoryTokens.length - 1],
      }),
      apiKey,
      model: 'flux',
    })
  }, [apiKey, finalReveal, session.location.label, session.location.mood, session.persona, session.runState?.memoryTokens])

  const onCopy = async () => {
    if (!finalReveal || !session.persona) return
    const lines = [
      `Alter Ego — ${personaSummary ?? ''}`.trim(),
      '',
      finalReveal.headline,
      finalReveal.summary,
      '',
      `Top traits: ${finalReveal.topTraits.join(', ')}`,
      `New interests: ${finalReveal.newInterests.join(', ')}`,
      `Life artifact: ${finalReveal.lifeArtifact.name} — ${finalReveal.lifeArtifact.description}`,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(lines)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      return
    }
  }

  const stage = session.currentStage

  return (
    <main>
      <BeatOverlay open={session.beat.visible} title={session.beat.title} text={session.beat.text} />

      <Section className="py-10 lg:py-14">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {backgroundUrl ? (
            <img
              src={backgroundUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-[0.44]"
              loading="lazy"
            />
          ) : null}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(215,200,241,0.22),rgba(215,200,241,0)_55%),radial-gradient(circle_at_78%_26%,rgba(255,214,191,0.18),rgba(255,214,191,0)_60%),linear-gradient(to_bottom,rgba(251,248,242,0.9),rgba(251,248,242,0.56),rgba(251,248,242,0.94))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,16,28,0.16),rgba(20,16,28,0)_55%)]" />
        </div>

        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">Game</div>
              <div className="mt-1 text-[14px] leading-[1.6] text-ink-2">
                {personaSummary ? `${personaSummary} · ` : ''}
                {session.runState ? `Stage ${Math.min(session.runState.stageIndex, 6)} of 6` : 'Ready'}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!apiKey ? <Button onClick={connect}>Connect AI</Button> : null}
              {apiKey && !session.isGenerating ? (
                <Button variant="ghost" onClick={session.regeneratePersona}>
                  Regenerate persona
                </Button>
              ) : null}
              {apiKey && !session.isGenerating ? (
                <Button variant="secondary" onClick={session.restartRun}>
                  Restart run
                </Button>
              ) : null}
              {apiKey && !session.isGenerating ? (
                <Button variant="secondary" onClick={session.newLife}>
                  New life
                </Button>
              ) : null}
            </div>
          </div>

          <div className="mt-10 grid place-items-center">
            <div className="w-full max-w-[900px]">
              {session.error ? (
                <div className="rounded-[28px] border border-white/16 bg-white/10 p-6 shadow-bloom backdrop-blur-2xl">
                  <div className="text-[14px] leading-[1.8] text-ink-2">{session.error}</div>
                </div>
              ) : null}

              {!session.persona || !session.plan || !session.runState ? (
                <div className="rounded-[32px] border border-white/16 bg-white/10 p-8 shadow-bloom backdrop-blur-2xl">
                  <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
                    Stage 0
                  </div>
                  <div className="mt-3 font-display text-[44px] leading-[1.03] tracking-[-0.03em] text-ink-1">
                    Persona
                  </div>
                  <div className="mt-4 text-[16px] leading-[1.9] text-ink-2">
                    Generate a stable persona and a 5-stage journey plan. This stays the same until you regenerate it.
                  </div>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {!apiKey ? (
                      <Button size="lg" onClick={connect}>
                        Connect AI
                      </Button>
                    ) : (
                      <Button size="lg" onClick={session.start} disabled={session.isGenerating}>
                        {session.isGenerating ? 'Generating…' : 'Generate my persona'}
                      </Button>
                    )}
                    <Link to={{ pathname: '/', hash: '#top' }} className="inline-flex">
                      <Button size="lg" variant="ghost">
                        Back to landing
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : session.runState.stageIndex === 0 ? (
                <div className="rounded-[32px] border border-white/16 bg-white/10 p-8 shadow-bloom backdrop-blur-2xl">
                  <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
                    Stage 0
                  </div>
                  <div className="mt-3 font-display text-[44px] leading-[1.03] tracking-[-0.03em] text-ink-1">
                    You, today
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[26px] border border-white/14 bg-white/8 p-6 backdrop-blur-2xl">
                      <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">Persona</div>
                      <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_120px] sm:items-start">
                        <div>
                          <div className="font-display text-[28px] leading-[1.08] text-ink-1">
                            {personaSummary}
                          </div>
                          <div className="mt-3 text-[15px] leading-[1.8] text-ink-2">
                            {session.plan.runVibe}
                          </div>
                        </div>
                        <div className="overflow-hidden rounded-[22px] border border-white/14 bg-white/8 shadow-glass">
                          <div className="relative aspect-[3/4]">
                            <SmartImage
                              src={personaAvatarUrl}
                              fallbackSrc={session.location.imageUrl}
                              alt="Persona avatar"
                              className="absolute inset-0"
                              imgClassName="object-[50%_22%]"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-1/32 via-ink-1/0 to-transparent" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[26px] border border-white/14 bg-white/8 p-6 backdrop-blur-2xl">
                      <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">Stage</div>
                      <div className="mt-2 font-display text-[28px] leading-[1.08] text-ink-1">
                        {session.location.label}
                      </div>
                      <div className="mt-3 text-[15px] leading-[1.8] text-ink-2">
                        {session.location.mood}
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
                    <div className="text-[13px] leading-[1.6] text-ink-2">
                      Five decisions. One reveal.
                    </div>
                    <Button size="lg" onClick={session.start} disabled={session.isGenerating}>
                      Begin
                    </Button>
                  </div>
                </div>
              ) : session.isComplete ? (
                <div className="grid gap-6">
                  <div className="rounded-[32px] border border-white/16 bg-white/10 p-8 shadow-bloom backdrop-blur-2xl">
                    <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
                      Final reveal
                    </div>
                    <div className="mt-3 font-display text-[48px] leading-[1.02] tracking-[-0.03em] text-ink-1">
                      {finalReveal?.headline ?? 'Final reveal'}
                    </div>
                    <div className="mt-4 text-[16px] leading-[1.9] text-ink-2">
                      {finalReveal?.summary ?? ''}
                    </div>

                    {session.isFinalizing ? (
                      <div className="mt-5 rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-[14px] leading-[1.7] text-ink-2">
                        Finalizing your reveal…
                      </div>
                    ) : null}

                    <div className="mt-6 grid gap-5 sm:grid-cols-[128px_1fr] sm:items-start">
                      {revealCharacter ? (
                        <div className="overflow-hidden rounded-[22px] border border-white/14 bg-white/8 shadow-glass">
                          <div className="relative aspect-[3/4]">
                            <SmartImage
                              src={alterEgoAvatarUrl}
                              fallbackSrc={revealCharacter.imageUrl}
                              alt={revealCharacter.label}
                              className="absolute inset-0"
                              imgClassName="object-[50%_22%]"
                              overlayClassName="bg-gradient-to-t from-ink-1/62 via-ink-1/18 to-transparent"
                            />
                          </div>
                        </div>
                      ) : null}
                      <div className="rounded-[26px] border border-white/14 bg-white/8 p-6 backdrop-blur-2xl">
                        <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
                          What changed in you
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {(finalReveal?.topTraits ?? []).slice(0, 2).map((t) => (
                            <div
                              key={t}
                              className="rounded-2xl border border-white/14 bg-white/8 px-4 py-3 text-[13px] leading-[1.65] text-ink-2"
                            >
                              {t}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-[14px] leading-[1.8] text-ink-2">
                          New interests: {(finalReveal?.newInterests ?? []).join(', ')}
                        </div>
                        <div className="mt-4 rounded-2xl border border-white/12 bg-white/6 px-4 py-4 text-[14px] leading-[1.8] text-ink-2">
                          <div className="font-display text-[18px] leading-[1.2] text-ink-1">
                            {finalReveal?.lifeArtifact?.name ?? ''}
                          </div>
                          <div className="mt-2">{finalReveal?.lifeArtifact?.description ?? ''}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Button size="lg" onClick={onCopy}>
                        {copied ? 'Copied' : 'Copy summary'}
                      </Button>
                      <Button size="lg" variant="secondary" onClick={session.restartRun}>
                        Restart run
                      </Button>
                      <Link to={{ pathname: '/', hash: '#top' }} className="inline-flex">
                        <Button size="lg" variant="ghost">
                          Back to landing
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[32px] border border-white/16 bg-white/10 shadow-bloom backdrop-blur-2xl">
                    <div className="relative aspect-[16/9] w-full">
                      <SmartImage
                        src={posterImageUrl}
                        alt="Final poster"
                        className="absolute inset-0"
                        overlayClassName="bg-[linear-gradient(to_top,rgba(20,16,28,0.32),rgba(20,16,28,0)_55%)]"
                      />
                      {session.isFinalizing ? (
                        <div className="pointer-events-none absolute inset-0 grid place-items-center">
                          <div className="rounded-full border border-white/14 bg-white/10 px-5 py-2 text-[12px] uppercase tracking-[0.22em] text-ink-2 backdrop-blur-xl">
                            Generating poster…
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : stage ? (
                <div className="grid gap-5">
                  <div className="rounded-[24px] border border-white/14 bg-white/8 px-5 py-4 text-[13px] leading-[1.6] text-ink-2 backdrop-blur-2xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-ink-1">Stage {stage.stage}</span> · {stage.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1">
                          {traitChip('Curiosity', session.runState.traits.Curiosity)}
                        </div>
                        <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1">
                          {traitChip('Risk', session.runState.traits.Risk)}
                        </div>
                        <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1">
                          {traitChip('Social', session.runState.traits.Social)}
                        </div>
                        <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1">
                          {traitChip('Discipline', session.runState.traits.Discipline)}
                        </div>
                        <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1">
                          {traitChip('Empathy', session.runState.traits.Empathy)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {stage.options.length === 2 ? (
                    <>
                      <SwipeCard
                        title={stage.question}
                        text={stage.sceneText}
                        leftLabel={stage.options[0].label}
                        rightLabel={stage.options[1].label}
                        onSwipeLeft={() => session.choose(stage.options[0])}
                        onSwipeRight={() => session.choose(stage.options[1])}
                        disabled={session.beat.visible}
                      />
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {stage.options.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            disabled={session.beat.visible}
                            onClick={() => session.choose(o)}
                            className={cn(
                              'rounded-2xl border border-white/12 bg-white/8 px-5 py-4 text-left text-[15px] leading-[1.65] text-ink-1 transition backdrop-blur-xl',
                              'hover:bg-white/12 hover:border-white/18',
                              'outline-none focus-visible:ring-2 focus-visible:ring-lilac-2/70 focus-visible:ring-offset-2 focus-visible:ring-offset-fog-1',
                              'disabled:opacity-60 disabled:pointer-events-none',
                              'active:translate-y-[0.5px]',
                            )}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-[32px] border border-white/16 bg-white/10 p-8 shadow-bloom backdrop-blur-2xl">
                      <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">
                        Decision
                      </div>
                      <div className="mt-3 font-display text-[36px] leading-[1.05] tracking-[-0.03em] text-ink-1">
                        {stage.question}
                      </div>
                      <div className="mt-4 whitespace-pre-line text-[16px] leading-[1.95] text-ink-2">
                        {stage.sceneText}
                      </div>
                      <div className="mt-7 grid gap-3">
                        {stage.options.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            disabled={session.beat.visible}
                            onClick={() => session.choose(o)}
                            className={cn(
                              'rounded-2xl border border-white/12 bg-white/8 px-5 py-4 text-left text-[15px] leading-[1.65] text-ink-1 transition backdrop-blur-xl',
                              'hover:bg-white/12 hover:border-white/18',
                              'outline-none focus-visible:ring-2 focus-visible:ring-lilac-2/70 focus-visible:ring-offset-2 focus-visible:ring-offset-fog-1',
                              'disabled:opacity-60 disabled:pointer-events-none',
                              'active:translate-y-[0.5px]',
                            )}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-[28px] border border-white/16 bg-white/10 p-6 shadow-bloom backdrop-blur-2xl">
                  <div className="text-[14px] leading-[1.8] text-ink-2">
                    Preparing…
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
