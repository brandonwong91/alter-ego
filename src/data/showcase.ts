export type ShowcaseLocation = {
  id: 'usa' | 'brazil' | 'china' | 'japan'
  label: string
  imageUrl: string
  mood: string
}

export type ShowcaseCharacter = {
  id: 'builder' | 'explorer' | 'rebel' | 'caregiver'
  label: string
  imageUrl: string
  essence: string
}

export const locations: ShowcaseLocation[] = [
  {
    id: 'usa',
    label: 'USA',
    imageUrl:
      'https://media.pixverse.ai/pixverse%2Ft2i%2Fori%2Fe59b0ce1-d6a4-46de-8fcc-4c3fe5007b78.jpg',
    mood: 'Sun-bleached streets. A soft ache of possibility.',
  },
  {
    id: 'brazil',
    label: 'Brazil',
    imageUrl:
      'https://media.pixverse.ai/pixverse%2Ft2i%2Fori%2Fe6172064-b9ff-482b-aab4-2a5a905cacfb.jpg',
    mood: 'Rain-warm air. Laughter drifting through open windows.',
  },
  {
    id: 'china',
    label: 'China',
    imageUrl:
      'https://media.pixverse.ai/pixverse%2Ft2i%2Fori%2F7cb0732e-87d5-49fa-a3cc-7adada519087.jpg',
    mood: 'Lantern glow. The hush between footsteps and fate.',
  },
  {
    id: 'japan',
    label: 'Japan',
    imageUrl:
      'https://media.pixverse.ai/pixverse%2Fi2i%2Fori%2F85a08e7b-b076-4e4e-8a17-d81dc929d3e6.jpg',
    mood: 'Mist at the edge of pine. A memory you can almost touch.',
  },
]

export const characters: ShowcaseCharacter[] = [
  {
    id: 'builder',
    label: 'The Builder',
    imageUrl:
      'https://media.pixverse.ai/pixverse%2Ft2i%2Fori%2F06b83c5e-4cf9-4714-9415-6d352799cc1e.jpg',
    essence: 'Steady hands. Quiet ambition. A life shaped on purpose.',
  },
  {
    id: 'explorer',
    label: 'The Explorer',
    imageUrl:
      'https://media.pixverse.ai/pixverse%2Ft2i%2Fori%2F2354874f-639e-4a54-afad-666d7cc12f26.jpg',
    essence: 'Curiosity first. Roads second. Always one door away.',
  },
  {
    id: 'rebel',
    label: 'The Rebel',
    imageUrl:
      'https://media.pixverse.ai/pixverse%2Ft2i%2Fori%2F7470b5e7-5df9-45e6-b672-d95e492f4e36.jpg',
    essence: 'Tender defiance. A heart that won’t be domesticated.',
  },
  {
    id: 'caregiver',
    label: 'The Caregiver',
    imageUrl:
      'https://media.pixverse.ai/pixverse%2Ft2i%2Fori%2F11abce8a-763d-4a00-aa03-0cc11964bb79.jpg',
    essence: 'Gentle gravity. You keep what’s fragile from falling.',
  },
]

