# Alter Ego

A cozy-surreal, single-page teaser for an “Alter Ego” life-path game concept: pick a setting, answer three moments, and reveal an archetype profile.

## Project Goals

- Ship a high-polish teaser/vertical slice that feels like a real product page and a playable prototype.
- Keep the experience privacy-friendly and lightweight: no accounts, no backend; history stays in the browser.
- Make the “archetype reveal” easy to iterate on via simple, authored data (prompts, scoring, archetype copy).

## What’s Included

- Landing sections: hero CTA, trailer player, and a rotating showcase of locations + characters.
- Playable demo flow:
  - Choose Country, Era, and a Seed
  - Answer three prompt “moments”
  - Get matched to an archetype (Builder / Explorer / Rebel / Caregiver)
- Local history of past runs (stored in `localStorage`; up to 16 entries).

## Tech Stack

- React + TypeScript
- Vite
- TailwindCSS
- Local storage persistence (browser-only)

## Getting Started

Prerequisites: Node.js (18+ recommended) and npm.

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run build
npm run preview
npm run lint
```

## Project Structure

- `src/sections/`: page sections (Hero, Trailer, Showcase, Demo, Footer)
- `src/components/demo/`: demo UI components (history list, profile card, etc.)
- `src/data/`: authored content for the demo and showcase
- `public/`: static assets (includes the trailer video)

## Customization

- Demo content (countries, eras, prompts, archetypes): `src/data/demo.ts`
- Showcase content (locations, characters): `src/data/showcase.ts`
- Trailer video: replace `public/alter-ego-480p.mp4` (supported: `.mp4`, `.webm`)

## Privacy Notes

- The demo stores a small run history in your browser (key: `alterEgo.demoHistory`).
- No data is sent to any server by default.

## License

No license file is included yet. Add a `LICENSE` file if you plan to distribute this publicly.
