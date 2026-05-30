import { TAG_ALLOWLIST } from './tagAllowlist'
import {
  clampNumber,
  normalizeTraits,
  STAGE_TITLES,
  TRAITS_ZERO,
  type Persona,
  type RunPlan,
  type StageOption,
  type StagePlan,
  type Traits,
} from './spec'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

function parsePersona(value: unknown): Persona | null {
  if (!isRecord(value)) return null
  const age = clampNumber(value.age, 13, 99, 24)
  const gender = asString(value.gender).trim()
  const country = asString(value.country).trim()
  if (!gender || !country) return null
  return { gender, country, age }
}

function parseTraits(value: unknown, fallback: Traits) {
  return normalizeTraits(value, fallback)
}

function parseOption(value: unknown): StageOption | null {
  if (!isRecord(value)) return null
  const id = value.id === 'A' || value.id === 'B' || value.id === 'C' ? value.id : null
  if (!id) return null
  const label = asString(value.label).trim()
  const consequence = asString(value.consequence).trim()
  const tag = typeof value.tag === 'string' ? value.tag : ''
  const memoryToken = asString(value.memoryToken).trim()
  if (!label || !consequence || !memoryToken) return null
  if (!TAG_ALLOWLIST.includes(tag as never)) return null
  const traitDelta = parseTraits(value.traitDelta, TRAITS_ZERO)
  const deltaTotal =
    Math.abs(traitDelta.Curiosity) +
    Math.abs(traitDelta.Risk) +
    Math.abs(traitDelta.Social) +
    Math.abs(traitDelta.Discipline) +
    Math.abs(traitDelta.Empathy)
  if (deltaTotal === 0) return null
  return {
    id,
    label,
    consequence,
    traitDelta,
    tag: tag as never,
    memoryToken,
  }
}

function parseStage(value: unknown): StagePlan | null {
  if (!isRecord(value)) return null
  const stageNum =
    value.stage === 1 || value.stage === 2 || value.stage === 3 || value.stage === 4 || value.stage === 5
      ? value.stage
      : null
  if (!stageNum) return null
  const titleExpected = STAGE_TITLES[stageNum]
  const title = titleExpected
  const sceneText = asString(value.sceneText).trim()
  const question = asString(value.question).trim()
  const imagePrompt = asString(value.imagePrompt).trim()
  if (!sceneText || !question || !imagePrompt) return null

  const optionsRaw = Array.isArray(value.options) ? value.options : []
  const options = optionsRaw.map(parseOption).filter((v): v is StageOption => Boolean(v))
  if (options.length < 2 || options.length > 3) return null

  const ids = new Set(options.map((o) => o.id))
  if (ids.size !== options.length) return null

  return {
    stage: stageNum,
    title,
    sceneText,
    question,
    options,
    imagePrompt,
  }
}

export function safeJsonParse(input: string) {
  try {
    return JSON.parse(input) as unknown
  } catch {
    return null
  }
}

export function validateRunPlan(input: unknown): RunPlan | null {
  if (!isRecord(input)) return null

  const persona = parsePersona(input.persona)
  if (!persona) return null

  const runVibe = asString(input.runVibe).trim()
  const traits = parseTraits(input.traits, TRAITS_ZERO)

  const tagsRaw = asStringArray(input.tags)
  const tags = tagsRaw.filter((t) => TAG_ALLOWLIST.includes(t as never)) as RunPlan['tags']
  const memoryTokens = asStringArray(input.memoryTokens).map((t) => t.trim()).filter(Boolean)

  const stagesRaw = Array.isArray(input.stages) ? input.stages : []
  const stagesParsed = stagesRaw.map(parseStage).filter((s): s is StagePlan => Boolean(s))
  if (stagesParsed.length !== 5) return null
  const stages = stagesParsed.sort((a, b) => a.stage - b.stage)
  for (let i = 0; i < 5; i++) {
    if (stages[i]?.stage !== (i + 1)) return null
  }

  if (!isRecord(input.finalReveal)) return null
  const finalReveal = {
    headline: asString(input.finalReveal.headline).trim(),
    summary: asString(input.finalReveal.summary).trim(),
    topTraits: asStringArray(input.finalReveal.topTraits).slice(0, 2),
    newInterests: asStringArray(input.finalReveal.newInterests).slice(0, 3),
    lifeArtifact: {
      name: isRecord(input.finalReveal.lifeArtifact)
        ? asString(input.finalReveal.lifeArtifact.name).trim()
        : '',
      description: isRecord(input.finalReveal.lifeArtifact)
        ? asString(input.finalReveal.lifeArtifact.description).trim()
        : '',
    },
  }
  if (
    !finalReveal.headline ||
    !finalReveal.summary ||
    finalReveal.topTraits.length < 2 ||
    finalReveal.newInterests.length < 3 ||
    !finalReveal.lifeArtifact.name ||
    !finalReveal.lifeArtifact.description
  ) {
    return null
  }

  const finalPosterPrompt = asString(input.finalPosterPrompt).trim()
  if (!finalPosterPrompt) return null

  return {
    persona,
    runVibe,
    traits,
    tags,
    memoryTokens,
    stages,
    finalReveal,
    finalPosterPrompt,
  }
}

export function enforceMemoryTokenRules(plan: RunPlan) {
  const tokens = plan.memoryTokens.filter(Boolean)
  if (tokens.length === 0) tokens.push('warm key')

  const stages = plan.stages.map((s) => {
    const sceneText = s.stage >= 2 && !tokens.some((t) => s.sceneText.toLowerCase().includes(t.toLowerCase()))
      ? `${s.sceneText}\n\nYou remember ${tokens[0]}.`
      : s.sceneText

    return { ...s, sceneText }
  })

  return { ...plan, memoryTokens: tokens, stages }
}
