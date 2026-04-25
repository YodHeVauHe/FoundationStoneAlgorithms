# Home Split Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the landing page into a responsive split screen with the existing animated logo area on the left and Bezalel's message, three placeholder project folders, and the `Get a Quote` button on the right.

**Architecture:** Keep routing unchanged and scope the redesign to the landing route in `src/App.tsx`. Install the requested shadcn registry component for the folder visuals, then compose a right-side content panel from a small local project data array so the placeholders can be replaced later without reworking the split layout.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui registry component, motion, lucide-react

---

## File Structure

- Modify: `package.json`
  - Accept any dependency changes introduced by the shadcn registry install.
- Modify: `package-lock.json`
  - Capture dependency and registry-generated package updates.
- Modify: `src/App.tsx`
  - Replace the centered single-column hero with the responsive split layout and local placeholder project data.
- Modify: `src/App.css`
  - Keep root sizing aligned with the new full-height split layout if needed.
- Create: `src/components/ui/folder.tsx` or registry-provided equivalent path
  - Host the generated `@react-bits/Folder-JS-CSS` component if the shadcn command creates it.
- Modify: `src/index.css`
  - Accept any registry-required CSS additions only if the generated component depends on them.
- Test: `npm run build`
  - Verify TypeScript and Vite both accept the new layout and component integration.

### Task 1: Install the Folder Component

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/components/ui/folder.tsx` or registry-provided equivalent path
- Modify: `src/index.css` if required by the generated component
- Test: `npm run build`

- [ ] **Step 1: Confirm the component does not already exist**

Run: `rg -n "Folder" src/components src/App.tsx`
Expected: no existing `Folder-JS-CSS` implementation is found

- [ ] **Step 2: Install the requested shadcn registry component**

Run: `npx shadcn@latest add @react-bits/Folder-JS-CSS`
Expected: shadcn adds the registry component files and updates dependencies if needed

- [ ] **Step 3: Inspect generated files before integrating them**

Run: `git diff -- package.json package-lock.json src/components src/index.css`
Expected: diff shows the exact component path, any dependency changes, and any CSS added by the registry

- [ ] **Step 4: Run the build after installation only**

Run: `npm run build`
Expected: build passes, proving the generated component is compatible before the home-page redesign starts

- [ ] **Step 5: Commit the generated component install**

```bash
git add package.json package-lock.json src/components src/index.css
git commit -m "feat: add folder showcase component"
```

### Task 2: Redesign the Landing Layout Around the Folder Showcase

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Test: `npm run build`

- [ ] **Step 1: Write the failing test by defining the intended landing markup**

Replace the current centered hero structure in `src/App.tsx` with a split layout target that includes:

```tsx
const projectFolders = [
  { title: 'AI Outreach Suite', accent: 'Example Project' },
  { title: 'Client Ops Portal', accent: 'Example Project' },
  { title: 'Knowledge Engine', accent: 'Example Project' },
];
```

and a right-side content shape like:

```tsx
<section className="relative z-10 grid min-h-screen w-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
  <div className="relative flex min-h-[46vh] items-center justify-center overflow-hidden px-6 py-12 lg:min-h-screen lg:px-10">
    {/* animated logo panel */}
  </div>
  <div className="relative z-10 flex items-center px-6 py-10 lg:px-10">
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      {/* Bezalel message */}
      {/* Projects heading */}
      {/* 3 folders */}
      {/* Get a Quote button */}
    </div>
  </div>
</section>
```

This is the "failing test" for a UI-only task in a codebase without component tests: define the target structure first, then verify it fails to compile until the missing folder integration is added correctly.

- [ ] **Step 2: Run the build to verify the intermediate state fails for the expected reason**

Run: `npm run build`
Expected: FAIL with a missing import, invalid JSX, or incomplete folder usage while the new structure is not fully wired yet

- [ ] **Step 3: Implement the minimal complete landing page**

Update `src/App.tsx` so `MainContent` follows this shape:

```tsx
import Folder from './components/ui/folder';

const projectFolders = [
  { title: 'AI Outreach Suite', accent: 'Example Project' },
  { title: 'Client Ops Portal', accent: 'Example Project' },
  { title: 'Knowledge Engine', accent: 'Example Project' },
];

function MainContent() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="fixed inset-0 z-0">
        <LetterGlitch
          glitchColors={['#0ea5e9', '#06b6d4', '#3b82f6', '#0c4a6e', '#164e63']}
          glitchSpeed={20}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
          theme="dark"
        />
      </div>
      <Ripple className="fixed inset-0 z-0" mainCircleSize={260} mainCircleOpacity={0.28} numCircles={9} />

      <section className="relative z-10 grid min-h-screen w-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative flex min-h-[46vh] items-center justify-center px-6 py-12 lg:min-h-screen lg:px-10">
          <motion.img
            src={whiteLogo}
            alt="Foundation Stone Algorithms logo"
            className="h-52 w-52 object-contain sm:h-64 sm:w-64 md:h-80 md:w-80"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', duration: 1.2, bounce: 0.25 }}
          />
        </div>

        <div className="relative flex items-center px-6 py-10 lg:px-10">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-8 rounded-[32px] border border-white/10 bg-black/30 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8">
            <div className="space-mono-regular rounded-[24px] border border-white/12 bg-black/35 px-4 py-3 text-left text-lg text-foreground shadow-[0_24px_70px_rgba(0,0,0,0.48)] sm:px-5 sm:py-4 sm:text-xl">
              <TypingAnimation
                as="q"
                className="block text-lg font-medium leading-8 text-foreground sm:text-xl sm:leading-9"
                duration={100}
                delay={1500}
                startOnView={true}
              >
                We create solutions for our clients with products powered by artificial intelligent agents
              </TypingAnimation>
              <cite className="mt-3 block text-sm italic text-foreground/80 sm:text-base">- Be'Zaleel</cite>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="space-mono-bold text-xl text-foreground sm:text-2xl">Projects</h2>
                <span className="text-xs uppercase tracking-[0.32em] text-foreground/45">Dummy</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {projectFolders.map((project) => (
                  <div key={project.title} className="flex justify-center">
                    <Folder />
                    <div className="sr-only">{project.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <Link to="/services">
                <ShinyButton className="w-full px-6 py-3 text-base sm:px-7 sm:py-3.5">
                  Get a Quote <ArrowRight className="ml-1 h-4 w-4" />
                </ShinyButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="absolute bottom-3 left-0 right-0 z-10 text-center text-[8px] text-muted-foreground sm:text-[9px]">
        {new Date().getFullYear()} Foundation Stone Algorithms. All rights reserved.
      </div>
    </div>
  );
}
```

Adapt the `Folder` import name and props to the actual registry output, but keep the approved layout order and responsive structure unchanged.

- [ ] **Step 4: Keep the root container aligned with full-screen layout**

If `src/App.css` needs cleanup, reduce it to:

```css
#root {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
```

Only keep extra rules if they are still necessary after the redesign.

- [ ] **Step 5: Run the build to verify the redesign passes**

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: Commit the landing-page redesign**

```bash
git add src/App.tsx src/App.css
git commit -m "feat: redesign home hero into split projects layout"
```

### Task 3: Polish Folder Labels and Final Verification

**Files:**
- Modify: `src/App.tsx`
- Test: `npm run build`

- [ ] **Step 1: Write the failing test by making folder placeholders clearly identifiable**

Add visible labels tied to each dummy project near each folder so the placeholders are understandable even if the generated folder artwork is abstract. Target markup:

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
  {projectFolders.map((project) => (
    <div key={project.title} className="flex flex-col items-center gap-3">
      <Folder />
      <div className="text-center">
        <p className="space-mono-bold text-sm text-foreground">{project.title}</p>
        <p className="text-xs uppercase tracking-[0.24em] text-foreground/55">{project.accent}</p>
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Run the build to verify the intermediate label update fails if incomplete**

Run: `npm run build`
Expected: FAIL only if the new `project.accent` field or JSX is not yet wired correctly

- [ ] **Step 3: Implement the minimal label polish**

Ensure the visible label block is rendered under each folder and that the local array contains both `title` and `accent` fields for all three placeholder projects.

- [ ] **Step 4: Run final verification**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS, or only pre-existing unrelated warnings if the repo already has them

- [ ] **Step 5: Commit the final landing-page polish**

```bash
git add src/App.tsx
git commit -m "feat: add placeholder project labels to home folders"
```

## Self-Review

- Spec coverage:
  - Split-screen desktop layout: covered in Task 2.
  - Existing logo/animation preserved on the left: covered in Task 2.
  - Bezalel message on the right: covered in Task 2.
  - `Projects` section below the message: covered in Task 2.
  - Three dummy folder items: covered in Tasks 2 and 3.
  - `Get a Quote` button below folders: covered in Task 2.
  - Requested shadcn registry component: covered in Task 1.
  - Build/runtime verification: covered in Tasks 1, 2, and 3.
- Placeholder scan:
  - Removed vague implementation notes and replaced them with exact files, commands, and JSX targets.
- Type consistency:
  - Placeholder project objects use `title` and `accent` consistently across Tasks 2 and 3.
