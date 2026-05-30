import type { PollinationsMessage } from '../lib/pollinations'
import { pollinationsChatCompletion } from '../lib/pollinations'
import { characters, locations } from '../data/showcase'
import { TAG_ALLOWLIST } from './tagAllowlist'
import { IMAGE_PROMPT_TAIL } from './imagePrompts'
import { STAGE_TITLES, TRAITS_ZERO, type Persona, type RunPlan } from './spec'
import { enforceMemoryTokenRules, safeJsonParse, validateRunPlan } from './validate'

function schemaSnippet() {
  return `{
  "persona": { "gender": "string", "country": "string", "age": 0 },
  "runVibe": "string",
  "traits": { "Curiosity": 0, "Risk": 0, "Social": 0, "Discipline": 0, "Empathy": 0 },
  "tags": ["string"],
  "memoryTokens": ["string"],
  "stages": [
    {
      "stage": 1,
      "title": "Spark",
      "sceneText": "string",
      "question": "string",
      "options": [
        {
          "id": "A",
          "label": "string",
          "consequence": "string",
          "traitDelta": { "Curiosity": 1, "Risk": 0, "Social": 0, "Discipline": 0, "Empathy": 0 },
          "tag": "string",
          "memoryToken": "string"
        }
      ],
      "imagePrompt": "string"
    }
  ],
  "finalReveal": {
    "headline": "string",
    "summary": "string",
    "topTraits": ["string", "string"],
    "newInterests": ["string", "string", "string"],
    "lifeArtifact": { "name": "string", "description": "string" }
  },
  "finalPosterPrompt": "string"
}`
}

function buildMessages(input: { persona?: Persona }): PollinationsMessage[] {
  const stageTitles = Object.entries(STAGE_TITLES)
    .map(([k, v]) => `Stage ${k}: ${v}`)
    .join('\n')

  const allowedCountries = locations.map((l) => l.label).join(', ')
  const allowedTags = TAG_ALLOWLIST.join(', ')
  const characterLabels = characters.map((c) => c.label).join(', ')

  const fixedPersona = input.persona
    ? `The persona must be exactly this (do not change values): ${JSON.stringify(input.persona)}`
    : `Choose a persona. Country must be one of: ${allowedCountries}. Age 18–45. Gender can be "woman", "man", or "non-binary".`

  const base = [
    {
      role: 'system' as const,
      content:
        'You are generating content for an interactive self-discovery story game. Output must be strict JSON only. No markdown, no commentary.',
    },
    {
      role: 'user' as const,
      content: [
        'Generate a full 2–3 minute session plan with exactly 5 stages + a final reveal.',
        'Voice: immersive second-person, cozy surreal, calm, introspective.',
        'Each stage should be readable in ~15–25 seconds and includes 2–3 options that require thought.',
        '',
        fixedPersona,
        '',
        `Stage themes are fixed:\n${stageTitles}`,
        '',
        `Characters must be reflected as a key feature: the end reveal should clearly align the player to one of these Alter Egos by name in finalReveal.topTraits[0]: ${characterLabels}`,
        '',
        `Uniqueness rules: keep continuity with memoryTokens. From Stage 2 onward, each stage.sceneText must reference at least one memoryToken (exact substring). Each stage should introduce or evolve one memoryToken (via options[].memoryToken).`,
        '',
        `Every option must update at least 1 trait (traitDelta must have at least one non-zero field) and must include exactly one tag from the allowlist.`,
        '',
        `Tags allowlist (use only these): ${allowedTags}`,
        '',
        'Safety: no profanity, hate, sexual content, or self-harm content.',
        '',
        'Image prompts: provide an imagePrompt for every stage and a finalPosterPrompt. Every image prompt must append the following tail exactly:',
        IMAGE_PROMPT_TAIL,
        '',
        'Image prompt constraints: no text, no logos, no watermark, no readable signs, no UI.',
        'Mention persona context subtly (country vibe, age mood) + include 1 memoryToken.',
        '',
        'Use this exact JSON schema:',
        schemaSnippet(),
        '',
        `Initialize traits to: ${JSON.stringify(TRAITS_ZERO)}`,
        'Initialize tags to 3–6 items from the allowlist.',
        'Initialize memoryTokens to 3–6 short motifs (2–5 words each).',
      ].join('\n'),
    },
  ]

  return base
}

export async function generateRunPlan(input: { apiKey: string; persona?: Persona }) {
  const text = await pollinationsChatCompletion({
    apiKey: input.apiKey,
    model: 'openai',
    messages: buildMessages({ persona: input.persona }),
  })

  const parsed = safeJsonParse(text)
  const validated = validateRunPlan(parsed)
  if (!validated) throw new Error('Generated plan failed validation')
  return enforceMemoryTokenRules(validated) satisfies RunPlan
}

export async function generateFinalReveal(input: {
  apiKey: string
  persona: Persona
  traits: RunPlan['traits']
  tags: RunPlan['tags']
  memoryTokens: RunPlan['memoryTokens']
  choices: Array<{ stage: number; label: string; consequence: string }>
}) {
  const allowedCountries = locations.map((l) => l.label).join(', ')
  const allowedTags = TAG_ALLOWLIST.join(', ')
  const characterLabels = characters.map((c) => c.label).join(', ')

  const stageTitles = Object.entries(STAGE_TITLES)
    .map(([k, v]) => `Stage ${k}: ${v}`)
    .join('\n')

  const messages: PollinationsMessage[] = [
    {
      role: 'system',
      content:
        'Output must be strict JSON only. No markdown, no commentary. Be safe: no profanity, hate, sexual content, or self-harm content.',
    },
    {
      role: 'user',
      content: [
        'Generate a final reveal for the completed run.',
        `Persona (fixed): ${JSON.stringify(input.persona)}`,
        `Country must remain one of: ${allowedCountries}`,
        '',
        `Final reveal must align to one of these Alter Egos by name in finalReveal.topTraits[0]: ${characterLabels}`,
        '',
        'Use continuity: reference at least 2 memoryTokens verbatim in finalReveal.summary.',
        '',
        `Stage themes:\n${stageTitles}`,
        '',
        `Final state:\ntraits=${JSON.stringify(input.traits)}\ntags=${JSON.stringify(input.tags)}\nmemoryTokens=${JSON.stringify(input.memoryTokens)}`,
        '',
        'Chosen options (ordered):',
        ...input.choices.map((c) => `Stage ${c.stage}: ${c.label} — ${c.consequence}`),
        '',
        `Tags allowlist (use only these): ${allowedTags}`,
        '',
        'Return this exact JSON shape:',
        `{
  "finalReveal": {
    "headline": "string",
    "summary": "string",
    "topTraits": ["string", "string"],
    "newInterests": ["string", "string", "string"],
    "lifeArtifact": { "name": "string", "description": "string" }
  },
  "finalPosterPrompt": "string"
}`,
        '',
        'Constraints:',
        '- topTraits must be exactly 2 items.',
        '- newInterests must be exactly 3 items and feel plausible given tags.',
        '- lifeArtifact must feel like a tangible object from this life path and reference 1 memoryToken.',
        '- finalPosterPrompt must include persona context subtly (country vibe, age mood) + 1 memoryToken and append the tail exactly:',
        IMAGE_PROMPT_TAIL,
        '- Image prompt constraints: no text, no logos, no watermark, no readable signage, no UI.',
      ].join('\n'),
    },
  ]

  const text = await pollinationsChatCompletion({
    apiKey: input.apiKey,
    model: 'openai',
    messages,
  })

  const parsed = safeJsonParse(text)
  if (!parsed || typeof parsed !== 'object') throw new Error('Final reveal response invalid JSON')
  const raw = parsed as Partial<Pick<RunPlan, 'finalReveal' | 'finalPosterPrompt'>>
  if (!raw.finalReveal || typeof raw.finalPosterPrompt !== 'string') throw new Error('Final reveal missing fields')
  const plan = validateRunPlan({
    persona: input.persona,
    runVibe: '',
    traits: input.traits,
    tags: input.tags,
    memoryTokens: input.memoryTokens,
    stages: Array.from({ length: 5 }).map((_, i) => ({
      stage: i + 1,
      title: STAGE_TITLES[(i + 1) as 1 | 2 | 3 | 4 | 5],
      sceneText: 'x',
      question: 'x',
      options: [
        {
          id: 'A',
          label: 'x',
          consequence: 'x',
          traitDelta: { ...TRAITS_ZERO, Empathy: 1 },
          tag: TAG_ALLOWLIST[0],
          memoryToken: input.memoryTokens[0] ?? 'warm key',
        },
        {
          id: 'B',
          label: 'y',
          consequence: 'y',
          traitDelta: { ...TRAITS_ZERO, Curiosity: 1 },
          tag: TAG_ALLOWLIST[0],
          memoryToken: input.memoryTokens[0] ?? 'warm key',
        },
      ],
      imagePrompt: `x, ${IMAGE_PROMPT_TAIL}`,
    })),
    finalReveal: raw.finalReveal,
    finalPosterPrompt: raw.finalPosterPrompt,
  })
  if (!plan) throw new Error('Final reveal failed validation')

  return { finalReveal: plan.finalReveal, finalPosterPrompt: plan.finalPosterPrompt }
}
