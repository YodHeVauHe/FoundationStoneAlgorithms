# Geist × Monolith Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the site in Vercel's Geist design language (white primary buttons, near-black neutrals, weight cap 600) and anchor the hero with a lazy-loaded vanilla Three.js "Foundation Stone" monolith, per `docs/superpowers/specs/2026-09-05-geist-monolith-redesign-design.md`.

**Architecture:** Task 1 swaps the type/token/button foundations. Task 2 adds the three.js monolith (scene class + lazy canvas + fallback wrapper) and splits the hero. Task 3 is the verification pass. Executed inline in-session (subagent dispatch channel proved unreliable earlier in this session; the plan contains complete code, so execution is transcription + verification with the same gates).

**Tech Stack:** three 0.185 (+@types/three), @fontsource-variable/geist(-mono) 5.3.0, Tailwind 3, motion/react.

## Global Constraints

- Token names unchanged; only values change (§3 of spec): `--background: 0 0% 4%`, `--card: 0 0% 6%`, `--muted: 0 0% 12%`, `--muted-foreground: 0 0% 63%`, `--secondary: 0 0% 10%`, `--accent: 0 0% 13%`, `--border/--input: 0 0% 16%`, `--foreground: 0 0% 98%`; `--primary`/`--ring` stay `197 82% 63%`.
- **Weight cap 600**: `grep -rn "font-bold" src/` must be clean at the end (replace with `font-semibold`).
- Button default variant = white (`bg-white text-neutral-950 hover:bg-neutral-200`), base radius `rounded-md`; cards `rounded-xl`.
- `three` must land in a separate lazy chunk; scene pauses when `document.hidden` or hero offscreen; reduced motion = one static frame; DPR ≤ 1.5; no shadows/textures/post-processing.
- No test runner: per-task verification = `npm run build` + `npm run lint` + listed visual checks.
- Work on branch `feat/geist-monolith`; never `git add -A` (untracked `.codex/`, `graphify-out/`, `remakes/` stay out).

---

### Task 1: Geist foundations + white primary button

**Files:** Modify `package.json`, `src/main.tsx`, `tailwind.config.js`, `src/index.css`, `src/components/ui/button.tsx`, `src/App.tsx`, `src/pages/Services.tsx`

- [ ] **Step 1: Branch + deps**

```bash
git checkout -b feat/geist-monolith
npm i @fontsource-variable/geist @fontsource-variable/geist-mono three
npm i -D @types/three
npm rm @fontsource-variable/inter @fontsource-variable/jetbrains-mono
```

- [ ] **Step 2: `src/main.tsx`** — replace the first two import lines with:

```tsx
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
```

- [ ] **Step 3: `tailwind.config.js`** — replace the `fontFamily` block:

```js
fontFamily: {
  sans: ['"Geist Variable"', 'system-ui', 'sans-serif'],
  mono: ['"Geist Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
  serif: ['Newsreader', 'serif']
},
```

- [ ] **Step 4: `src/index.css`** — inside `:root`, replace the token values:

```css
  --background: 0 0% 4%;
  --foreground: 0 0% 98%;
  --card: 0 0% 6%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 6%;
  --popover-foreground: 0 0% 98%;
  --primary: 197 82% 63%;
  --primary-foreground: 0 0% 7%;
  --secondary: 0 0% 10%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 12%;
  --muted-foreground: 0 0% 63%;
  --accent: 0 0% 13%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 63% 43%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 16%;
  --input: 0 0% 16%;
  --ring: 197 82% 63%;
```

(`--radius: 0.75rem` unchanged.)

- [ ] **Step 5: `src/components/ui/button.tsx`** — base string: `rounded-lg` → `rounded-md`; default variant becomes:

```ts
        default: 'bg-white text-neutral-950 hover:bg-neutral-200',
```

- [ ] **Step 6: Weight + radius audit**

```bash
grep -rn "font-bold" src/ || echo "clean"
grep -rn "rounded-2xl" src/
```

Replace every `font-bold` → `font-semibold` and every `rounded-2xl` → `rounded-xl` (App.tsx capability card; Services.tsx wizard `<section>` and `<aside>`). Leave `src/components/ui/toast.tsx` untouched if it has any (unused radix template).

- [ ] **Step 7: Verify + commit**

```bash
npm run build && npm run lint && git add -u && git commit -m "feat(ui): Geist type system, near-black tokens, white primary button"
```

Visual: page renders in Geist on near-black; primary CTAs are white; wizard unchanged structurally.

---

### Task 2: Monolith scene + split hero

**Files:** Create `src/components/hero/monolith-scene.ts`, `src/components/hero/MonolithCanvas.tsx`, `src/components/hero/Monolith.tsx`; Modify `src/App.tsx`, `package.json` (three deps here if not already added in Task 1 — they are; skip)

- [ ] **Step 1: Create `src/components/hero/monolith-scene.ts`**

```ts
import {
  AmbientLight,
  Clock,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Shape,
  WebGLRenderer,
} from 'three';

export interface MonolithSceneOptions {
  /** Accent hex for rim light + edges (≈ --primary). */
  accentHex: string;
}

/**
 * Vanilla Three.js render of the Foundation Stone monolith: a beveled
 * triangular prism with cyan rim light and hairline edges. The RAF loop
 * pauses whenever the page is hidden or the hero is offscreen; reduced
 * motion renders exactly one static frame.
 */
export class MonolithScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private monolith: Mesh;
  private clock = new Clock();
  private rafId = 0;
  private disposed = false;
  private hidden = false;
  private visible = false;
  private reducedMotion = false;
  private pointerTarget = { x: 0, y: 0 };
  private pointer = { x: 0, y: 0 };

  constructor(
    private canvas: HTMLCanvasElement,
    options: MonolithSceneOptions
  ) {
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    this.camera = new PerspectiveCamera(38, 1, 0.1, 40);
    this.camera.position.set(0, 0.35, 6.4);
    this.camera.lookAt(0, 0, 0);

    const shape = new Shape();
    const r = 1.5;
    shape.moveTo(0, r);
    shape.lineTo(r * 0.87, -r * 0.5);
    shape.lineTo(-r * 0.87, -r * 0.5);
    shape.closePath();

    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.6,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.06,
      bevelSegments: 1,
      curveSegments: 1,
    });
    geometry.center();

    this.monolith = new Mesh(
      geometry,
      new MeshStandardMaterial({
        color: 0x0d0d0d,
        roughness: 0.35,
        metalness: 0.55,
        flatShading: true,
      })
    );
    this.monolith.rotation.x = 0.1;
    this.scene.add(this.monolith);

    this.monolith.add(
      new LineSegments(
        new EdgesGeometry(geometry, 12),
        new LineBasicMaterial({ color: options.accentHex, transparent: true, opacity: 0.35 })
      )
    );

    this.scene.add(new AmbientLight(0xffffff, 0.3));

    const key = new DirectionalLight(0xffffff, 1.6);
    key.position.set(2.4, 3.2, 2.8);
    this.scene.add(key);

    const rim = new DirectionalLight(options.accentHex, 2.2);
    rim.position.set(-2.6, 1.4, -2.4);
    this.scene.add(rim);

    this.resize();
    this.renderer.render(this.scene, this.camera); // first paint before the loop starts
    this.rafId = requestAnimationFrame(this.tick);
  }

  setVisible(visible: boolean) {
    this.visible = visible;
  }

  setHidden(hidden: boolean) {
    this.hidden = hidden;
  }

  setReducedMotion(reducedMotion: boolean) {
    const was = this.reducedMotion;
    this.reducedMotion = reducedMotion;
    if (reducedMotion && !was) {
      cancelAnimationFrame(this.rafId);
      this.renderer.render(this.scene, this.camera); // exactly one static frame
    }
  }

  setPointer(x: number, y: number) {
    this.pointerTarget.x = x;
    this.pointerTarget.y = y;
  }

  resize() {
    const width = this.canvas.clientWidth || 1;
    const height = this.canvas.clientHeight || 1;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    this.scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof LineSegments) {
        object.geometry.dispose();
        const material = object.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material.dispose();
      }
    });
    this.renderer.dispose();
  }

  private tick = () => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.tick);
    if (this.hidden || !this.visible) {
      this.clock.getDelta(); // drain so the first resumed frame has a sane delta
      return;
    }

    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.pointer.x = MathUtils.lerp(this.pointer.x, this.pointerTarget.x, 0.05);
    this.pointer.y = MathUtils.lerp(this.pointer.y, this.pointerTarget.y, 0.05);

    this.monolith.rotation.y += 0.25 * dt;
    this.monolith.position.y = Math.sin(this.clock.elapsedTime * 0.9) * 0.06;
    this.monolith.rotation.x = 0.1 + this.pointer.y * 0.16;
    this.monolith.rotation.z = this.pointer.x * 0.08;

    this.renderer.render(this.scene, this.camera);
  };
}
```

- [ ] **Step 2: Create `src/components/hero/MonolithCanvas.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import { MonolithScene } from './monolith-scene';

interface MonolithCanvasProps {
  accentHex: string;
  reducedMotion: boolean;
  visible: boolean;
  onFailed: () => void;
}

export default function MonolithCanvas({ accentHex, reducedMotion, visible, onFailed }: MonolithCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<MonolithScene | null>(null);
  const onFailedRef = useRef(onFailed);
  onFailedRef.current = onFailed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: MonolithScene;
    try {
      scene = new MonolithScene(canvas, { accentHex });
    } catch {
      onFailedRef.current();
      return;
    }
    sceneRef.current = scene;

    const onVisibility = () => scene.setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    const onPointer = (event: PointerEvent) => {
      scene.setPointer(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener('pointermove', onPointer);

    const observer = new ResizeObserver(() => scene.resize());
    observer.observe(canvas);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      observer.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
    // The scene is created once; accentHex is a module constant forwarded by the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => void sceneRef.current?.setReducedMotion(reducedMotion), [reducedMotion]);
  useEffect(() => void sceneRef.current?.setVisible(visible), [visible]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
```

- [ ] **Step 3: Create `src/components/hero/Monolith.tsx`**

```tsx
import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

const MonolithCanvas = lazy(() => import('./MonolithCanvas'));

/** Accent hex ≈ --primary (197 82% 63%); kept literal so the lazy chunk needs no CSS parsing. */
const ACCENT_HEX = '#38bdf8';

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** CSS stand-in shown while the chunk loads, and permanently without WebGL. */
function Silhouette() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="h-[68%] w-[58%] bg-gradient-to-br from-neutral-700 via-neutral-900 to-black [clip-path:polygon(50%_0,100%_100%,0_100%)] drop-shadow-[0_0_60px_hsl(197_82%_63%/0.18)]" />
    </div>
  );
}

export default function Monolith({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion() ?? false;
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px',
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`} aria-hidden="true">
      {failed ? (
        <Silhouette />
      ) : (
        <SceneBoundary fallback={<Silhouette />}>
          <Suspense fallback={<Silhouette />}>
            <MonolithCanvas
              accentHex={ACCENT_HEX}
              reducedMotion={reduceMotion}
              visible={visible}
              onFailed={() => setFailed(true)}
            />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Split hero in `src/App.tsx`**

Add the import with the other component imports:

```tsx
import Monolith from '@/components/hero/Monolith';
```

Replace the hero `<section>` (the one with `ref={heroRef}`, `min-h-[92svh]`) and its inner `motion.div` wrapper with:

```tsx
        <section ref={heroRef} className="flex min-h-[92svh] items-center px-6 py-20">
          <motion.div
            style={reduceMotion ? undefined : { y: heroY, opacity: heroOpacity, filter: heroFilter }}
            className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              {/* …keep the four Reveal children exactly as-is (badge, h1, subline, CTAs)… */}
            </div>
            <Monolith className="order-first h-60 w-full sm:h-80 lg:order-none lg:h-[440px]" />
          </motion.div>
        </section>
```

Also inside that first column: h1 gains `tracking-tighter`; the CTA row becomes `justify-center lg:justify-start`.

- [ ] **Step 5: Verify + commit**

```bash
npm run build && npm run lint
ls dist/assets | grep -i three   # three is its own chunk
git add -A src docs 2>/dev/null; git add src && git commit -m "feat(hero): Three.js foundation-stone monolith — lazy chunk, pause-on-hidden/offscreen, reduced-motion + CSS fallback"
```

Visual: monolith rotates right of the headline on desktop; smaller canvas above headline on mobile.

---

### Task 3: Verification pass

- [ ] Desktop screenshot (monolith visible, split hero) · mobile 390px (stacked, no x-overflow) · reduced-motion (static frame, no motion) · scroll hero offscreen → loop pauses (check via `renderer.info.render.frame` or manual smoothness) · wizard: white Continue/Get Quote buttons, quote flow works.
- [ ] `grep -rn "font-bold" src/` clean; three is a separate chunk in `dist/assets`.
- [ ] Final commit if any fixes; update ledger.

## Spec coverage check

- Spec §3 (fonts/tokens/weight/radius/white primary) → Task 1
- Spec §4–§5 (monolith + performance contract) → Task 2
- Spec §6 hero split → Task 2 Step 4
- Spec §7 verification → Task 3
