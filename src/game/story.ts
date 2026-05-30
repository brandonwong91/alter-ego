export type StoryChoice = {
  id: string
  label: string
  nextNodeId: string
}

export type StoryNode = {
  id: string
  title: string
  body: string
  imagePrompt?: string
  aiScenePrompt?: string
  aiImagePrompt?: string
  choices?: StoryChoice[]
  isEnding?: boolean
  isCritical?: boolean
}

export const START_NODE_ID = 'waking-fog'

export const storyNodes: Record<string, StoryNode> = {
  'waking-fog': {
    id: 'waking-fog',
    title: 'The Fog Room',
    body:
      'You wake to a soft fog that smells like rain on warm stone. In your pocket: a small key, already warm, already familiar. The room has no doors—until you decide where to look.',
    imagePrompt:
      'a cozy surreal room filled with warm fog, soft morning light, minimal dreamy furniture, gentle haze, cinematic, high detail, muted pastel palette',
    aiScenePrompt:
      'Write an immersive second-person opening scene in a cozy surreal tone. The protagonist wakes in a fog room holding a warm key. End with a question inviting a choice.',
    aiImagePrompt:
      'cozy surreal fog room, warm key in hand, soft diffused light, dreamy minimal interior, cinematic atmosphere, gentle pastel colors, high detail',
    choices: [
      { id: 'follow-warmth', label: 'Follow the warmth in the key', nextNodeId: 'warmth-hall' },
      { id: 'listen-walls', label: 'Press your ear to the wall and listen', nextNodeId: 'whisper-wall' },
    ],
  },
  'warmth-hall': {
    id: 'warmth-hall',
    title: 'A Hall That Remembers',
    body:
      'The key pulls you forward like a compass. A hallway appears, lined with frames that hold not pictures, but sensations—salt air, library dust, the heat of a crowded train. One frame hums louder than the rest.',
    imagePrompt:
      'surreal hallway of empty frames radiating sensations, soft glow, cozy dreamlike atmosphere, cinematic, pastel fog, high detail',
    aiScenePrompt:
      'Continue the second-person journey. The key leads to a hallway of frames holding sensations. Make it intimate and sensory. Offer two distinct frames to approach.',
    aiImagePrompt:
      'cozy surreal hallway with glowing empty frames, fog, soft light shafts, dreamy cinematic composition, pastel tones, high detail',
    choices: [
      { id: 'salt-air', label: 'Step into the frame that smells like salt air', nextNodeId: 'shoreline-door' },
      { id: 'library-dust', label: 'Choose the frame that tastes like old paper', nextNodeId: 'library-stair' },
    ],
  },
  'whisper-wall': {
    id: 'whisper-wall',
    title: 'The Whisper in Plaster',
    body:
      'The wall is cold at first—then it yields, like skin warmed by your breath. A whisper arrives in pieces, as if it’s being translated. It says your name the way someone used to, and asks you what you’re ready to stop pretending.',
    imagePrompt:
      'close-up of a softly cracked plaster wall with luminous fog leaking through, cozy surreal, intimate lighting, cinematic, high detail',
    aiScenePrompt:
      'Write a second-person scene where the protagonist listens to a wall that whispers their name. Keep it tender, uncanny, and inviting. Offer two ways to respond: honesty or deflection.',
    aiImagePrompt:
      'cozy surreal plaster wall with glowing cracks, fog seeping through, intimate warm lighting, cinematic macro detail',
    choices: [
      { id: 'tell-truth', label: 'Tell the wall the truth', nextNodeId: 'warmth-hall' },
      { id: 'joke-away', label: 'Smile and make it a joke', nextNodeId: 'mask-corridor' },
    ],
  },
  'shoreline-door': {
    id: 'shoreline-door',
    title: 'The Door With Sea Light',
    body:
      'A door opens onto a shoreline that isn’t on any map. The waves roll in slow, deliberate sentences. Far out, something bright keeps blinking—patient, as if it will wait forever. The key is heavier now.',
    imagePrompt:
      'surreal shoreline with gentle waves shaped like sentences, blinking distant light, warm fog, cozy cinematic, pastel sea, high detail',
    aiScenePrompt:
      'Write a second-person shoreline scene: waves like sentences, a distant blinking light, a key growing heavier. Offer two choices: go toward the light or stay and read the shore.',
    aiImagePrompt:
      'cozy surreal shoreline at dusk, gentle fog, distant blinking beacon light, dreamy cinematic composition, pastel sea tones, high detail',
    choices: [
      { id: 'go-light', label: 'Walk toward the blinking light', nextNodeId: 'beacon-call' },
      { id: 'read-shore', label: 'Stay and read what the waves are saying', nextNodeId: 'tide-map' },
    ],
  },
  'library-stair': {
    id: 'library-stair',
    title: 'The Stair Between Shelves',
    body:
      'You step into a library that holds books you never wrote—yet. A narrow stair descends between shelves, each step stamped with a year you recognize. The key trembles, like it doesn’t want you to rush.',
    imagePrompt:
      'cozy surreal library with impossible shelves and a narrow stair stamped with years, warm fog, cinematic light, high detail',
    aiScenePrompt:
      'Write a second-person scene in a surreal library with a stair between shelves. Each step has a year. The key trembles. Offer two choices: descend or pick a book that seems to pick you.',
    aiImagePrompt:
      'cozy surreal library, towering shelves, narrow staircase with glowing years on steps, warm fog, cinematic lighting, high detail',
    choices: [
      { id: 'descend', label: 'Descend the year-stamped stair', nextNodeId: 'year-door' },
      { id: 'choose-book', label: 'Let a book choose you', nextNodeId: 'book-voice' },
    ],
  },
  'mask-corridor': {
    id: 'mask-corridor',
    title: 'The Corridor of Masks',
    body:
      'Your joke lands, and the room laughs with you—too easily. A corridor appears, lined with masks that all fit. You realize you can keep walking forever and never be caught, never be known.',
    imagePrompt:
      'cozy surreal corridor lined with elegant masks, soft fog, warm cinematic lighting, slightly unsettling, high detail',
    aiScenePrompt:
      'Write a second-person scene where deflection creates a corridor of masks. Make it gentle but unsettling. Close with an ending that feels like a choice to pause.',
    aiImagePrompt:
      'cozy surreal corridor with many masks on walls, warm fog, cinematic lighting, subtle unease, high detail',
    choices: [
      { id: 'take-mask', label: 'Take a mask that fits perfectly', nextNodeId: 'threshold-oath' },
      { id: 'leave-mask', label: 'Leave them and keep your own face', nextNodeId: 'threshold-oath' },
    ],
  },
  'year-door': {
    id: 'year-door',
    title: 'A Door Marked With a Year',
    body:
      'You stop at a year that makes your chest go quiet. A small door waits there, polite as an invitation. The key finally cools, as if it’s leaving the decision with you.',
    imagePrompt:
      'cozy surreal library stair with a small door marked with a year, warm fog, cinematic, high detail',
    aiScenePrompt:
      'Write a second-person scene: you stop at a year that changes your breathing. A small door waits. The key cools. Make it tender and unresolved. Offer two options: open it now, or sit with it a moment longer.',
    aiImagePrompt:
      'cozy surreal library with a small door labeled with a glowing year, warm fog, cinematic lighting, high detail',
    choices: [
      { id: 'open-year', label: 'Open the door', nextNodeId: 'threshold-oath' },
      { id: 'wait-year', label: 'Sit with it a little longer', nextNodeId: 'threshold-oath' },
    ],
  },
  'book-voice': {
    id: 'book-voice',
    title: 'The Book That Speaks Back',
    body:
      'A book slides free on its own. When you open it, the page isn’t paper—it’s a mirror that knows how to read you. The first line is already written. It’s not prophecy. It’s recognition.',
    imagePrompt:
      'surreal book opening to a mirror-like page reflecting a face in fog, cozy cinematic lighting, pastel, high detail',
    aiScenePrompt:
      'Write a second-person scene: a book opens to a mirror-page that reads the protagonist. The first line is recognition. Make it intimate and immersive. Offer two choices: read aloud, or close it and keep the sentence private.',
    aiImagePrompt:
      'cozy surreal open book with mirror-like page reflecting softly through fog, cinematic warm light, pastel tones, high detail',
    choices: [
      { id: 'read-aloud', label: 'Read it aloud', nextNodeId: 'threshold-oath' },
      { id: 'keep-private', label: 'Keep it private', nextNodeId: 'threshold-oath' },
    ],
  },
  'beacon-call': {
    id: 'beacon-call',
    title: 'The Beacon’s Patience',
    body:
      'You move toward the blinking light, and the horizon moves with you. The beacon does not get closer; it gets clearer. Each blink feels like a question you’ve avoided by staying busy.',
    imagePrompt:
      'cozy surreal shoreline with distant beacon becoming clearer, warm fog, cinematic, pastel sea tones, high detail',
    aiScenePrompt:
      'Write a second-person scene: you walk toward a beacon that does not get closer, only clearer. Make it reflective and sensory. Offer two choices: keep walking, or turn back to name what you want first.',
    aiImagePrompt:
      'cozy surreal foggy shoreline, distant beacon light, cinematic warm haze, pastel tones, high detail',
    choices: [
      { id: 'keep-walking', label: 'Keep walking without bargaining', nextNodeId: 'threshold-oath' },
      { id: 'name-want', label: 'Turn back long enough to name what you want', nextNodeId: 'threshold-oath' },
    ],
  },
  'tide-map': {
    id: 'tide-map',
    title: 'A Map Made of Tides',
    body:
      'You stay. You watch the patterns form, erase, form again. The tide is drawing a map that only exists if you pay attention. The key rests in your palm like a small animal that trusts you.',
    imagePrompt:
      'cozy surreal shoreline with tide patterns forming a luminous map, warm fog, cinematic, high detail, pastel blues',
    aiScenePrompt:
      'Write a second-person scene: the tide draws a map that only exists while watched. Make it gentle and immersive. Offer two choices: follow the first line of the map, or fold the map into memory and walk anyway.',
    aiImagePrompt:
      'cozy surreal shoreline with luminous tide-map patterns, warm fog, cinematic lighting, pastel blues, high detail',
    choices: [
      { id: 'follow-map', label: 'Follow the first line of the map', nextNodeId: 'threshold-oath' },
      { id: 'memory-map', label: 'Keep it as memory and walk anyway', nextNodeId: 'threshold-oath' },
    ],
  },
  'threshold-oath': {
    id: 'threshold-oath',
    title: 'The Question That Changes You',
    body:
      'Everything you’ve touched tonight has been asking the same thing in different voices. The room finally grows quiet enough for you to answer. The key is no longer warm or cold—it’s simply waiting.',
    imagePrompt:
      'cozy surreal threshold doorway in fog, key held at chest height, soft cinematic light, high detail, pastel fog',
    aiScenePrompt:
      'Write a second-person critical decision scene. The protagonist recognizes the journey has been asking one question. Build tension softly, then present a clear fork. End right before the choice is made.',
    aiImagePrompt:
      'cozy surreal doorway threshold in warm fog, key in hand, cinematic soft light, dreamy atmosphere, high detail',
    isCritical: true,
    choices: [
      { id: 'choose-closer', label: 'Choose the life that asks you to get closer', nextNodeId: 'ending-tender' },
      { id: 'choose-truer', label: 'Choose the life that asks you to be truer', nextNodeId: 'ending-bright' },
    ],
  },
  'ending-tender': {
    id: 'ending-tender',
    title: 'You Step Toward the Tender Thing',
    body:
      'The door doesn’t swing open. It leans, just enough to let you through. You don’t win anything. You simply stop abandoning yourself in small ways. The fog follows, not as a cage, but as weather.',
    imagePrompt:
      'cozy surreal doorway opening slightly, warm fog like weather, gentle cinematic light, high detail, soft pastel palette',
    aiScenePrompt:
      'Write a second-person ending. The protagonist chooses the life that asks them to get closer. Make it gentle, grounded, and quietly brave. End with a sense of arrival.',
    aiImagePrompt:
      'cozy surreal doorway with warm fog, gentle glow, cinematic soft light, pastel tones, high detail',
    isEnding: true,
  },
  'ending-bright': {
    id: 'ending-bright',
    title: 'You Tell the Truth and the Air Changes',
    body:
      'You say it. The honest sentence. The fog doesn’t vanish—it rearranges, like it’s making room for you. Somewhere inside your ribs, something unclenches. The key cools, and the world warms.',
    imagePrompt:
      'cozy surreal fog rearranging into clear air, warm cinematic light, gentle particles, high detail, pastel lilac and apricot',
    aiScenePrompt:
      'Write a second-person ending. The protagonist chooses the life that asks them to be truer. Make it intimate and transformative without melodrama. End with clarity.',
    aiImagePrompt:
      'cozy surreal fog parting into clearer air, warm cinematic lighting, pastel lilac apricot tones, high detail',
    isEnding: true,
  },
}
