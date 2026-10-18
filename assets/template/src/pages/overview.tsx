import { CircleDollarSign, Hand, ListChecks, XCircle } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { EmptyState } from "@/components/common/empty-state"
import { MetricTile } from "@/components/common/metric-tile"
import { PageHeader, SectionHeader } from "@/components/common/page-header"
import { Panel } from "@/components/common/panel"
import { LiveDot, StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import { ago, usd } from "@/lib/format"
import { href, navigate } from "@/lib/router"
import { ITEMS } from "@/lib/sample-data"

export function OverviewPage() {
  const failed = ITEMS.filter((i) => i.state === "failed")
  const pending = ITEMS.filter((i) => i.state === "pending")
  const running = ITEMS.filter((i) => i.state === "running")
  const spend = ITEMS.reduce((s, i) => s + i.cost, 0)
  const byOwner = Object.entries(ITEMS.reduce<Record<string, number>>((m, i) => ({ ...m, [i.owner]: (m[i.owner] ?? 0) + i.cost }), {})).map(([owner, cost]) => ({ owner, cost }))

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Overview" description="What's running, what needs you, and what it costs."
        actions={<Button size="sm" onClick={() => navigate("/items")}>View all items</Button>} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Running" value={running.length} icon={ListChecks} footer={running.length ? <span className="inline-flex items-center gap-1.5"><LiveDot />live now</span> : "nothing running"} />
        <MetricTile label="Needs you" value={pending.length} icon={Hand} footer="waiting for a decision" />
        <MetricTile label="Failed today" value={failed.length} icon={XCircle} footer={failed.length ? "open one to see why" : "all good"} />
        <MetricTile label="Spend" value={usd(spend)} icon={CircleDollarSign} spark={ITEMS.slice(0, 12).map((i) => i.cost)} footer="last 24 hours" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="flex flex-col gap-3 lg:col-span-3">
          <SectionHeader title="Needs you" description="Oldest first." />
          {pending.length ? (
            <Panel className="py-1">
              <ul className="divide-y">
                {pending.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 py-3">
                    <StatusBadge outcome={i.state} size="sm" />
                    <a href={href(`/items/${i.id}`)} className="min-w-0 flex-1 truncate text-sm hover:underline">{i.name} <span className="font-mono text-xs text-muted-foreground">{i.id}</span></a>
                    <span className="text-xs text-muted-foreground tabular-nums">{ago(i.updated)}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : <EmptyState icon={Hand} title="Nothing waiting" description="Anything that needs your decision shows up here." />}
        </section>

        <section className="flex flex-col gap-3 lg:col-span-2">
          <SectionHeader title="Spend by owner" />
          <Panel>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={byOwner} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                  <CartesianGrid vertical={false} stroke="var(--viz-grid)" />
                  <XAxis dataKey="owner" tickLine={false} axisLine={{ stroke: "var(--viz-axis)" }} tick={{ fill: "var(--viz-muted)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--viz-muted)", fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v) => usd(Number(v))} />
                  <Bar dataKey="cost" fill="var(--chart-1)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </section>
      </div>
    </div>
  )
}
