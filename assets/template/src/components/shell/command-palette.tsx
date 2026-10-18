import { Moon, Sun } from "lucide-react"
import { useEffect, type ReactNode } from "react"

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { useTheme } from "@/hooks/use-theme"
import { NAV } from "@/lib/nav"
import { navigate } from "@/lib/router"

/** ⌘K: every screen, any extra groups the app passes (records, actions), and the theme. */
export function CommandPalette({ open, setOpen, children }: { open: boolean; setOpen: (o: boolean) => void; children?: (go: (path: string) => void) => ReactNode }) {
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(!open) }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, setOpen])
  const go = (path: string) => { setOpen(false); navigate(path) }
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Go to a screen…" />
      <CommandList>
        <CommandEmpty>Nothing matches.</CommandEmpty>
        <CommandGroup heading="Screens">
          {NAV.flatMap((g) => g.items).map((i) => (
            <CommandItem key={i.path} value={`${i.title} ${i.hint}`} onSelect={() => go(i.path)}><i.icon /><span>{i.title}</span></CommandItem>
          ))}
        </CommandGroup>
        {children?.(go)}
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem value="theme toggle light dark" onSelect={() => { setTheme(theme === "dark" ? "light" : "dark"); setOpen(false) }}>
            {theme === "dark" ? <Sun /> : <Moon />}<span>Switch to {theme === "dark" ? "light" : "dark"}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
