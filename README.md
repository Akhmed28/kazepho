# KazEPhO — Frontend

Kazakhstan Experimental Physics Olympiad website frontend.

## Stack
- **React 18** + **TypeScript** + **Vite**
- **React Router v6** — client-side routing
- **KaTeX** — LaTeX math rendering
- **Lucide React** — icons
- **CSS Modules** — scoped styling, no extra CSS-in-JS

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx / .module.css     # Sticky nav with auth
│   │   ├── Footer.tsx / .module.css     # Site footer
│   │   └── Layout.tsx                   # Route wrapper
│   ├── ui/
│   │   ├── ProblemCard.tsx / .module.css  # Problem list card
│   │   ├── FilterBar.tsx / .module.css   # Filtering & search
│   │   ├── Badge.tsx / .module.css       # Olympiad/grade badges
│   │   └── LatexRenderer.tsx             # KaTeX renderer
│   └── editor/
│       └── LatexEditor.tsx / .module.css # Edit/Preview LaTeX editor
├── context/
│   └── AuthContext.tsx      # Simple password auth
├── data/
│   └── mockProblems.ts      # Sample problem data
├── pages/
│   ├── Home.tsx / .module.css           # Landing page
│   ├── Problems.tsx / .module.css       # Filterable problem list
│   ├── ProblemDetail.tsx / .module.css  # Full problem + solution
│   ├── AddProblem.tsx / .module.css     # Add/edit form (admin)
│   └── Login.tsx / .module.css         # Admin login
├── types/
│   └── index.ts             # TypeScript types
├── App.tsx                  # Router setup
├── main.tsx                 # Entry point
└── index.css                # Global styles + CSS variables
```

## Admin Access
- Navigate to `/login`
- Demo password: `kazepho2024`
- Admins can add problems, edit problems, and delete problems

## Adding Real Problems
Replace or extend `src/data/mockProblems.ts` with real problem data. When a backend is added, swap the data imports with API calls.

## LaTeX Usage
- Inline math: `$F = ma$`
- Display math: `$$E = mc^2$$`
- Bold: `**text**`
