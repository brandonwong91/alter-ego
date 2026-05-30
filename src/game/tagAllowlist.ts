export const TAG_ALLOWLIST = [
  'architecture',
  'coffee',
  'cooking',
  'crafts',
  'design',
  'film',
  'gardening',
  'hiking',
  'journaling',
  'language-learning',
  'meditation',
  'music',
  'photography',
  'reading',
  'running',
  'stargazing',
  'tea',
  'travel',
  'volunteering',
  'writing',
] as const

export type AllowedTag = (typeof TAG_ALLOWLIST)[number]

