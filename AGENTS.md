# AGENTS.md

## Developer Commands

```bash
npm run dev      # Start dev server
npm run build   # Typecheck + build (tsc -b && vite build)
npm run lint    # Run ESLint
npm run preview # Preview production build
```

## Project Structure

- **Entry point**: `src/main.tsx` → `src/App.tsx`
- **Routing**: React Router (BrowserRouter in App.tsx)
- **Routes**: `/` (home), `/services` (Services page)
- **Components**: `src/components/` (ui/, magicui/, Folder.jsx)
- **Pages**: `src/pages/Services.tsx`

## Tech Stack

- Vite + React 18 + TypeScript 5
- Tailwind CSS + Radix UI + motion/react
- OpenRouter API (set `VITE_OPENROUTER_API_KEY` in `.env`)
- Vercel (analytics, speed insights)

## Path Aliases

`@/*` maps to `./src/*`

## Deployment

Vercel configured in `vercel.json`. Production builds go to `dist/`.

## Environment

- `.env` contains `VITE_OPENROUTER_API_KEY`
- `.env.example` is the template (may contain placeholder key)

## Dark Mode

Forced dark mode: `document.documentElement.classList.add('dark')` in main.tsx.