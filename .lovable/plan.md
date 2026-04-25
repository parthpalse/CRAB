
# Monochromatic professional rebrand

Shift the entire app from indigo-accented to a refined **monochromatic black + grey** palette. Logo, headings, buttons, charts, and accents all move to a sophisticated greyscale system worthy of a premium consulting brand.

## Palette (all HSL, in `index.css`)

| Token | Old (indigo) | New (mono) |
|---|---|---|
| `--foreground` | slate-900 | **near-black** `0 0% 9%` |
| `--background` | off-white | `0 0% 99%` |
| `--primary` | indigo 234 89% 56% | **graphite** `0 0% 15%` |
| `--primary-foreground` | white | `0 0% 98%` |
| `--primary-glow` | bright indigo | `0 0% 35%` |
| `--secondary` | dark slate | `0 0% 20%` |
| `--accent` | indigo tint | light grey `0 0% 94%` |
| `--accent-foreground` | indigo dark | `0 0% 15%` |
| `--muted` | cool slate | `0 0% 96%` |
| `--muted-foreground` | slate-500 | `0 0% 40%` |
| `--border` / `--input` | cool slate | `0 0% 90%` |
| `--ring` | indigo | `0 0% 20%` |
| `--success` | emerald | **dark grey** `0 0% 25%` (kept neutral; positive deltas use weight/icon, not green) |
| `--warning` | amber | mid grey `0 0% 50%` |
| `--destructive` | red | kept restrained `0 0% 20%` with subtle dotted border for severity (or retain a single muted red `0 60% 45%` only for critical alerts — see decision below) |

**Decision on alerts**: To stay strictly monochromatic *and* still communicate urgency clearly (consulting standard), severity will use **weight + iconography + greyscale tiers** rather than colour. Critical alerts get the darkest fill (`0 0% 9%`) with white text; medium gets mid-grey; low gets outlined. No red, no amber, no green anywhere.

## Gradients & shadows
- `--gradient-hero`: `linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 18%), hsl(0 0% 28%))` — deep charcoal to graphite.
- `--gradient-primary`: `linear-gradient(135deg, hsl(0 0% 12%), hsl(0 0% 30%))`.
- `--gradient-subtle`: `linear-gradient(180deg, hsl(0 0% 99%), hsl(0 0% 96%))`.
- Shadows lose the indigo tint → pure black at low opacity (`0 10px 40px -12px hsl(0 0% 0% / 0.12)`).

## Logo
`src/components/Logo.tsx`:
- "CRAB.AI" wordmark — entire text in `text-foreground` (near-black). The `.AI` no longer uses `text-primary` indigo; it stays the same near-black, just kept as part of the wordmark for typographic consistency.
- Crab mark image stays as-is (it's the brand mark and the user supplied it in colour). If the user later wants a desaturated version we can swap, but per the request "logo text in black" the *text* is the focus.

## Components touched (token-driven, mostly automatic)
Because the app uses semantic Tailwind tokens (`bg-primary`, `text-primary`, `border-border`, etc.), updating CSS variables propagates everywhere:
- Buttons, badges, cards, inputs, tabs, progress bar — all flip to greyscale automatically.
- Recharts series colours in `Dashboard.tsx`: replace any hard-coded indigo / emerald / amber hex values with `hsl(var(--foreground))`, `hsl(var(--muted-foreground))`, `hsl(var(--border))` for bars, line, and gauge segments. I'll audit `Dashboard.tsx` and swap chart fills to greyscale tones (3 tiers: charcoal, graphite, light grey).
- Health gauge: greyscale ring (dark fill on light track) with the verdict label conveying the status, not colour.

## Typography polish
Keep Orbitron for display (brand) + Inter for body. Tighten letter-spacing on headings (`tracking-tight`) for the editorial consulting feel. No font swap needed.

## Files to edit
- `src/index.css` — full token rewrite (light + dark mode kept consistent monochrome).
- `tailwind.config.ts` — no changes needed (tokens drive everything).
- `src/components/Logo.tsx` — drop the indigo `.AI` accent, unify in foreground.
- `src/pages/Dashboard.tsx` — replace any hard-coded chart colours with greyscale CSS-var-driven values; replace severity colour classes with greyscale tiers.
- `src/pages/Landing.tsx` — audit any inline colour utilities (e.g. `text-indigo-*`, `bg-emerald-*`); swap to semantic tokens.
- `src/pages/Setup.tsx`, `src/pages/AddData.tsx`, `src/pages/Login.tsx`, `src/pages/Signup.tsx` — same audit, swap any literal colour utilities to token classes.

## Result
A strictly monochromatic, editorial palette: black wordmark, graphite buttons, ivory backgrounds, greyscale charts, severity through hierarchy not colour. The crab mark remains the single colourful brand element, which is intentional and on-trend for premium consulting brands (think McKinsey, Bain — black/white UI with one accent mark).
