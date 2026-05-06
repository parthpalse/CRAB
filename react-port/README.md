# Neural Hero — React port

Drop-in for the boost-advisor-main (Vite + React + TypeScript) project.

## Files (mirror these into your repo)

```
src/components/NeuralHero/scene.ts          # Three.js scene logic
src/components/NeuralHero/NeuralHero.tsx    # React component
src/components/NeuralHero/NeuralHero.css    # Scoped styles (all classes prefixed nh-)
src/pages/NeuralLanding.tsx                 # Page wrapper
```

`three` is already in your `package.json` so no new deps.

## Wire it up

In `src/App.tsx`, add a route:

```tsx
import NeuralLanding from "@/pages/NeuralLanding";

// inside <Routes>
<Route path="/neural" element={<NeuralLanding />} />
```

Then run:

```bash
npm install   # if you haven't
npm run dev
```

Open `http://localhost:5173/neural`.

To make it your homepage, swap the `/` route's element to `<NeuralLanding />`.

## Notes

- The component renders a 600vh container, with the canvas pinned (`position: fixed`) and 6 story sections layered on top.
- All CSS is scoped under `.nh` and class-prefixed `nh-` so it won't collide with your shadcn/Tailwind setup.
- Fonts are loaded from Google Fonts inside `NeuralHero.css`. If you'd rather self-host, remove the `@import` line and add the families to your existing font setup.
- The scene auto-pauses & disposes WebGL when the component unmounts.

## Customize

Edit `DEFAULTS` in `NeuralHero.tsx` to change initial hue / density / speed:

```ts
const DEFAULTS: SceneOptions = {
  speed: 1,
  nodes: 380,
  particles: 600,
  rotation: 0.6,
  hue: "white",   // 'white' | 'amber' | 'cyan'
  hud: true,
};
```
