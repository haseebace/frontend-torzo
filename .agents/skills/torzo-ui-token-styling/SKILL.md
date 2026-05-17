---
name: torzo-ui-token-styling
description: Use when changing Torzo frontend UI styling, colors, radii, spacing, shadows, Tailwind classes, shadcn primitives, visual polish, or page/component appearance under src/.
---

# Torzo UI Token Styling

## Core Rule

Treat `src/app/globals.css` as the main UI control panel. Before editing scattered component classes, check whether the value should be controlled by a semantic token.

This skill is for styling work only. Do not change routes, data fetching, API calls, form logic, or component APIs unless the user asks for behavior changes.

## Workflow

1. Read `src/app/globals.css` first.
2. Reuse existing shadcn tokens where they fit: `--background`, `--foreground`, `--card`, `--primary`, `--border`, `--muted`, `--destructive`, `--ring`.
3. Reuse app-level semantic tokens for repeated styling:
   - Surfaces: `surface`, `surface-elevated`, `surface-subtle`, `surface-hover`, `surface-badge`
   - Text: `foreground-strong`, `foreground-muted`, `text-subtle`, `text-soft`
   - Status/action: `link`, `success`, `focus`, `inverse`
   - Shape/space/shadow: `rounded-control`, `rounded-card`, `rounded-pill`, `shadow-ui-card`, `shadow-ui-button`, `shadow-ui-input-*`
4. If a repeated value is missing, add a semantic variable in `:root`, add a dark-mode value when relevant, and expose it in `@theme inline`.
5. Update shared primitives first, then pages:
   - First: `src/components/ui/*`
   - Then: `src/components/*`
   - Last: `src/app/**`

## Tailwind Class Preference

Prefer semantic utilities:

```tsx
className="bg-card border-border text-foreground shadow-ui-card rounded-card"
className="bg-primary text-primary-foreground hover:bg-foreground-strong rounded-control"
className="text-muted-foreground"
className="text-success"
```

Avoid repeated raw palette utilities in app UI:

```tsx
className="bg-white text-zinc-950 border-zinc-200"
className="bg-zinc-950 text-white"
className="text-zinc-500"
className="text-red-600"
```

One-off layout values are okay when they are truly specific: responsive widths, grid tracks, hero type sizes, and unique positioning do not need tokens.

## Verification

After styling edits, run:

```bash
rg -n "(bg-(black|white|slate|gray|zinc|neutral|stone)|text-(black|white|slate|gray|zinc|neutral|stone|red|blue|emerald)|border-(black|white|slate|gray|zinc|neutral|stone)|divide-(black|white|slate|gray|zinc|neutral|stone)|ring-zinc|from-white|via-white|to-white|bg-\\[|shadow-\\[|ease-\\[cubic|rounded-full|rounded-(xl|lg))" src --glob '*.{ts,tsx,css}'
npm run lint
npm run build
graphify update .
```

Smoke-check the touched routes in the browser. For broad UI work, include `/`, `/results?q=ubuntu`, `/manage`, `/privacy`, `/terms`, `/dmca`, and `/disclaimer`.

## Common Mistakes

- Do not create tokens named after colors like `--black` or `--zinc-950`; use semantic names like `--primary`, `--foreground-strong`, or `--inverse`.
- Do not replace every pixel value with a variable. Tokenize repeated design decisions, not unique layout details.
- Do not bypass `globals.css` by adding new hardcoded palettes in components.
- Do not remove shadcn token compatibility; existing primitives rely on it.
