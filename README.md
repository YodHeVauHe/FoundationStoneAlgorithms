# Foundation Stone Algorithms

Creating innovative solutions powered by artificial intelligent agents.

## Tech Stack

- **Vite** + **React 18** + **TypeScript 5**
- **Tailwind CSS** + **Radix UI** + **motion/react**
- **OpenRouter API** for AI integration
- **Vercel** for deployment (analytics + speed insights)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── main.tsx          # Entry point
├── App.tsx          # Main app with routing
├── components/     # UI components
│   ├── ui/          # Radix UI-based components
│   ├── magicui/     # Animated UI components
│   └── Folder.jsx   # Project folder visualization
├── pages/
│   └── Services.tsx # Services/quote page
└── lib/
    ├── utils.ts     # Utility functions
    └── openrouter.ts # OpenRouter API client
```

## Routes

- `/` — Home page (hero with logo, projects showcase)
- `/services` — Get a quote (AI-powered quote generator)

## Environment

Set your OpenRouter API key in `.env`:

```
VITE_OPENROUTER_API_KEY=your-key-here
```

## Deployment

Built with Vercel. Production builds go to `dist/`.

## Dark Mode

Dark mode is forced (not toggleable) — `document.documentElement.classList.add('dark')` in main.tsx.