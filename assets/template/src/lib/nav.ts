import { LayoutDashboard, ListChecks, Settings, type LucideIcon } from "lucide-react"

/** The screens, grouped. `hint` holds extra words the ⌘K palette matches on. */
export interface NavItem { title: string; path: string; icon: LucideIcon; hint: string }

export const NAV: { label: string; items: NavItem[] }[] = [
  { label: "main", items: [
    { title: "Overview", path: "/", icon: LayoutDashboard, hint: "home summary" },
    { title: "Items", path: "/items", icon: ListChecks, hint: "list table" },
  ] },
  { label: "admin", items: [
    { title: "Settings", path: "/settings", icon: Settings, hint: "preferences config" },
  ] },
]

export const isActive = (item: NavItem, path: string) => (item.path === "/" ? path === "/" : path === item.path || path.startsWith(item.path + "/"))
