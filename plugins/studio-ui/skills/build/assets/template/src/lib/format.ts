/** Shown for a value that is absent. Never show 0 for "unknown". */
export const DASH = "—"

export const pluralize = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

export const human = (s: string) => s.replace(/_/g, " ")

export const usd = (n: number | null | undefined, digits = 2) =>
  n == null ? DASH : "$" + Number(n).toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })

/** Unix seconds → "Oct 16, 09:30". */
export const fmtTime = (t: number | null | undefined) =>
  t ? new Date(t * 1000).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : DASH

/** Unix seconds → "5m ago". */
export function ago(t: number | null | undefined) {
  if (!t) return "never"
  const x = Date.now() / 1000 - t
  if (x < 60) return "just now"
  if (x < 3600) return `${Math.round(x / 60)}m ago`
  if (x < 86400) return `${Math.round(x / 3600)}h ago`
  return `${Math.round(x / 86400)}d ago`
}
