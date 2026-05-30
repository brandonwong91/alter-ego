import type { Persona } from './spec'

export const IMAGE_PROMPT_TAIL =
  'cozy surreal cinematic, dreamy soft glow, gentle film grain, tactile haze, volumetric lighting, subtle bokeh, centered composition with negative space, no text, no logos, no watermark, no readable signage, no UI'

export function personaAvatarPrompt(persona: Persona) {
  const ageMood = persona.age <= 22 ? 'youthful' : persona.age >= 35 ? 'seasoned' : 'grounded'
  return [
    `portrait of a ${ageMood} ${persona.gender} from ${persona.country}`,
    'calm expression, soft eye contact, gentle presence',
    'subtle cultural vibe without stereotypes',
    'cozy surreal cinematic portrait, clean background, centered composition',
    IMAGE_PROMPT_TAIL,
  ].join(', ')
}

export function alterEgoAvatarPrompt(input: {
  archetype: string
  persona: Persona
  locationLabel: string
  locationMood: string
  memoryToken?: string
}) {
  return [
    `portrait of "${input.archetype}" as a symbolic figure`,
    `set in ${input.locationLabel}`,
    input.locationMood,
    `subtle hints of ${input.persona.country} atmosphere, age mood ${input.persona.age}`,
    input.memoryToken ? `include motif: ${input.memoryToken}` : null,
    'cozy surreal cinematic portrait, clean background, centered composition',
    IMAGE_PROMPT_TAIL,
  ]
    .filter(Boolean)
    .join(', ')
}

