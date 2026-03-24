# Design Specification: Services Page Redesign

**Date:** 2026-03-24
**Topic:** Services Page UI Update
**Status:** Draft (Pending Review)

## 1. Objective
Redesign the Foundation Stone Algorithms services page to be simple, professional, and modern. Replace the current technical/glitch aesthetic with a polished "Modern Corporate" look that emphasizes clarity, reliability, and ease of use.

## 2. Visual Direction: Modern Corporate
- **Aesthetic:** Polished and approachable with soft shadows, rounded corners (12px), and subtle gradients.
- **Background:** Clean, light background (#fdfdfd) to replace the current dark/glitch background.
- **Spacing:** Balanced layout density with generous whitespace to create an unhurried, professional feel.

## 3. Typography
A pairing of two distinct font types to create a premium "Editorial Professional" look:
- **Headings & UI Elements:** SF Pro (system-ui) for a clean, reliable, and functional feel.
- **Descriptive & Body Text:** Newsreader (serif, italicized in certain contexts) for a sophisticated, established editorial feel.

## 4. Components & Layout
- **Product Selection:** A balanced grid of three primary product cards (Mobile App, Web App, Desktop Software).
- **Icons:** Multi-tone (Radix/Phosphor style) with secondary fills for depth and a premium feel.
- **Sub-options:** Rendered as clean, selectable lists or buttons below the primary selection when active.
- **Description Area:** A refined text area with subtle borders and clear focus states.
- **CTA Sidebar:** A summarized view of the selected scope with a high-contrast "Get Quote" button.

## 5. Interactions
- **Product Toggle:** Smooth transitions when selecting/deselecting products.
- **Conditional Visibility:** Sub-options (e.g., Mobile platforms) should appear/disappear with elegant animations (using `motion/react`).
- **Quote Summary:** Updates in real-time as the user makes selections.

## 6. Success Criteria
- The page feels significantly more "professional" than the previous version.
- Information hierarchy is clear and immediately understandable.
- Accurate and high-quality icons represent each service correctly.
- Typography is legible and adds to the "premium" brand identity.
