# Design system

The source of truth is `assets/template/src/index.css`. This file explains how
to use it. Tailwind 4 reads the tokens through `@theme inline`, so every token
is a utility: `bg-background`, `text-muted-foreground`, `border-border`,
`text-status-critical`, `bg-caution/10`, `fill-chart-3`, etc.

## Colour

### UI chrome (the product surface)

| Token | Dark | Light | Use |
|---|---|---|---|
| `background` | #000 | #fff | page |
| `card` | #0a0a0a | #fff | cards, panels |
| `popover` | #111 | #fff | menus, dialogs, tooltips |
| `foreground` | #ededed | #0a0a0a | body text |
| `muted-foreground` | #8f8f8f | #71717a | secondary text, labels, hints |
| `muted` / `secondary` / `accent` | #141414–#1a1a1a | #f4f4f5 | hover fills, selected segments, table header tint (`bg-muted/30`) |
| `primary` | #ededed | #0a0a0a | primary buttons — it's the ink, not a brand colour |
| `border` / `input` | #1f1f1f / #262626 | #e9e9ec / #e4e4e7 | hairlines, field borders |
| `ring` | #525252 | #a1a1aa | focus rings, hover border on cards |
| `destructive` | #e66767 | #d03b3b | delete buttons, field errors |
| `sidebar*` | — | — | the sidebar only |

### Meaning words

| Token | Means | Typical use |
|---|---|---|
| `contained` | safe, inside, healthy | "live" dot, "all good" notes |
| `exposed` | unsafe, outside, down | "not answering", risky setting |
| `caution` | look at this / needs you | waiting badges, warnings, inbox count |

Pattern for a tinted chip/note: `border-caution/30 bg-caution/10 text-caution`.

### Status (reserved — never a data series)

`status-good`, `status-warning`, `status-serious`, `status-critical`,
`status-idle`, `status-running`. Use through `StatusBadge` (add new states to
its `VARIANTS` map: label + icon + classes) rather than ad hoc.

### Data visualisation

`chart-1 … chart-8` (blue, orange, aqua, yellow, magenta, green, violet, red),
stepped per theme, validated for colour-blind separation on these surfaces.
Assign in fixed order (series 1 is always `chart-1`); never cycle back to
`chart-1` for series 9 — group the tail as "Other". Chart chrome:
`viz-grid` (gridlines), `viz-axis` (axis line), `viz-muted` (tick labels),
`viz-surface`. Recharts: pass `var(--chart-1)` etc. as `fill`/`stroke`,
`isAnimationActive={false}`, horizontal gridlines only, no axis ticks lines,
11px muted tick labels, tooltip styled with `var(--popover)` + `var(--border)`.
Always give a legend or direct labels; offer a table view for anything dense.

## Typography

- Sans: **Inter Variable** with `cv11, ss01` (set on `body`). Mono: **Geist Mono Variable**.
- Page title: `text-[1.75rem] leading-tight font-medium tracking-tight` (`PageHeader`).
- Section title: `text-sm font-semibold` + `text-xs text-muted-foreground` description (`SectionHeader`).
- Body: `text-sm`. Secondary/hints: `text-xs text-muted-foreground`.
- Eyebrow / group label / table header: `font-mono text-[11px] tracking-[0.06em]–[0.08em] uppercase text-muted-foreground`.
- Big stat: `text-3xl font-semibold tracking-tight leading-none` (`MetricTile`).
- Wordmark: lowercase name + muted `·studio`, `font-semibold tracking-tight`.
- Mono for ids, paths, commands, hashes, keyboard hints (`<kbd className="font-mono text-[10px]">⌘K</kbd>`), money in tables.
- `tabular-nums` on tables (automatic via `table` in base CSS) and counts that update; proportional figures for lone numbers.

## Shape, spacing, surfaces

- Radius base `0.625rem` (`rounded-lg` cards, `rounded-md` controls/chips, `rounded-full` dots/avatars).
- Cards: `surface-sheen` (a 1px inner top highlight — the only "material" in the UI) + `border` + `bg-card`. No drop shadows.
- Content column: `mx-auto w-full max-w-6xl`, page padding `px-4 py-6 md:px-10 md:py-10`.
- Vertical rhythm: page sections `gap-6`/`gap-8`; within a card `gap-4`; field label→control `gap-1.5`.
- Grids: tiles `grid gap-3 sm:grid-cols-2 xl:grid-cols-4`; cards `sm:grid-cols-2 xl:grid-cols-3`; forms `sm:grid-cols-2` with full-width rows `sm:col-span-2`.
- Controls are compact: `h-8` inputs/buttons in toolbars, `size="sm"` buttons in headers.
- Dashed border = "nothing here yet" (empty states, add-filter buttons).

## Icons

lucide-react only. `size-3.5` inline with text/buttons, `size-4` in nav/icon
buttons, `size-5` in empty-state discs. Muted unless the icon *is* the status.

## Motion

Almost none. `transition-colors` on hover. `LiveDot` (pulse ring) or spinning
`Loader2` for live/busy state — one moving thing per view. Sidebar
slide is the only layout animation. `prefers-reduced-motion` kills all of it.

## Theme mechanics

- `public/theme.js` (loaded in `<head>`, before paint) adds `.dark` unless localStorage says light.
- `useTheme()` toggles the class and stores the choice; the sidebar footer and ⌘K both switch it.
- Dark variant: `@custom-variant dark (&:is(.dark *))` — use `dark:` sparingly; tokens already flip.
