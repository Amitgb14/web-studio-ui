import { useCallback, useSyncExternalStore } from "react"

export type Theme = "light" | "dark"
const KEY = "__APP_KEY__-theme" // keep in sync with public/theme.js
const listeners = new Set<() => void>()

function read(): Theme {
  try {
    return localStorage.getItem(KEY) === "light" ? "light" : "dark"
  } catch {
    return "dark"
  }
}

/** Light or dark; dark is the designed default. Kept per browser. */
export function useTheme() {
  const theme = useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb) }, read)
  const setTheme = useCallback((t: Theme) => {
    try { localStorage.setItem(KEY, t) } catch { /* private window: not remembered */ }
    document.documentElement.classList.toggle("dark", t === "dark")
    listeners.forEach((l) => l())
  }, [])
  return { theme, setTheme }
}
