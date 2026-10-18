---
name: studio-ui
description: Build a web UI from scratch (or restyle one) in the Sandbox Studio / Fleet dashboard design system — React 19 + Vite + Tailwind 4 + shadcn (new-york), near-monochrome dark-first theme, Inter + Geist Mono, collapsible sidebar shell, ⌘K palette, data tables, metric tiles, status badges. Use when the user asks for a dashboard, admin panel, console, control plane or internal tool UI, or says "studio style", "like Sandbox Studio", "like the fleet dashboard".
---

# Studio UI

A reusable recipe for operator-facing web apps (dashboards, consoles, admin
tools) in the visual language of Sandbox Studio and the Fleet dashboard. It
ships a runnable starter so a new UI starts from working, styled code instead
of a blank page.

## What's in this skill

| Path | What it is |
|---|---|
| `scripts/scaffold.sh <dir> <app-key> ["Title"]` | Copies the starter into an empty dir and fills in names |
| `assets/template/` | The starter: Vite config, theme CSS, 25+ shadcn components, sidebar shell, ⌘K palette, data table, example pages |
| `references/design-system.md` | Tokens, colour rules, typography, spacing, motion. **Read before styling anything.** |
| `references/patterns.md` | Page recipes (list, detail, form, overview, dialogs, empty/loading/error) with the exact classes |
| `references/voice.md` | How the UI talks: labels, empty states, errors, confirmations |

## Workflow

1. **Decide the target.**
   - New app → scaffold: `bash ~/.claude/skills/studio-ui/scripts/scaffold.sh <dir> <app-key> "<Title>"`, then `cd <dir> && npm install`.
   - Existing React/Tailwind 4 app → copy `assets/template/src/index.css` (tokens), `src/components/{ui,common,data-table,shell}`, `src/lib/{utils,router,format,api}.ts`, `src/hooks/*`, `public/theme.js`; add the deps from `assets/template/package.json`. Keep the app's own router if it has one (replace `href`/`navigate`/`usePath`).
   - Not React (Next.js is fine: it's React — drop `vite.config.ts`/`index.html`, put the CSS in `app/globals.css`, load `theme.js` with `<Script strategy="beforeInteractive">`, mark interactive components `"use client"`).
2. **Read `references/design-system.md` and `references/patterns.md`.** They are short. Follow them rather than inventing new styles.
3. **Shape the app**:
   - Screens go in `src/lib/nav.ts` (groups of `{title, path, icon, hint}`); routes in `App.tsx`'s `Route`.
   - One file per screen in `src/pages/`. Domain components in `src/components/<domain>/`.
   - Data: `api<T>(url, body?)` from `src/lib/api.ts`. Replace `src/lib/sample-data.ts` with real calls; delete it when done.
   - Rename the example pages (`items`, `item-detail`, `settings`) to the real nouns or delete them.
4. **Build and check**: `npm run build` (runs `tsc -b`, must be clean). Then look at it — `npm run dev` — in **both themes and at phone width (375px)**. If a browser tool is available (Playwright, Chrome MCP), screenshot dark + light + mobile and fix what's off before reporting done.
5. **Before finishing**, run the checklist below.

## Non-negotiables

- **Dark is the default and designed mode.** Light is a choice, stored per browser (`<app>-theme` in localStorage), applied before first paint by `public/theme.js`.
- **Colour means something or it isn't there.** Chrome is near-monochrome ink on neutral. `--primary` is ink, not a brand colour. Colour is reserved for status (`status-*`), meaning (`contained` = safe/ok, `exposed` = unsafe/down, `caution` = needs you), and data (`chart-1…8`, in fixed order, never cycled, never used for status).
- **Never colour alone.** Every status carries an icon and a word (`StatusBadge`). Charts ship a legend or direct labels.
- **Use the tokens**, never raw hex or Tailwind palette colours (`bg-zinc-800`, `text-green-500`) in components. If a colour isn't a token, it doesn't belong.
- **Absent ≠ zero.** Unknown values render `—` (`DASH`) with a reason, never `0`.
- **Mono for machine things**: ids, hashes, paths, commands, money in tables, table headers (uppercase, tracked). Inter for everything people read.
- **Tabular figures** in tables and aligned columns; proportional for standalone big numbers.
- **One moving thing**: `LiveDot` or a spinning `Loader2` for live state; nothing else animates. Respect `prefers-reduced-motion` (already in the CSS).
- **Phone width works**: 16px gutter (`px-4`), no horizontal page scroll, tables scroll inside their own container, sidebar becomes a sheet (built in).
- **Accessible by default**: real `<button>`/`<a>`, `aria-label` on icon-only buttons, labelled form controls, visible focus (`ring` token), `role="radiogroup"` for segmented controls.

## Checklist before saying done

- [ ] `npm run build` clean (no TS errors, no unused imports)
- [ ] Looks right in dark **and** light; no hard-coded colours (`grep -rnE "#[0-9a-fA-F]{3,6}|(bg|text|border)-(red|green|blue|zinc|gray|slate)-[0-9]" src --include=*.tsx` → nothing outside `components/ui`)
- [ ] 375px wide: no sideways scroll, actions reachable, long names truncate
- [ ] Every list has an empty state that says why it's empty and what to do
- [ ] Every async action: disabled + spinner while busy, toast on success, toast with the server's message on failure
- [ ] Destructive actions confirm in a dialog that names the thing and says what's lost
- [ ] Loading uses `Skeleton` shaped like the content, not a page spinner
- [ ] Sample data removed or clearly marked
