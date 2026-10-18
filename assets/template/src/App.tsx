import { ListChecks } from "lucide-react"
import { useState } from "react"

import { AppSidebar, Wordmark } from "@/components/shell/app-sidebar"
import { CommandPalette } from "@/components/shell/command-palette"
import { CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { match, usePath } from "@/lib/router"
import { ITEMS } from "@/lib/sample-data"
import { ItemDetailPage } from "@/pages/item-detail"
import { ItemsPage } from "@/pages/items"
import { OverviewPage } from "@/pages/overview"
import { SettingsPage } from "@/pages/settings"

function Route({ path }: { path: string }) {
  const item = match("/items/:id", path)
  if (item) return <ItemDetailPage id={item.id} />
  switch (path.split("?")[0]) {
    case "/items": return <ItemsPage />
    case "/settings": return <SettingsPage />
    default: return <OverviewPage />
  }
}

export default function App() {
  const path = usePath()
  const [palette, setPalette] = useState(false)
  const waiting = ITEMS.filter((i) => i.state === "pending").length

  return (
    <SidebarProvider>
      <AppSidebar onSearch={() => setPalette(true)} badges={{ "/items": waiting }} />
      <SidebarInset className="min-w-0">
        {/* Phones: a slim sticky bar with the menu button and wordmark. */}
        <div className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur md:hidden">
          <SidebarTrigger />
          <span className="text-sm font-semibold tracking-tight"><Wordmark /></span>
        </div>
        <main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-10">
          <div className="mx-auto w-full max-w-6xl"><Route path={path} /></div>
        </main>
      </SidebarInset>
      <CommandPalette open={palette} setOpen={setPalette}>
        {(go) => (<>
          <CommandSeparator />
          <CommandGroup heading="Items">
            {ITEMS.slice(0, 8).map((i) => (
              <CommandItem key={i.id} value={`${i.id} ${i.name}`} onSelect={() => go(`/items/${i.id}`)}>
                <ListChecks /><span className="font-mono text-xs">{i.id}</span><span className="text-muted-foreground">{i.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </>)}
      </CommandPalette>
    </SidebarProvider>
  )
}
