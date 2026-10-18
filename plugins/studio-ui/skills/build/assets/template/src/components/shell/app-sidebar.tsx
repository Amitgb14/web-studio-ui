import { Moon, PanelLeftClose, PanelLeftOpen, Search, Sun } from "lucide-react"

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuBadge,
  SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarSeparator, useSidebar,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/hooks/use-theme"
import { isActive, NAV } from "@/lib/nav"
import { href, usePath } from "@/lib/router"
import { cn } from "@/lib/utils"

/**
 * The only chrome: a wordmark, search, the screens, and at the foot the
 * connection state and light/dark. Badges only for a number somebody acts on.
 */
export function AppSidebar({ onSearch, badges = {}, connected = true }: {
  onSearch: () => void; badges?: Record<string, number>; connected?: boolean
}) {
  const path = usePath()
  const { state, isMobile, toggleSidebar, setOpenMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className={cn("gap-3 pt-4", collapsed ? "items-center px-2" : "px-3")}>
        {collapsed ? (
          <IconButton label="Expand the sidebar (⌘B)" onClick={toggleSidebar}><PanelLeftOpen /></IconButton>
        ) : (
          <div className="flex items-center gap-1">
            <a href={href("/")} className="min-w-0 flex-1 truncate px-2 text-[1.05rem] font-semibold tracking-tight">
              <Wordmark />
            </a>
            {!isMobile && <IconButton label="Collapse the sidebar (⌘B)" onClick={toggleSidebar}><PanelLeftClose /></IconButton>}
          </div>
        )}
        {collapsed ? (
          <IconButton label="Search (⌘K)" onClick={onSearch} bordered><Search /></IconButton>
        ) : (
          <button type="button" onClick={onSearch}
            className="flex h-8 items-center gap-2 rounded-md border bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <Search className="size-3.5" />Search<kbd className="ml-auto font-mono text-[10px]">⌘K</kbd>
          </button>
        )}
      </SidebarHeader>

      <SidebarContent className={cn("overflow-x-hidden", collapsed ? "px-0" : "px-1")}>
        {NAV.map((group, i) => (
          <div key={group.label}>
            {i > 0 && <SidebarSeparator className="mx-3 data-[orientation=horizontal]:w-auto" />}
            <SidebarGroup className="py-1.5">
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const n = badges[item.path] ?? 0
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton asChild isActive={isActive(item, path)} tooltip={n ? `${item.title} · ${n}` : item.title}
                          className="relative h-8 text-muted-foreground hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-foreground">
                          <a href={href(item.path)} onClick={() => setOpenMobile(false)}>
                            <item.icon />
                            <span>{item.title}</span>
                            {collapsed && n > 0 ? <span aria-hidden className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-caution" /> : null}
                          </a>
                        </SidebarMenuButton>
                        {n > 0 && <SidebarMenuBadge className="rounded-sm bg-caution/15 text-caution tabular-nums">{n}</SidebarMenuBadge>}
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className={cn("gap-3 pb-4", collapsed ? "items-center px-2" : "px-3")}>
        <Connection ok={connected} compact={collapsed} />
        <ThemeSwitch compact={collapsed} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

/** Lowercase name, a muted middle-dot suffix: "acme·studio". */
export const Wordmark = () => <>__APP_KEY__<span className="text-muted-foreground">·studio</span></>

function IconButton({ label, onClick, bordered, children }: { label: string; onClick: () => void; bordered?: boolean; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label={label} onClick={onClick}
          className={cn("flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground [&>svg]:size-4",
            bordered && "border bg-background")}>{children}</button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

function Connection({ ok, compact }: { ok: boolean; compact?: boolean }) {
  const label = ok ? "server · live" : "server · not answering"
  const dot = <span className={cn("size-1.5 rounded-full", ok ? "bg-contained" : "bg-exposed")} />
  if (compact) return <div className="flex size-8 items-center justify-center" role="img" aria-label={label} title={label}>{dot}</div>
  return (
    <div className="flex items-center gap-2 px-1 text-xs">
      {dot}<span className={cn("truncate font-mono", ok ? "text-muted-foreground" : "text-exposed")}>{label}</span>
    </div>
  )
}

function ThemeSwitch({ compact }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme()
  const opts = [{ id: "light", label: "Light", icon: Sun }, { id: "dark", label: "Dark", icon: Moon }] as const
  if (compact) {
    const next = theme === "dark" ? "light" : "dark"
    const Icon = theme === "dark" ? Moon : Sun
    return <IconButton label={`Theme: ${theme}. Switch to ${next}`} onClick={() => setTheme(next)} bordered><Icon /></IconButton>
  }
  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-2 rounded-md border bg-background p-0.5">
      {opts.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={theme === o.id} onClick={() => setTheme(o.id)}
          className={cn("flex items-center justify-center gap-1.5 rounded px-2 py-1 text-xs transition-colors",
            theme === o.id ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}>
          <o.icon className="size-3.5" />{o.label}
        </button>
      ))}
    </div>
  )
}
