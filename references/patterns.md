# Patterns

Every pattern here exists as working code in `assets/template/src`. Copy from
there; this file says which to reach for and why.

## App shell (`App.tsx`, `components/shell/`)

- `SidebarProvider` → `AppSidebar` + `SidebarInset` → sticky mobile bar (`md:hidden`, menu trigger + wordmark) → `<main>` with the content column.
- Sidebar: wordmark + collapse button, a search button that opens ⌘K, nav groups from `lib/nav.ts` separated by hairlines, footer with connection state and a Light/Dark segmented control. Collapses to icons (⌘B); becomes a sheet on phones.
- Badges on nav items only for a number someone acts on (`badges={{"/inbox": 3}}` → caution chip).
- ⌘K (`CommandPalette`): all screens (matching on `hint` words), extra groups passed as children (records, "Create …" actions), theme toggle.
- Routing: hash routes (`#/items/42`) via `lib/router.ts` (`usePath`, `href`, `navigate`, `match`) so any static server can host `dist/`. Swap for react-router/TanStack Router only if the app already uses one.

## Page skeleton

```tsx
<div className="flex flex-col gap-6">
  <PageHeader title="Items" description="One sentence on what this screen is for."
    actions={<Button size="sm"><Plus className="size-3.5" />New item</Button>} />
  {/* tiles / table / cards */}
</div>
```

## Overview / dashboard (`pages/overview.tsx`)

1. Row of `MetricTile`s (3–4): label, value, optional icon, `footer` with context ("waiting for a decision"), optional `spark`. `value={null}` + `absentReason` when unknown.
2. "Needs you" list first — the thing the operator acts on — then context (charts, recent activity).
3. Charts in a `Panel` with a `SectionHeader`; heights fixed (`h-48`) so nothing jumps.

## List (`pages/items.tsx` + `components/data-table/data-table.tsx`)

`DataTable` = search box, faceted filters with live counts, sortable mono
uppercase headers (`ColumnHeader`), View menu (hide columns), pagination
(only when rows > page size), row click → detail. Columns:

- First column: name (`text-sm font-medium`, truncate) over id (`font-mono text-xs text-muted-foreground`).
- State: `<StatusBadge outcome=… size="sm" />`, with `filterFn: facetFilter` for faceting.
- Numbers/money: `font-mono text-xs`. Times: relative (`ago`) in `text-xs text-muted-foreground`, absolute in a tooltip/title.
- Row actions: buttons inside a row are ignored by the row click (the table checks `closest("a,button,…")`).
- Narrow screens: keep ≤ 5 visible columns; secondary ones `enableHiding` and truncate with `max-w-60 truncate`.

For small fixed lists inside a card use `MiniTable`.

## Detail (`pages/item-detail.tsx`)

- Back link (`ArrowLeft`, `text-xs text-muted-foreground`) above the header.
- `PageHeader` title = name + `StatusBadge`; description = mono id; actions = the primary verb ("Run now").
- A failure/attention banner (`Note tone="warn"`) right under the header, saying what happened and what to do.
- `Tabs` (Overview / History / Settings …), `mt-4` content. Overview = tiles + `Panel` with `KV` facts.
- Danger zone last, in Settings: `Panel` with `border-destructive/30`, title + consequence + destructive button → confirm dialog.

## Forms (`pages/settings.tsx`, `components/common/panel.tsx` `Field`)

- Group fields in a `Panel` with a `SectionHeader`; `grid gap-4 sm:grid-cols-2`.
- `Field` = small muted label, control, hint. Errors replace the hint in `text-destructive`; set `aria-invalid`.
- Toggles as a row: title + one-line explanation on the left, `Switch` on the right, separated by `border-t pt-4`.
- Choices of 2–4 with explanations: selectable cards (`role="radio"`, `aria-checked`, selected = `border-foreground/50 bg-muted/40`). Short choices: segmented control (see `ThemeSwitch`). Longer lists: `Select`.
- Sensible defaults pre-filled; optional fields say "Optional." in the placeholder or hint.
- Submit bar right-aligned: Cancel (outline) + primary. Primary disabled when invalid or busy; shows `Loader2 animate-spin` while busy.
- After save: `toast.success("… saved")`; on error `toast.error(err.message)` with the server's text.

A helper worth keeping in App when actions are common:

```ts
const act = async <T,>(url: string, body: unknown, ok: string | ((o: T) => string)) => {
  try { const out = await api<T>(url, body); toast.success(typeof ok === "function" ? ok(out) : ok); await refresh(); return out }
  catch (e) { toast.error((e as Error).message); return null }
}
```

## Dialogs and sheets

- `Dialog` (`sm:max-w-md`/`lg`) for confirms and short tasks: title names the thing (`Delete <span className="font-mono">id</span>?`), description says the consequence, footer Cancel + action.
- `Sheet` (side panel) for inspecting a record without leaving the list (logs, a run's steps).
- Segmented "When: Now / Later / Repeat" pattern for actions that can be scheduled.

## States

- **Loading**: `Skeleton`s shaped like the content (`h-9 w-48` title, `h-28` tiles, `h-64` table). No full-page spinners.
- **Empty**: `EmptyState` — icon disc, title that says *why* ("No items match"), description with what to do, optional action ("Show all" / "Create item").
- **Error**: a gate in the content area (dashed card like `EmptyState`) with a plain reason — distinguish 401 "Sign in" from "server isn't answering". Inline errors via `Note tone="warn"`.
- **Live**: `LiveDot` next to "live now"; `StatusBadge` `running` spins its icon.

## Charts

Recharts with tokens (see design-system.md). Small context charts (sparklines) have no axes or tooltip. Real charts: legend/direct labels, `viz-*` chrome, fixed series order, a table toggle for dense data. Donut/bar/area cover almost everything; avoid pies with > 6 slices.

## Responsive

- Breakpoints: `sm` 640, `md` 768 (sidebar ↔ sheet), `lg` 1024, `xl` 1280.
- Toolbars `flex flex-wrap gap-2`; search `w-full sm:w-72`.
- Header actions wrap under the title (built into `PageHeader`).
- Toggle groups wrap with `spacing={1}` so they don't look jagged.
