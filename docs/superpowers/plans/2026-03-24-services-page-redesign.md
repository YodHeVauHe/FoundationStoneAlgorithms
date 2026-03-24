# Services Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Services page with a "Modern Corporate" aesthetic, featuring SF Pro and Newsreader typography, multi-tone icons, and a balanced layout.

**Architecture:** Update global CSS for new typography and colors, then refactor `Services.tsx` to use a light-themed, professional layout with refined components and Lucide-based multi-tone icons.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, Motion, Google Fonts (Newsreader)

---

### Task 1: Typography and Global Styles Setup

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Add Newsreader font to index.html**
Add the Google Fonts link for Newsreader (Regular, Italic, 700) to the `<head>`.

- [ ] **Step 2: Update tailwind.config.js with new font families**
```javascript
// tailwind.config.js
theme: {
  extend: {
    fontFamily: {
      sans: ['"SF Pro Display"', 'system-ui', 'sans-serif'],
      serif: ['Newsreader', 'serif'],
    },
  },
}
```

- [ ] **Step 3: Update global background and foreground colors in index.css**
Update `--background` and `--foreground` variables to reflect the light-themed "Modern Corporate" look (#fdfdfd background, dark grey foreground).

- [ ] **Step 4: Commit**
```bash
git add index.html src/index.css tailwind.config.js
git commit -m "style: setup Newsreader font and global light theme colors"
```

### Task 2: Refactor Services Page Layout

**Files:**
- Modify: `src/pages/Services.tsx`

- [ ] **Step 1: Replace background effects**
Remove `LetterGlitch` and `Ripple` components. Replace the background with a clean `bg-background` and a subtle top-to-bottom gradient.

- [ ] **Step 2: Update Page Header and Hero Section**
Refactor the header and hero to use the new typography (SF Pro for "Build your next product." and Newsreader Italic for the description).

- [ ] **Step 3: Commit**
```bash
git add src/pages/Services.tsx
git commit -m "feat(services): update background and hero section typography"
```

### Task 3: Implement Refined Product Cards

**Files:**
- Modify: `src/pages/Services.tsx`

- [ ] **Step 1: Update Product Card Styling**
Update the `productCards` mapping to use 12px rounded corners, soft shadows, and a subtle border. Use a blue bottom border for selected cards.

- [ ] **Step 2: Implement Multi-tone Icons**
Wrap Lucide icons in a styled container to achieve the multi-tone effect (e.g., `bg-primary/15` background with a solid-colored icon).

- [ ] **Step 3: Commit**
```bash
git add src/pages/Services.tsx
git commit -m "feat(services): implement refined product cards with multi-tone icons"
```

### Task 4: Update Sub-options and Sidebar

**Files:**
- Modify: `src/pages/Services.tsx`

- [ ] **Step 1: Refactor Sub-option Groups**
Update Mobile and System platform selection groups to match the new card aesthetic (white background, subtle borders). Rename "Operating system app" to "Desktop Software" in UI labels and card titles.

- [ ] **Step 2: Update Sidebar and CTA**
Refactor the "Selected scope" summary and the "Get Quote" button to use high-contrast colors and the new typography. Use Newsreader Italic for the "Selected scope" and "Project details" section headers for a premium feel.

- [ ] **Step 3: Refactor Textarea styling**
Transition the project details `textarea` from its current dark theme (`bg-black/25`) to a light corporate style (e.g., `bg-white` or `bg-slate-50` with refined borders and `ring-primary/10`).

- [ ] **Step 4: Commit**
```bash
git add src/pages/Services.tsx
git commit -m "feat(services): update sub-options, sidebar, and textarea to match corporate aesthetic"
```

### Task 5: Final Polish and Verification

**Files:**
- Modify: `src/pages/Services.tsx`
- Test: `npm run build`

- [ ] **Step 1: Add smooth transitions**
Ensure all state changes (product selection, sub-option visibility) use `motion/react` for smooth transitions.

- [ ] **Step 2: Run production build**
Run `npm run build` to verify no regressions or build errors.

- [ ] **Step 3: Commit**
```bash
git add src/pages/Services.tsx
git commit -m "chore(services): final polish and build verification"
```
