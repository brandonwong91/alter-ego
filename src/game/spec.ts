import type { AllowedTag } from './tagAllowlist'

export type Traits = {
  Curiosity: number
  Risk: number
  Social: number
  Discipline: number
  Empathy: number
}

export type Persona = {
  gender: string
  country: string
  age: number
}

export type StageOption = {
  id: 'A' | 'B' | 'C'
  label: string
  consequence: string
  traitDelta: Traits
  tag: AllowedTag
  memoryToken: string
}

export type StagePlan = {
  stage: 1 | 2 | 3 | 4 | 5
  title: 'Spark' | 'Pressure' | 'Identity' | 'Pivot' | 'Reveal'
  sceneText: string
  question: string
  options: StageOption[]
  imagePrompt: string
}

export type FinalReveal = {
  headline: string
  summary: string
  topTraits: string[]
  newInterests: string[]
  lifeArtifact: { name: string; description: string }
}

export type RunPlan = {
  persona: Persona
  runVibe: string
  traits: Traits
  tags: AllowedTag[]
  memoryTokens: string[]
  stages: StagePlan[]
  finalReveal: FinalReveal
  finalPosterPrompt: string
}

export type TraitKey = keyof Traits

export const TRAIT_KEYS: TraitKey[] = [
  'Curiosity',
  'Risk',
  'Social',
  'Discipline',
  'Empathy',
]

export const STAGE_TITLES: Record<StagePlan['stage'], StagePlan['title']> = {
  1: 'Spark',
  2: 'Pressure',
  3: 'Identity',
  4: 'Pivot',
  5: 'Reveal',
}

export const TRAITS_ZERO: Traits = {
  Curiosity: 0,
  Risk: 0,
  Social: 0,
  Discipline: 0,
  Empathy: 0,
}

export function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  return Math.min(max, Math.max(min, value))
}

export function normalizeTraits(value: unknown, fallback: Traits) {
  const v = (value && typeof value === 'object' ? (value as Partial<Traits>) : null) ?? null
  return {
    Curiosity: clampNumber(v?.Curiosity, -10, 10, fallback.Curiosity),
    Risk: clampNumber(v?.Risk, -10, 10, fallback.Risk),
    Social: clampNumber(v?.Social, -10, 10, fallback.Social),
    Discipline: clampNumber(v?.Discipline, -10, 10, fallback.Discipline),
    Empathy: clampNumber(v?.Empathy, -10, 10, fallback.Empathy),
  } satisfies Traits
}

export function sumTraits(a: Traits, b: Traits) {
  return {
    Curiosity: a.Curiosity + b.Curiosity,
    Risk: a.Risk + b.Risk,
    Social: a.Social + b.Social,
    Discipline: a.Discipline + b.Discipline,
    Empathy: a.Empathy + b.Empathy,
  } satisfies Traits
}

