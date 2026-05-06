# Patch — `src/components/AntigravityHero.tsx`

Only one line changes: the hero canvas wrapper's `transition` duration.

## Find

```tsx
<div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: scrolled ? 0 : 1, transition: 'opacity 0.8s ease' }}>
```

## Replace with

```tsx
<div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: scrolled ? 0 : 1, transition: 'opacity 0.25s ease' }}>
```

That's the entire hero/overlap fix. The hero canvas now disappears in 250ms (effectively a hard cut) once the user scrolls past 40px, so it's gone well before `HowItWorks` (which has `background: '#0A0A0A'`) scrolls into view.

Nothing else in `AntigravityHero.tsx` is touched.
