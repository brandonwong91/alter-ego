export const countries = ['China', 'Japan', 'USA', 'Brazil'] as const
export type Country = (typeof countries)[number]

export const eras = [
  'Late 90s',
  'Early 00s',
  'Near Future',
  'After the Quiet',
] as const
export type Era = (typeof eras)[number]

export type Choice = {
  id: 'c1' | 'c2' | 'c3'
  prompt: string
  a: string
  b: string
}

export const choices: Choice[] = [
  {
    id: 'c1',
    prompt: 'When the fog lifts, you notice what you’ve been holding.',
    a: 'Let it go, gently',
    b: 'Hold it tighter',
  },
  {
    id: 'c2',
    prompt: 'A door appears where there wasn’t one yesterday.',
    a: 'Step through first',
    b: 'Listen at the frame',
  },
  {
    id: 'c3',
    prompt: 'Someone asks you to stay a little longer.',
    a: 'Stay, and soften',
    b: 'Leave, and build',
  },
]

export type Archetype = 'The Builder' | 'The Explorer' | 'The Rebel' | 'The Caregiver'

export const archetypes: Archetype[] = [
  'The Builder',
  'The Explorer',
  'The Rebel',
  'The Caregiver',
]

export const archetypeProfiles: Record<
  Archetype,
  { subtitle: string; description: string; tells: string[] }
> = {
  'The Builder': {
    subtitle: 'You turn uncertainty into something that stands.',
    description:
      'In every timeline, you find a structure to lean on. You measure the room, choose a tool, and commit. Your softness is the secret engine—hidden under competence, under care.',
    tells: [
      'You keep a list—then revise it kindly.',
      'You prefer the honest weight of responsibility.',
      'You build bridges before you need them.',
    ],
  },
  'The Explorer': {
    subtitle: 'You collect moments like maps.',
    description:
      'You don’t chase novelty. You chase sensation—temperature, tone, the delicate truth of a place at dusk. Your courage looks like curiosity, and your loyalty looks like movement.',
    tells: [
      'You follow small signs without asking permission.',
      'You trust new rooms to teach you.',
      'You leave with gratitude, not guilt.',
    ],
  },
  'The Rebel': {
    subtitle: 'You refuse the life that makes you smaller.',
    description:
      'You are not here to be manageable. You are here to be real. You pick the answer that costs something, because a cheap life feels like a lie. Your tenderness is sharp, but it’s still tenderness.',
    tells: [
      'You name what others avoid.',
      'You protect your spark like it’s sacred.',
      'You don’t apologize for wanting more truth.',
    ],
  },
  'The Caregiver': {
    subtitle: 'You keep the fragile things from breaking.',
    description:
      'You can feel the room before the room speaks. You notice what’s missing, what’s unmet, what’s almost. Your power is steady and quiet: the ability to hold someone without owning them.',
    tells: [
      'You listen with your whole body.',
      'You remember details that matter.',
      'You choose gentleness without disappearing.',
    ],
  },
}

