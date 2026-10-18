import { AlertTriangle, Check } from "lucide-react"
import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

/** A card with the hairline sheen and the standard padding. */
export const Panel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <Card className={cn("surface-sheen py-4", className)}><CardContent className="px-4">{children}</CardContent></Card>
)

/** Key/value facts: muted keys, values that wrap. */
export function KV({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
      {rows.map(([k, v]) => <div key={k} className="contents"><dt className="text-muted-foreground">{k}</dt><dd className="min-w-0 break-words">{v}</dd></div>)}
    </dl>
  )
}

/** An inline note: caution ("look at this") or contained ("all good"). Icon + words, never colour alone. */
export const Note = ({ tone, children }: { tone: "warn" | "ok"; children: ReactNode }) => (
  <p className={cn("flex items-start gap-2 rounded-md border px-3 py-2 text-xs",
    tone === "warn" ? "border-caution/30 bg-caution/10 text-caution" : "border-contained/30 bg-contained/10 text-contained")}>
    {tone === "warn" ? <AlertTriangle className="mt-px size-3.5 shrink-0" /> : <Check className="mt-px size-3.5 shrink-0" />}<span>{children}</span>
  </p>
)

/** A small static table (no sorting/paging) with the mono uppercase header. */
export function MiniTable({ head, rows, empty }: { head: string[]; rows: ReactNode[][]; empty: string }) {
  if (!rows.length) return <p className="py-4 text-center text-sm text-muted-foreground">{empty}</p>
  return (
    <Table>
      <TableHeader><TableRow>{head.map((h) => <TableHead key={h} className="font-mono text-[11px] font-normal tracking-[0.06em] text-muted-foreground uppercase">{h}</TableHead>)}</TableRow></TableHeader>
      <TableBody>{rows.map((r, i) => <TableRow key={i}>{r.map((c, j) => <TableCell key={j}>{c}</TableCell>)}</TableRow>)}</TableBody>
    </Table>
  )
}

/** Field wrapper for forms: small muted label, control, optional hint. */
export const Field = ({ label, hint, children, htmlFor }: { label: string; hint?: ReactNode; children: ReactNode; htmlFor?: string }) => (
  <div className="grid gap-1.5">
    <label htmlFor={htmlFor} className="text-xs text-muted-foreground">{label}</label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
)
