import type { ColumnDef } from "@tanstack/react-table"
import { ListChecks, Plus } from "lucide-react"

import { PageHeader } from "@/components/common/page-header"
import { StatusBadge } from "@/components/common/status-badge"
import { ColumnHeader } from "@/components/data-table/column-header"
import { DataTable, facetFilter } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { ago, usd } from "@/lib/format"
import { navigate } from "@/lib/router"
import { ITEMS, type Item } from "@/lib/sample-data"

const columns: ColumnDef<Item, unknown>[] = [
  { accessorKey: "name", header: ({ column }) => <ColumnHeader column={column} title="Item" />,
    cell: ({ row }) => <div className="min-w-0"><p className="truncate text-sm font-medium">{row.original.name}</p><p className="font-mono text-xs text-muted-foreground">{row.original.id}</p></div> },
  { accessorKey: "state", header: ({ column }) => <ColumnHeader column={column} title="State" />, filterFn: facetFilter,
    cell: ({ row }) => <StatusBadge outcome={row.original.state} size="sm" /> },
  { accessorKey: "owner", header: ({ column }) => <ColumnHeader column={column} title="Owner" />, filterFn: facetFilter },
  { accessorKey: "cost", header: ({ column }) => <ColumnHeader column={column} title="Cost" />, cell: ({ row }) => <span className="font-mono text-xs">{usd(row.original.cost)}</span> },
  { accessorKey: "updated", header: ({ column }) => <ColumnHeader column={column} title="Updated" />, cell: ({ row }) => <span className="text-xs text-muted-foreground">{ago(row.original.updated)}</span> },
]

export function ItemsPage() {
  const opts = (k: keyof Item) => [...new Set(ITEMS.map((i) => String(i[k])))].map((v) => ({ label: v, value: v }))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Items" description="Everything this app manages. Click a row for details."
        actions={<Button size="sm"><Plus className="size-3.5" />New item</Button>} />
      <DataTable data={ITEMS} columns={columns} noun="item" initialSort={[{ id: "updated", desc: true }]}
        search={(r, q) => `${r.id} ${r.name} ${r.owner}`.toLowerCase().includes(q)}
        facets={[{ column: "state", title: "State", options: opts("state") }, { column: "owner", title: "Owner", options: opts("owner") }]}
        onRow={(r) => navigate(`/items/${r.id}`)}
        empty={<span className="inline-flex items-center gap-2"><ListChecks className="size-4" />No items match. Clear the search or a filter.</span>} />
    </div>
  )
}
