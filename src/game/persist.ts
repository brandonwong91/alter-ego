import { getJson, setJson } from '../lib/storage'
import type { FinalReveal, Persona, RunPlan, Traits } from './spec'

const PERSONA_KEY = 'alterEgo.persona.v1'
const RUN_STATE_KEY = 'alterEgo.runState.v1'

export type ChoiceLog = {
  stage: 1 | 2 | 3 | 4 | 5
  optionId: 'A' | 'B' | 'C'
  label: string
  consequence: string
  tag: string
  memoryToken: string
  traitDelta: Traits
  chosenAt: number
}

export type RunState = {
  version: 1
  runId: string
  stageIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6
  traits: Traits
  tags: string[]
  memoryTokens: string[]
  choices: ChoiceLog[]
  stageImagePrompts: Partial<Record<1 | 2 | 3 | 4 | 5, string>>
  finalPosterPrompt?: string
  finalRevealOverride?: FinalReveal
}

export function newRunId() {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`
}

export function loadPersona(): Persona | null {
  const raw = getJson<unknown>(PERSONA_KEY, null)
  if (!raw || typeof raw !== 'object') return null
  const v = raw as Partial<Persona>
  if (!v.gender || !v.country || typeof v.age !== 'number') return null
  return { gender: v.gender, country: v.country, age: v.age }
}

export function savePersona(persona: Persona) {
  setJson(PERSONA_KEY, persona)
}

export function clearPersona() {
  setJson(PERSONA_KEY, null)
}

export function loadRunState(): RunState | null {
  const raw = getJson<unknown>(RUN_STATE_KEY, null)
  if (!raw || typeof raw !== 'object') return null
  const v = raw as Partial<RunState>
  if (v.version !== 1) return null
  if (!v.runId || typeof v.runId !== 'string') return null
  if (typeof v.stageIndex !== 'number') return null
  if (!v.traits || typeof v.traits !== 'object') return null
  if (!Array.isArray(v.tags) || !Array.isArray(v.memoryTokens) || !Array.isArray(v.choices)) return null
  if (!v.stageImagePrompts || typeof v.stageImagePrompts !== 'object') return null
  return raw as RunState
}

export function saveRunState(state: RunState) {
  setJson(RUN_STATE_KEY, state)
}

export function clearRunState() {
  setJson(RUN_STATE_KEY, null)
}

export function runPlanKey(runId: string) {
  return `alterEgo.runPlan.${runId}`
}

export function loadRunPlan(runId: string): RunPlan | null {
  const raw = getJson<unknown>(runPlanKey(runId), null)
  if (!raw || typeof raw !== 'object') return null
  return raw as RunPlan
}

export function saveRunPlan(runId: string, plan: RunPlan) {
  setJson(runPlanKey(runId), plan)
}
