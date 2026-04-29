# TorrentSearch Design System

This document extracts the design language from the current dark-mode React prototype and converts it into a light-mode system for future product work.

The product should still feel minimal, technical, fast, and focused. The light mode should not become playful, colorful, or marketing-heavy. It should feel like a quiet search utility: clean surfaces, crisp borders, neutral typography, compact data rows, and clear action states.

## Core Direction

TorrentSearch is a minimal torrent search interface. The UI should prioritize search, scanning, and quick evaluation of results.

Use a restrained light mode built from warm white and zinc neutrals. Keep the same high-contrast logic from the dark version, but invert the surfaces carefully:

- Dark canvas becomes soft off-white.
- Near-black panels become white or very pale zinc.
- White primary buttons become near-black primary buttons.
- Muted zinc text remains neutral, just shifted darker for readability.
- Glowing dark-mode effects become soft shadows and subtle border emphasis.
- Page backgrounds stay plain, quiet, and texture-free.

## Design Principles

1. Search is the hero.
   The homepage should place the logo, name, and search input at the visual center. Everything else supports that.

2. Keep density useful.
   Results should be compact enough to scan quickly, with metadata visible but not noisy.

3. Use quiet hierarchy.
   Prefer font weight, spacing, borders, and opacity over bright color.

4. Minimize decorative UI.
   Avoid gradients, colorful accents, large illustrations, nested cards, and busy containers.

5. Make interactive states obvious but calm.
   Focus and hover states should use border contrast, subtle background shifts, and small scale changes.

## Light Mode Color Tokens

Use these as the default light-mode palette.

```css
:root {
  --background: #fafafa;
  --foreground: #09090b;

  --surface: #ffffff;
  --surface-subtle: #f4f4f5;
  --surface-muted: #f8f8f9;
  --surface-elevated: rgba(255, 255, 255, 0.86);

  --border: #e4e4e7;
  --border-strong: #d4d4d8;
  --border-focus: #71717a;

  --text-primary: #18181b;
  --text-secondary: #3f3f46;
  --text-muted: #71717a;
  --text-faint: #a1a1aa;

  --primary: #09090b;
  --primary-hover: #27272a;
  --primary-foreground: #ffffff;

  --secondary: #ffffff;
  --secondary-hover: #f4f4f5;
  --secondary-foreground: #27272a;

  --badge-background: #f8f8f9;
  --badge-border: #e4e4e7;
  --badge-foreground: #52525b;

  --success: #15803d;
  --danger: #dc2626;

  --shadow-soft: 0 8px 30px rgba(24, 24, 27, 0.06);
  --shadow-focus: 0 0 0 4px rgba(113, 113, 122, 0.12), 0 12px 40px rgba(24, 24, 27, 0.08);

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-logo: 16px;
  --radius-pill: 999px;
}
```

### Tailwind Mapping

When translating existing dark classes:

| Dark Mode Pattern | Light Mode Replacement |
| --- | --- |
| `bg-black` | `bg-zinc-50` or `bg-[#fafafa]` |
| `bg-zinc-950` | `bg-white` |
| `bg-zinc-950/80` | `bg-white/85` |
| `bg-zinc-900` | `bg-zinc-100` |
| `bg-zinc-900/40` | `bg-zinc-100/70` |
| `border-zinc-900` | `border-zinc-200` |
| `border-zinc-800` | `border-zinc-200` |
| `border-zinc-700` | `border-zinc-300` |
| `border-zinc-600` | `border-zinc-500` |
| `text-white` | `text-zinc-950` |
| `text-zinc-300` | `text-zinc-800` |
| `text-zinc-400` | `text-zinc-600` |
| `text-zinc-500` | `text-zinc-500` |
| `text-zinc-600` | `text-zinc-400` |
| `bg-white text-black` | `bg-zinc-950 text-white` |
| `hover:bg-zinc-200` | `hover:bg-zinc-800` for primary buttons |

## Typography

The current prototype uses a clean sans-serif style with medium weights and tight tracking. Continue this direction.

Recommended stack:

```css
font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Type Scale

| Role | Size | Weight | Line Height | Notes |
| --- | ---: | ---: | ---: | --- |
| Homepage title | 40-48px | 600 | 1.1 | `tracking-tight` |
| Detail title | 24-36px | 600 | 1.15 | Allow wrapping/breaking |
| Result title | 16px | 500 | 1.4 | Truncate on listing rows |
| Body text | 14px | 400 | 1.6 | Use for descriptions |
| Metadata | 12px | 400-500 | 1.4 | Muted, icon-supported |
| Badge text | 10px | 500 | 1.2 | Uppercase, wider tracking |
| Footer/nav text | 12px | 500 | 1.4 | Muted links |

Do not use oversized display type outside the homepage hero. Results and detail views should feel operational and scan-friendly.

## Spacing

Use an 8px spacing rhythm.

| Token | Value | Usage |
| --- | ---: | --- |
| `space-1` | 4px | Tight icon/text gaps |
| `space-2` | 8px | Row gaps, metadata groups |
| `space-3` | 12px | Button/icon gaps, compact padding |
| `space-4` | 16px | Result row padding, section gaps |
| `space-6` | 24px | Header gaps, main x padding |
| `space-8` | 32px | Section spacing |
| `space-12` | 48px | Major homepage spacing |
| `space-24` | 96px | Homepage footer distance |

Preferred page width is `max-w-4xl` for results/detail and `max-w-3xl` for the homepage search composition.

## Layout System

### Page Shell

All screens should use:

- Minimum height: `min-h-screen`.
- Background: `bg-zinc-50`.
- Text: `text-zinc-950`.
- Horizontal page padding: `px-4 md:px-6`.
- Main content centered with max width.

### Header

Results and detail pages use a sticky top header:

- `sticky top-0 z-50`
- `bg-white/80 backdrop-blur-xl`
- `border-b border-zinc-200`
- `px-4 md:px-6 py-4`

Headers should feel like translucent utility bars, not heavy navigation.

### Background Treatment

Use plain, texture-free backgrounds across the app.

In light mode:

- Use `bg-zinc-50` or `#fafafa` for page backgrounds.
- Use white surfaces for inputs, headers, buttons, and panels.
- Use borders and soft shadows for depth instead of imagery.
- Do not add decorative background images, patterns, blobs, or gradients.
- Keep the interface focused on search and result scanning.

## Components

### Logo Tile

The logo tile is a rounded square containing the imported image.

Homepage:

- Size: `80px x 80px`
- Radius: `16px`
- Padding: `16px`
- Border: `1px solid var(--border)`
- Background: white
- Shadow: `var(--shadow-soft)`

Header:

- Size: `40px x 40px`
- Radius: `12px`
- Padding: `8px`
- Border: `1px solid var(--border)`
- Background: white
- Hover background: `zinc-100`

Keep the logo grayscale unless a future brand color is formally introduced.

### Search Input

The search input is the central component in the system.

Homepage search:

- Container radius: `16px`
- Background: `rgba(255, 255, 255, 0.86)`
- Backdrop blur: `xl`
- Border: `zinc-200`
- Shadow: soft by default
- Padding: input `py-5 px-4`
- Icon padding left: `pl-5`
- Text size: `16px`, `18px` on medium screens

Focused state:

- Border: `zinc-500`
- Shadow: `var(--shadow-focus)`
- Scale: `1.01`
- Search icon shifts from `text-zinc-500` to `text-zinc-700`

Results header search:

- Container radius: `12px`
- Width: full on mobile, `480px` on desktop
- Background: white
- Border: `zinc-200`, focus `zinc-500`
- Input padding: `py-2 px-3`
- Text size: `14px`

Keyboard shortcut hint:

- Use `Command` icon plus `K`
- Color: `text-zinc-400`
- Text size: `10-11px`
- It should be visually quiet.

### Buttons

Primary button:

- Background: `zinc-950`
- Text: white
- Radius: pill on homepage, `8px` on detail pages
- Hover: `zinc-800`
- Active: `scale-95`
- Font: `14px`, weight `500-600`

Secondary button:

- Background: white
- Text: `zinc-700`
- Border: `zinc-200`
- Hover background: `zinc-100`
- Hover text: `zinc-950`
- Icons: `zinc-500`, hover `zinc-800`

Icon-only action button:

- Padding: `10px`
- Radius: `8px`
- Background: white
- Border: `zinc-200`
- Text: `zinc-500`
- Hover: text `zinc-950`, border `zinc-400`, background `zinc-100`

### Badges

Badges identify torrent type.

- Text: `10px`
- Weight: `500`
- Uppercase
- Tracking: wider
- Padding: `2px 8px`
- Radius: `6px`
- Background: `zinc-50`
- Border: `zinc-200`
- Text: `zinc-600`

Avoid category colors unless the product later needs strong category scanning.

### Result Rows

Result rows should not look like heavy cards. They are interactive rows with soft hover treatment.

Default:

- Padding: `16px`
- Radius: `12px`
- Border: transparent
- Background: transparent

Hover:

- Border: `zinc-200`
- Background: `white`
- Optional shadow: `0 4px 18px rgba(24, 24, 27, 0.04)`
- Title changes from `zinc-700` to `zinc-950`
- Download action fades in on desktop

Metadata:

- Type badge first
- Date with clock icon
- File size with hard-drive icon
- Seeders and leechers aligned with stable widths

Use fixed widths for metric clusters so rows do not jitter.

### Detail Panels

Detail sections use light panels with subtle borders.

- Padding: `16px` for content sections, `20px` for sidebar stats
- Radius: `12px`
- Border: `zinc-200`
- Background: `white`
- Text: `zinc-700`

File list rows:

- Padding: `12px`
- Border between rows: `zinc-200/70`
- Hover background: `zinc-50`
- File names truncate
- Size text stays fixed on the right

Info hash:

- Use monospace
- Background: `zinc-50`
- Border: `zinc-200`
- Text: `zinc-600`
- Break long text safely.

## Iconography

Use `lucide-react` icons consistently.

Current icon set:

- `Search` for search fields
- `Command` for keyboard shortcut hints
- `Sparkles` for lucky/random action
- `Filter` for result filtering
- `Clock` for age/date
- `HardDrive` for size
- `Download` for torrent download
- `Magnet` for magnet links
- `Cloud` for Real Debrid action
- `ArrowLeft` for back navigation
- `File`, `Server`, `Hash`, `User` for detail metadata

Icon sizes:

- 12px for tiny metadata
- 14px for compact controls
- 16px for row actions and back links
- 18px for main detail actions
- 20px for homepage search

Icons should usually be muted until hover or focus.

## Motion

The current UI uses `motion/react` with soft entrance animations.

Motion rules:

- Use small movement only: `y: 10-20px`
- Fade from `opacity: 0` to `1`
- Use the existing easing curve: `[0.16, 1, 0.3, 1]`
- Homepage entrance duration: `0.7-0.8s`
- Result rows stagger: `idx * 0.05`
- Search focus scale: `1.01`
- Button active scale: `0.95`

Do not animate layout-heavy elements in ways that slow scanning.

## Screen Patterns

### Homepage

Purpose: make search feel immediate.

Structure:

1. Full-screen centered shell.
2. Plain off-white background.
3. Logo tile.
4. Product name: `TorrentSearch`.
5. Short subtitle: `The minimal search engine`.
6. Large search input.
7. Primary and secondary actions.
8. Muted footer links.

Light-mode homepage notes:

- Background should be `zinc-50`.
- Replace the dark ambient glow with a soft white/elevated search area shadow.
- Primary action should be dark.
- Secondary action should be white with a border.
- Footer links should be `zinc-500`, hover `zinc-950`.

### Results Page

Purpose: support fast scanning and selection.

Structure:

1. Sticky header with logo button and compact search.
2. Optional filters button on desktop.
3. Results summary row.
4. Operational status indicator.
5. Result row list.

Light-mode notes:

- Header background: `white/80`.
- Page background: `zinc-50`.
- Result rows stay mostly unframed until hover.
- Summary text: `zinc-500`; query emphasis: `zinc-800`.
- Status dot: use muted green only if needed, otherwise zinc is fine.

### Detail Page

Purpose: provide confidence and clear download actions.

Structure:

1. Sticky header with back link.
2. Metadata row.
3. Large torrent title.
4. Action button row.
5. Main content grid: description/file list + stats/hash sidebar.

Light-mode notes:

- Primary `Magnet Link` button is dark.
- Secondary actions are white bordered buttons.
- Divider below actions uses `zinc-200`.
- Panels use white background and subtle borders.
- Sidebar stats should stay compact and readable.

## Accessibility

Minimum standards:

- Body text must meet WCAG AA contrast.
- Focus states must be visible without relying on color alone.
- Interactive controls need clear hover and focus treatment.
- Icon-only buttons require accessible labels or titles.
- Do not hide download actions only on hover for keyboard users; use `focus:opacity-100`.
- Keep hit targets at least `40px x 40px` where practical.
- Preserve keyboard shortcut behavior for `Cmd/Ctrl + K`.

## Implementation Notes

Prefer updating the app toward semantic tokens instead of scattering raw zinc classes forever. The current prototype uses Tailwind utility classes directly, which is fine for speed, but shared primitives should eventually use tokens from `theme.css`.

Recommended next implementation steps:

1. Add light-mode CSS variables to `src/styles/theme.css`.
2. Convert page-level dark classes to the light-mode mapping above.
3. Keep `motion/react`, `lucide-react`, and the existing component structure.
4. Reuse shadcn-style UI primitives where they help, but avoid making simple result rows into heavy cards.
5. Test homepage, results, and detail pages at mobile and desktop widths.

## Do Not Do

- Do not introduce bright accent colors casually.
- Do not use large gradient backgrounds.
- Do not turn result rows into bulky nested cards.
- Do not make the homepage a marketing landing page.
- Do not use heavy shadows everywhere.
- Do not reduce data density on the results page.
- Do not rely on color alone for seed/leech meaning.
- Do not use background images or decorative textures.

## Quick Reference

The system in one sentence:

> A minimal, light, zinc-neutral search utility with crisp borders, compact rows, muted metadata, dark primary actions, subtle motion, and a strong focus on search-first workflows.
