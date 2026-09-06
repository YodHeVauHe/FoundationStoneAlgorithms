# Geist × Monolith Design Spec

Date: 2026-09-05
Status: Approved in brainstorm (user gate pending)
Supersedes: visual-language sections of 2026-09-05-precision-dark-ui-redesign-design.md (§4 foundations, §5 hero structure, §7 motion deltas). IA, copy, wizard flow, and scroll-driven layering from that spec remain in force.

## 1. Goal

Re-skin the site in Vercel's Geist design language and anchor the hero with a real-time Three.js render — a faceted obsidian "foundation stone" monolith — under a strict lightweight/performance budget for all devices.

## 2. Decisions (from brainstorm)

1. 3D centerpiece: **Foundation Stone monolith** — extruded, beveled triangular prism (Vercel triangle motif × brand name). Matte black facets, white key light, cyan rim, hairline cyan edges, slow rotation + mouse-parallax tilt + gentle float.
2. Typeface: **Geist Variable + Geist Mono Variable** (self-hosted Fontsource; Inter/JetBrains Mono packages removed).
3. Primary buttons become **white** (white fill, near-black text) — Vercel's signature; cyan is accent-only (links, focus, glow, eyebrows).
4. 3D tech: **vanilla Three.js in a lazy-loaded chunk** — no react-three-fiber/drei runtime.
5. IA, copy, scroll-driven layering, dot grid, trust strip, and the services wizard flow are unchanged except where restyled by shared components/tokens.

## 3. Design language

- Fonts via Fontsource: `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`. Tailwind `fontFamily.sans = ['"Geist Variable"', …]`, `fontFamily.mono = ['"Geist Mono Variable"', …]`. (Fallback if Fontsource lacks Geist: Google Fonts self-host via @fontsource is preferred — verify at implementation; last resort keep Inter and note it.)
- **Weight cap: 600.** Audit and replace every `font-bold` (700+) with `font-semibold`.
- H1/display: larger scale, `tracking-tighter`.
- Token values change (names unchanged): `--background: 0 0% 4%`, `--card: 0 0% 6%`, `--muted: 0 0% 12%`, `--muted-foreground: 0 0% 63%`, `--secondary: 0 0% 10%`, `--accent: 0 0% 13%`, `--border/--input: 0 0% 16%`, `--foreground: 0 0% 98%`. `--primary` stays cyan `197 82% 63%` (accent role), `--ring` stays cyan, destructive unchanged. `--radius` stays `0.75rem`; cards use `rounded-xl` (down from `rounded-2xl`), buttons `rounded-md`.
- `Button` default variant: `bg-white text-neutral-950 hover:bg-neutral-200` (Vercel white primary); `outline`/`ghost` unchanged.

## 4. Monolith scene

- Geometry: equilateral triangle `THREE.Shape` → `ExtrudeGeometry` (depth ≈ 0.55× edge, bevel ≈ 0.06), `flatShading` — a faceted prism, ~2k triangles.
- Material: `MeshStandardMaterial` near-black (`#0d0d0d`), roughness ≈ 0.35, metalness ≈ 0.55. Lights: dim ambient (~0.25), white directional key upper-right (~1.2), cyan point rim behind-left (accent hex ≈ `#38bdf8`). `EdgesGeometry` + `LineBasicMaterial` cyan, opacity ≈ 0.35.
- Motion: continuous slow yaw (~0.15 rad/s via clock delta), sinusoidal float (±0.06), mouse-parallax tilt (lerp ≈ 0.05). Transparent canvas (`alpha: true`) over the page background; antialias on.

## 5. Performance contract (all devices)

- `three` ships in its own lazy chunk via `React.lazy` — loads after first paint, home page only. Text paints first (LCP unaffected).
- DPR clamped to `min(devicePixelRatio, 1.5)`; no shadows, no textures, no post-processing; ≤ ~2k triangles.
- Render loop pauses when `document.hidden` or the hero is offscreen (`IntersectionObserver`); under `prefers-reduced-motion` render exactly one static frame.
- No WebGL / chunk load failure → CSS fallback silhouette (triangle `clip-path` + gradient + cyan edge glow) via error boundary + Suspense fallback. Scene fully disposed on unmount.

## 6. Code changes

**Create**
- `src/components/hero/Monolith.tsx` — always-loaded wrapper: `React.lazy` import of the canvas, IntersectionObserver + visibility pause API, `useReducedMotion`, WebGL try/catch, Suspense/error-boundary fallback silhouette (CSS clip-path triangle).
- `src/components/hero/MonolithCanvas.tsx` — lazy chunk: owns the canvas element, instantiates `MonolithScene`, forwards pause signals.
- `src/components/hero/monolith-scene.ts` — vanilla three scene class: `constructor(canvas)`, `setPaused(boolean)`, `setPointer(x, y)`, `dispose()`.

**Modify**
- `package.json`: +`three`, +`@types/three` (dev), +`@fontsource-variable/geist`, +`@fontsource-variable/geist-mono`; −`@fontsource-variable/inter`, −`@fontsource-variable/jetbrains-mono`.
- `src/main.tsx`: font imports swap.
- `tailwind.config.js`: fontFamily swap.
- `src/index.css`: token values per §3.
- `src/components/ui/button.tsx`: default variant → white primary; `rounded-md`.
- `src/App.tsx`: split hero (`lg:grid-cols-[1.1fr_1fr]`, monolith right; stacked on mobile with smaller canvas above headline); display type `tracking-tighter` + weight-cap audit; hero glow updated for near-black neutral tokens.
- `src/pages/Services.tsx`: inherits Button/token changes; no structural edits (audit `font-bold` only).

**Delete**
- None (font packages removed via npm).

## 7. Verification

1. `npm run build` passes; three lands in a **separate lazy chunk** (check dist assets).
2. `npm run lint` passes; `grep -rn "font-bold" src/` clean.
3. Browser: desktop hero shows rotating monolith; scroll pauses its loop when offscreen; mobile 390px stacks with smaller canvas and no horizontal overflow; reduced-motion renders a static monolith frame; tab-hidden pauses the loop.
4. Wizard unaffected: white primary buttons, stepper, `?type=` preselection, quote flow all still work.
5. WebGL-fallback path: force renderer failure (or block three chunk) → CSS silhouette renders.
