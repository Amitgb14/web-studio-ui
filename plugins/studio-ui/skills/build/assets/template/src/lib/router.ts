import { useSyncExternalStore } from "react"

/** Hash routes (#/bots/nvda-watch), so the Python server needs no route table. */
export function usePath() {
  return useSyncExternalStore(
    (cb) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb) },
    () => (location.hash.startsWith("#/") ? location.hash.slice(1) : "/"),
  )
}

export const href = (path: string) => `#${path}`

export function navigate(path: string) {
  if (location.hash.slice(1) !== path) location.hash = path
}

export function match(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split("/"), a = path.split("?")[0].split("/")
  if (p.length !== a.length) return null
  const out: Record<string, string> = {}
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(":")) out[p[i].slice(1)] = decodeURIComponent(a[i])
    else if (p[i] !== a[i]) return null
  }
  return out
}
