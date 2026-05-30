import { useCallback, useEffect, useMemo, useState } from 'react'

import { getPollinationsUserKey } from '../lib/pollinations'
import { characters, locations } from '../data/showcase'
import { sumTraits, TRAITS_ZERO, type Persona, type RunPlan, type StageOption } from './spec'
import {
  clearPersona,
  clearRunState,
  loadPersona,
  loadRunPlan,
  loadRunState,
  newRunId,
  savePersona,
  saveRunPlan,
  saveRunState,
  type RunState,
} from './persist'
import { generateFinalReveal, generateRunPlan } from './generation'

export type Beat = {
  visible: boolean
  title: string
  text: string
}

function locationForCountry(country: string) {
  const match = locations.find((l) => l.label.toLowerCase() === country.toLowerCase())
  return match ?? locations[0]
}

function createRunStateFromPlan(runId: string, plan: RunPlan): RunState {
  const stageImagePrompts: RunState['stageImagePrompts'] = {}
  for (const s of plan.stages) {
    if (s.stage === 1 || s.stage === 3 || s.stage === 5) stageImagePrompts[s.stage] = s.imagePrompt
  }

  return {
    version: 1,
    runId,
    stageIndex: 0,
    traits: plan.traits ?? TRAITS_ZERO,
    tags: [...(plan.tags ?? [])],
    memoryTokens: [...(plan.memoryTokens ?? [])],
    choices: [],
    stageImagePrompts,
    finalPosterPrompt: plan.finalPosterPrompt,
  }
}

export function useAlterEgoSession() {
  const [apiKey, setApiKey] = useState(() => getPollinationsUserKey())
  const [persona, setPersonaState] = useState<Persona | null>(() => loadPersona())
  const [runState, setRunStateState] = useState<RunState | null>(() => loadRunState())
  const [plan, setPlan] = useState<RunPlan | null>(() =>
    runState ? loadRunPlan(runState.runId) : null,
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [beat, setBeat] = useState<Beat>({ visible: false, title: '', text: '' })

  useEffect(() => {
    setApiKey(getPollinationsUserKey())
  }, [])

  useEffect(() => {
    if (runState) saveRunState(runState)
  }, [runState])

  useEffect(() => {
    if (persona) savePersona(persona)
  }, [persona])

  useEffect(() => {
    if (!runState) return
    const loaded = loadRunPlan(runState.runId)
    if (loaded) setPlan(loaded)
  }, [runState?.runId])

  const location = useMemo(() => {
    return persona ? locationForCountry(persona.country) : locations[0]
  }, [persona])

  const currentStage = useMemo(() => {
    if (!plan || !runState) return null
    if (runState.stageIndex < 1 || runState.stageIndex > 5) return null
    return plan.stages.find((s) => s.stage === runState.stageIndex) ?? null
  }, [plan, runState])

  const isComplete = Boolean(runState?.stageIndex === 6 && plan)

  const ensurePlan = useCallback(
    async (mode: 'new-life' | 'restart-run' | 'keep') => {
      if (!apiKey) {
        setError('Connect AI to begin.')
        return
      }

      setIsGenerating(true)
      setError(null)
      try {
        const existingPersona = mode === 'keep' ? persona : null
        const generated = await generateRunPlan({ apiKey, persona: existingPersona ?? undefined })

        const stablePersona = existingPersona ?? generated.persona
        setPersonaState(stablePersona)

        const runId = newRunId()
        const nextPlan: RunPlan = { ...generated, persona: stablePersona }
        saveRunPlan(runId, nextPlan)
        setPlan(nextPlan)

        const nextState = createRunStateFromPlan(runId, nextPlan)
        setRunStateState(nextState)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to generate.')
      } finally {
        setIsGenerating(false)
      }
    },
    [apiKey, persona],
  )

  const start = useCallback(async () => {
    if (persona && runState && plan) {
      setRunStateState((prev) => (prev ? { ...prev, stageIndex: 1 } : prev))
      return
    }

    if (persona && !runState) {
      await ensurePlan('keep')
      setRunStateState((prev) => (prev ? { ...prev, stageIndex: 1 } : prev))
      return
    }

    await ensurePlan('new-life')
    setRunStateState((prev) => (prev ? { ...prev, stageIndex: 1 } : prev))
  }, [ensurePlan, persona, plan, runState])

  const restartRun = useCallback(async () => {
    await ensurePlan('keep')
  }, [ensurePlan])

  const newLife = useCallback(async () => {
    clearPersona()
    clearRunState()
    setPersonaState(null)
    setRunStateState(null)
    setPlan(null)
    await ensurePlan('new-life')
  }, [ensurePlan])

  const regeneratePersona = useCallback(async () => {
    await newLife()
  }, [newLife])

  const choose = useCallback(
    async (option: StageOption) => {
      if (!runState || !currentStage || !plan || !persona) return

      const nextTraits = sumTraits(runState.traits, option.traitDelta)
      const nextTags = runState.tags.includes(option.tag) ? runState.tags : [...runState.tags, option.tag]
      const tokens = [...runState.memoryTokens]
      const idx = tokens.findIndex((t) => t.toLowerCase() === option.memoryToken.toLowerCase())
      if (idx === -1) {
        tokens.push(option.memoryToken)
      } else {
        const [existing] = tokens.splice(idx, 1)
        tokens.push(existing)
      }

      const nextStageIndex = (runState.stageIndex + 1) as RunState['stageIndex']

      setBeat({ visible: true, title: currentStage.title, text: option.consequence })
      window.setTimeout(() => setBeat((b) => ({ ...b, visible: false })), 850)

      const nextState: RunState = {
        ...runState,
        stageIndex: nextStageIndex > 6 ? 6 : nextStageIndex,
        traits: nextTraits,
        tags: nextTags,
        memoryTokens: tokens.slice(-8),
        choices: [
          ...runState.choices,
          {
            stage: currentStage.stage,
            optionId: option.id,
            label: option.label,
            consequence: option.consequence,
            tag: option.tag,
            memoryToken: option.memoryToken,
            traitDelta: option.traitDelta,
            chosenAt: Date.now(),
          },
        ],
      }
      setRunStateState(nextState)

      if (currentStage.stage === 5 && apiKey) {
        setIsFinalizing(true)
        try {
          const result = await generateFinalReveal({
            apiKey,
            persona,
            traits: nextState.traits,
            tags: nextState.tags as never,
            memoryTokens: nextState.memoryTokens,
            choices: nextState.choices.map((c) => ({
              stage: c.stage,
              label: c.label,
              consequence: c.consequence,
            })),
          })
          setRunStateState((prev) => {
            if (!prev || prev.runId !== nextState.runId) return prev
            return {
              ...prev,
              finalRevealOverride: result.finalReveal,
              finalPosterPrompt: result.finalPosterPrompt,
            }
          })
        } catch {
          return
        } finally {
          setIsFinalizing(false)
        }
      }
    },
    [apiKey, currentStage, persona, plan, runState],
  )

  const revealedArchetype = useMemo(() => {
    const label = runState?.finalRevealOverride?.topTraits?.[0] ?? plan?.finalReveal?.topTraits?.[0]
    const match = characters.find((c) => c.label.toLowerCase() === (label ?? '').toLowerCase())
    return match ?? null
  }, [plan?.finalReveal?.topTraits, runState?.finalRevealOverride?.topTraits])

  return {
    apiKey,
    setApiKey,
    persona,
    runState,
    plan,
    location,
    currentStage,
    isGenerating,
    isFinalizing,
    error,
    beat,
    isComplete,
    revealedArchetype,
    start,
    choose,
    restartRun,
    regeneratePersona,
    newLife,
    ensurePlan,
  }
}
