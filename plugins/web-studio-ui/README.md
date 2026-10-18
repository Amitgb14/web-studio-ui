# Web Studio UI

Build operator-facing web apps (dashboards, consoles, admin panels and internal tools) from scratch, in a consistent, dark-first design system based on [Sandbox Studio](https://github.com/Amitgb14/sandbox-cli). Ask Claude for a dashboard or a web UI and it starts from a working, styled React app instead of a blank page, then follows the design rules as the app grows.

![Overview, dark](https://raw.githubusercontent.com/Amitgb14/web-studio-ui/main/assets/screenshots/overview-dark.png)

## What it does

The plugin adds one skill, `build` (run it as `/web-studio-ui:build`, or just ask for a dashboard, console or admin panel). With it, Claude:

- **Starts a new app** by copying a starter project into the folder you choose and filling in your app's name. The folder must be new, or hold only repository basics such as `.git`, a README, a LICENSE or `.gitignore`. Existing files are never overwritten.
- **Restyles an existing React app** by copying the theme and components it needs.
- **Follows written rules**:
  - for colour, typography, spacing and motion
  - for page layouts (overview, list, detail, forms, dialogs, and empty, loading and error states)
  - for interface wording

## What's in the starter

- **Stack:** React 19, Vite, TypeScript, Tailwind CSS 4, shadcn/ui (new-york), lucide icons, Recharts and TanStack Table.
- **Theme:** near-monochrome and dark-first, with an optional light mode, Inter and Geist Mono, and colour kept for status, meaning and charts. The chart colours are checked for colour-blind readers.
- **App shell:** a collapsible sidebar, a ⌘K command palette, a light/dark switch and a phone layout.
- **Components:** a data table (search, filters, sorting, paging), stat tiles with sparklines, status badges, empty states, key/value panels, form fields and confirm dialogs.
- **Example pages:** overview, list, detail with tabs, and a settings form, all running on sample data you replace with your own API.

## What it runs

The skill runs only on your machine, in the folder you choose:

- `scripts/scaffold.sh` copies the bundled starter files and replaces the app-name placeholders. It uses only `bash`, `find`, `grep`, `sed` and `cp`, makes no network requests, and works on macOS and Linux.
- Claude then suggests `npm install` and `npm run build` / `npm run dev` in the new project. `npm install` downloads the starter's open-source dependencies, listed in its `package.json`, from the npm registry.

The plugin collects no data and sends nothing anywhere. It has no hooks, MCP servers or background processes.

## Usage

```
/web-studio-ui:build a dashboard for our job queue in ./web
```

Or describe what you want ("an admin panel for this API, with a users list and a settings page"), and the skill loads on its own.

## License

MIT. See [LICENSE](LICENSE).
