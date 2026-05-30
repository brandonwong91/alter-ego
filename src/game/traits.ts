import type { Archetype } from '../data/demo'
import { archetypeProfiles } from '../data/demo'
import { characters, locations } from '../data/showcase'

export type ArchetypeId = (typeof characters)[number]['id']

export type ArchetypeReveal = {
  archetypeId: ArchetypeId
  archetype: Archetype
  subtitle: string
  description: string
  tells: string[]
  rewardImagePrompt: string
}

const archetypeById: Record<ArchetypeId, Archetype> = {
  builder: 'The Builder',
  explorer: 'The Explorer',
  rebel: 'The Rebel',
  caregiver: 'The Caregiver',
}

export function fallbackArchetypeReveal(input: {
  decisions: Array<{ nodeId: string; choiceId: string }>
  locationId?: (typeof locations)[number]['id']
}): ArchetypeReveal {
  const score: Record<ArchetypeId, number> = {
    builder: 0,
    explorer: 0,
    rebel: 0,
    caregiver: 0,
  }

  for (const d of input.decisions) {
    if (
      d.choiceId.includes('follow') ||
      d.choiceId.includes('step') ||
      d.choiceId.includes('walk') ||
      d.choiceId.includes('map') ||
      d.choiceId.includes('go-')
    ) {
      score.explorer += 2
    }
    if (d.choiceId.includes('listen') || d.choiceId.includes('read') || d.choiceId.includes('wait')) {
      score.caregiver += 2
    }
    if (d.choiceId.includes('truth') || d.choiceId.includes('truer') || d.choiceId.includes('name')) {
      score.rebel += 2
    }
    if (d.choiceId.includes('build') || d.choiceId.includes('open') || d.choiceId.includes('descend')) {
      score.builder += 2
    }
    if (d.choiceId.includes('keep-private')) score.caregiver += 1
    if (d.choiceId.includes('joke')) score.rebel += 1
    if (d.choiceId.includes('take-mask')) score.builder += 1
    if (d.choiceId.includes('leave-mask')) score.rebel += 1
  }

  const ordered = (Object.keys(score) as ArchetypeId[]).sort((a, b) => score[b] - score[a])
  const archetypeId = ordered[0] ?? 'explorer'
  const archetype = archetypeById[archetypeId]
  const profile = archetypeProfiles[archetype]

  const location = locations.find((l) => l.id === input.locationId) ?? locations[0]

  const rewardImagePrompt = [
    `cozy surreal cinematic scene set in ${location.label}`,
    location.mood,
    `${archetype} as a symbolic figure`,
    'soft diffused light, gentle fog, dreamy atmosphere, high detail, pastel palette',
  ].join(', ')

  return {
    archetypeId,
    archetype,
    subtitle: profile.subtitle,
    description: profile.description,
    tells: profile.tells,
    rewardImagePrompt,
  }
}
