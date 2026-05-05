# Hackin' 4 Harden

The official website for the Annual Hackin' for Harden Memorial Golf Tournament.

## Stack

- Next.js 15 (App Router)
- React 19
- JavaScript (JSX)
- Tailwind CSS 4
- Motion (animation)
- shadcn/ui pattern for primitives

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                    # Next.js App Router (pages, layouts, route segments)
├── components/
│   ├── ui/                 # Base primitives (button, container, etc.)
│   ├── layout/             # Site chrome — header, footer
│   ├── motion/             # Motion utility wrappers
│   └── sections/           # Reusable page sections (hero, etc.)
├── lib/                    # Utilities (cn, formatting helpers)
├── hooks/                  # Custom React hooks
└── constants/              # Site config, motion variants, static data
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint with ESLint
- `npm run format` — format with Prettier
