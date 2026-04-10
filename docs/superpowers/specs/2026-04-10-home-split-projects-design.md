# Home Split Projects Design

## Summary

Redesign the landing page into a responsive split-screen layout.

- Left side: existing animated presentation with the Foundation Stone Algorithms logo.
- Right side: Bezalel's message, a `Projects` heading, three placeholder project folders, and the existing `Get a Quote` button below the folders.
- Mobile: stack the same content vertically in the order above.

## Goals

- Create a clear two-side landing-page composition.
- Preserve the current animated brand feel on the visual side.
- Add a visible `Projects` showcase area using the requested `@react-bits/Folder-JS-CSS` component.
- Keep the project items as dummy placeholders for now, but structure them so they can be replaced later.

## Non-Goals

- No real project data integration.
- No changes to the `/services` route beyond keeping the existing navigation target.
- No redesign of the quote flow itself.

## Existing Context

The current home page is implemented in `src/App.tsx` as a single centered hero layout with:

- `LetterGlitch` background
- `Ripple` background overlay
- centered logo
- Bezalel quote card
- `Get a Quote` button linking to `/services`

The redesign should reuse those existing visual elements where possible instead of replacing them.

## Chosen Approach

Use a true two-column hero on desktop with responsive stacking on small screens.

### Left Panel

- Keep the animated background treatment already used on the home page.
- Keep the logo as the primary focal point.
- Center the logo within the left-side visual area.

### Right Panel

- Present content as a vertically stacked panel.
- Keep Bezalel's message near the top of the panel.
- Add a `Projects` section directly below the message.
- Render three placeholder folders inside that section.
- Keep the `Get a Quote` button below the folders.

## Alternatives Considered

### Glass Card Right Panel

This would wrap the entire right side in a heavier glassmorphism card. It was rejected because it adds unnecessary visual weight and makes the split feel less direct.

### Plain Cards Instead of Folder Component

This would be faster to implement, but it does not satisfy the requested design direction. The folder treatment is the intended visual affordance for the placeholder projects.

## Component and Data Design

### Folder Component Source

Install and use the requested component via:

`npx shadcn@latest add @react-bits/Folder-JS-CSS`

### Projects Data

Represent the placeholder projects as a small local array of three items. Each item should contain only the content needed for the first pass, such as:

- title
- optional short label or subtitle if the component presentation benefits from it

The data shape should stay simple so it can be swapped to real project content later without redesigning the page structure.

### Composition

The home screen may either:

- keep the project array inline in the landing-page component, or
- extract the projects block into a small local component if the generated folder component makes the file clearer that way

The priority is readability and low coupling, not premature abstraction.

## Layout and Responsive Behavior

### Desktop

- Use a two-column layout.
- Left column emphasizes branding and motion.
- Right column emphasizes message and navigation.
- The right panel content should have enough spacing to keep the quote, projects, and button visually distinct.

### Mobile

- Collapse to one column.
- Preserve this order:
  1. animation/logo section
  2. Bezalel message
  3. Projects section
  4. Get a Quote button

The mobile layout should avoid squeezing the folder components into an unreadable width.

## Interaction Behavior

- The folders are presentational placeholders for now.
- The `Get a Quote` button remains the primary call to action and continues linking to `/services`.

## Error Handling and Risk

- The shadcn install may add generated files or dependencies that need minor adaptation to fit the existing Vite/Tailwind setup.
- If the generated folder component has styling assumptions that conflict with the current theme, adapt the local usage and styling rather than redesigning the page structure.
- If the component is too wide for mobile by default, constrain it with the parent layout instead of removing it.

## Testing Strategy

- Verify the app builds successfully after adding the shadcn component.
- Verify the landing page renders without import or runtime errors.
- Verify the split layout works on desktop widths and stacks cleanly on small screens.
- Verify the `Get a Quote` button still navigates to `/services`.

## Implementation Notes

- Keep the home-page redesign scoped to the landing route.
- Reuse existing animation and logo assets.
- Favor small, local changes over broad refactors.
