# Quote Builder Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the step-based quote wizard with a single-page quote builder that supports multi-select product categories and conditional sub-options.

**Architecture:** Keep the redesign contained to the existing landing-page CTA, the services page, and the root layout container. Use local React state in `Services.tsx` for top-level product selection, conditional option groups, description entry, and quote summary generation.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, Motion

---

### Task 1: Reshape The Quote Builder UI

**Files:**
- Modify: `src/pages/Services.tsx`

- [ ] Step 1: Replace the wizard state with top-level product selection state and conditional sub-option state.
- [ ] Step 2: Render three primary product cards for mobile, web, and operating system apps with Lucide icons.
- [ ] Step 3: Render mobile sub-options (`Android`, `iOS`, `Both`) only when the mobile category is selected.
- [ ] Step 4: Render operating system sub-options (`Linux`, `macOS`, `Windows`) only when the OS category is selected.
- [ ] Step 5: Keep web app as a top-level selection with no sub-options and add a compact summary plus description area.

### Task 2: Fix Supporting Layout

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [ ] Step 1: Reduce the landing-page `Get a Quote` button size so it no longer dominates the hero.
- [ ] Step 2: Remove the root container constraints that force hidden overflow and fixed viewport height.

### Task 3: Verify

**Files:**
- Test: `npm run build`

- [ ] Step 1: Run the production build and confirm TypeScript and Vite complete successfully.
