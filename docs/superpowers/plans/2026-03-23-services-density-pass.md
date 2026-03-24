# Services Density Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the overall visual scale of the services page without changing its flow or selection logic.

**Architecture:** Keep the implementation isolated to `src/pages/Services.tsx` by reducing spacing, typography, icon wrappers, card radii, and control sizing proportionally. Preserve the existing single-page quote-builder structure and state behavior.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, Motion

---

### Task 1: Reduce Services Page Sizing

**Files:**
- Modify: `src/pages/Services.tsx`

- [ ] Step 1: Reduce outer container width and section padding.
- [ ] Step 2: Reduce heading, helper text, and card typography sizes.
- [ ] Step 3: Reduce product card spacing, icon wrappers, chip sizes, and summary/sidebar density.

### Task 2: Verify

**Files:**
- Test: `npm run build`

- [ ] Step 1: Run the production build and confirm TypeScript and Vite complete successfully.
