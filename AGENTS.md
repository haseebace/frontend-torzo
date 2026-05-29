# Project Agent Rules

Be helpful and concise, but do not run validation or external tooling unless the user explicitly asks for it.

## Browser Testing

- Do not use any browser automation unless the user explicitly asks for browser testing or visual verification.
- When browser automation is requested, use the local skill at `~/.agents/skills/agent-browser`.
- Prefer `agent-browser` over the internal Codex/browser automation tools for this project.
- Before running `agent-browser`, load its current workflow with:

```bash
agent-browser skills get core
```

## Git And GitHub

- Never run GitHub commands or use GitHub integrations unless the user explicitly asks.
- Do not create commits, branches, pushes, pull requests, or GitHub comments unless requsted

## Project Structure

**Tech Stack:**

- Next.js 16.2.4 (App Router)
- React 19.2.4
- TypeScript 5
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Framer Motion 12.39.0
- shadcn/ui 4.5.0
- Radix UI 1.4.3
- Lucide React icons

**Font:**

- Plus Jakarta Sans (only font used site-wide)
- No other fonts (Sora removed)

**Pages:**

- `/` — Homepage with search
- `/results` — Search results with pagination
- `/detail` — Torrent detail page
- `/manage` — TorBox account management
- `/how-to-use` — Guide page
- `/privacy` — Privacy policy
- `/terms` — Terms of service
- `/dmca` — DMCA notice
- `/disclaimer` — Disclaimer

**Key Components:**

- `src/components/ui/*` — shadcn/ui primitives (button, input, badge, card, checkbox, select, skeleton, collapsible)
- `src/components/site-navbar.tsx` — Site navigation
- `src/components/site-footer.tsx` — Site footer
- `src/components/search-form.tsx` — Hero search with TMDB autocomplete + keyboard navigation
- `src/components/home-content.tsx` — Homepage hero section
- `src/components/torrent-result-card.tsx` — Result listing cards
- `src/components/torrent/torrent-actions.tsx` — Detail page action buttons
- `src/components/torrent/torrent-file-list.tsx` — File list with SharedHoverBackground
- `src/components/torrent/torrent-size-badge.tsx` — Size display badge
- `src/components/manage-account-form.tsx` — TorBox connection form
- `src/components/animated-menu-toggle.tsx` — Mobile menu button

**Custom Reusable Components:**

- `src/components/ui/shared-hover-background.tsx` — Magnetic hover effect using Framer Motion layoutId

## Styling Conventions

**Design System:**

- All colors controlled via `globals.css` semantic tokens
- Only color tokens in `:root` + `.dark` — no layout/spacing tokens
- Use Tailwind utilities for padding, spacing, shadows, radius
- Single font: Plus Jakarta Sans (via `--font-sans`)

**Standard Padding:**

- Mobile: `px-4` (16px)
- Desktop: `md:px-12` (48px)
- Applied consistently across all pages, navbar, and footer

**Color Palette:**

- Light mode: `--p-background: #FCFDFE`, `--p-card: #F8F9FA`, `--p-secondary: #F0F2F4`, `--p-muted: #79818D`, `--p-primary: #3C424A`
- Dark mode: `--p-background: #0B0C0E`, `--p-card: #131416`, `--p-secondary: #1E2023`, `--p-muted: #71767D`, `--p-primary: #E8EAED`

**Shadows:**

- Use `shadow-sm` everywhere (replaced all `shadow-md`, `shadow-lg`, `shadow-xl`)

**Input Styling:**

- Default: `border-0` (no border)
- Focus: `border-4 border-secondary` (4px secondary border)
- No ring/outline on focus

**Badge Styling:**

- `py-1.5` (6px Y padding)
- `px-3.5` (14px X padding)
- `rounded-full` pill shape
- Use `Badge` component everywhere (no hand-built badge styles)

## Animation

- Homepage enter: `animate-homepage-enter` — 3s `cubic-bezier(0.56, 0.01, 0, 1.22)`
- Page fade: `animate-page-fade-in` — 1000ms ease-out
- Magnetic hover: SharedHoverBackground component with Framer Motion `layoutId`
- Default spring: `stiffness: 350, damping: 30`

## Important Notes

- No `font-mono` anywhere (removed from size badge, info hash)
- No `tabular-nums` (removed from torrent-size-badge)
- No custom CSS variables for layout/sizing in globals.css (only colors)
- `Badge` component handles `asChild` carefully (Slot.Root requires single child)
- Search form has keyboard navigation (↑/↓/Enter/Escape) for suggestions
- Dark mode uses `.dark` class on `<html>` with palette overrides

## graphify

**Primary tool for codebase exploration and understanding.**

Use graphify instead of grep or reading raw files for architecture questions, relationships between components, and overall project structure.

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- ALWAYS read graphify-out/GRAPH_REPORT.md before reading any source files, running grep/glob searches, or answering codebase questions. The graph is your primary map of the codebase.
- IF graphify-out/wiki/index.md EXISTS, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
