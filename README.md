# studio-ui

A [Claude Code](https://claude.com/claude-code) skill for building operator-facing web UIs — dashboards, consoles, admin panels — from scratch, in the visual language of [Sandbox Studio](https://github.com/Amitgb14/sandbox-cli).

![Overview, dark](assets/screenshots/overview-dark.png)

| Light | Phone |
|---|---|
| ![Items, light](assets/screenshots/items-light.png) | ![Settings, phone](assets/screenshots/settings-mobile.png) |

## What you get

- **A runnable starter**: React 19, Vite, Tailwind 4, shadcn (new-york), lucide icons, Recharts, TanStack Table.
- **A design system**:
  - near-monochrome and dark-first, with an optional light mode
  - Inter and Geist Mono
  - colour reserved for status, meaning and data, with colour-blind-safe chart colours
- **The app shell**: collapsible sidebar, ⌘K command palette, light/dark switch, phone layout.
- **Building blocks**: data table (search, filters, sorting, paging), stat tiles with sparklines, status badges, empty states, key/value panels, forms, confirm dialogs.
- **Example pages**: overview, list, detail with tabs, settings form.
- **Written rules**: design, page patterns and UI wording, so Claude stays consistent as the app grows.

## Install

In Claude Code:

```
/plugin marketplace add Amitgb14/studio-ui
/plugin install studio-ui@studio-ui
```

Or from your shell: `claude plugin marketplace add Amitgb14/studio-ui && claude plugin install studio-ui@studio-ui`.

Then ask for a dashboard, console or admin panel and the skill loads on its own, or run `/studio-ui:build`. Updates arrive when you run `/plugin marketplace update studio-ui`.

## Scaffold an app yourself

The skill runs this for you. To run it by hand from a clone of this repo:

```sh
bash plugins/studio-ui/skills/build/scripts/scaffold.sh ./my-app acme "Acme Console"
cd my-app && npm install && npm run dev
```

The example pages run on sample data in `src/lib/sample-data.ts`. Replace it with calls to `api()` from `src/lib/api.ts`.

## Layout

```
.claude-plugin/marketplace.json           the marketplace (one plugin)
plugins/studio-ui/
  .claude-plugin/plugin.json              the plugin manifest
  skills/build/
    SKILL.md                              instructions Claude follows
    references/                           design-system.md, patterns.md, voice.md
    scripts/scaffold.sh                   copy the starter and fill in names
    assets/template/                      the starter app
```

## License

MIT
