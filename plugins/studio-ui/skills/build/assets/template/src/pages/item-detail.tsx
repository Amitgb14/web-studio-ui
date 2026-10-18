import { ArrowLeft, FileQuestion, Play, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/common/empty-state"
import { MetricTile } from "@/components/common/metric-tile"
import { PageHeader, SectionHeader } from "@/components/common/page-header"
import { KV, MiniTable, Note, Panel } from "@/components/common/panel"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ago, fmtTime, usd } from "@/lib/format"
import { href, navigate } from "@/lib/router"
import { ITEMS } from "@/lib/sample-data"

export function ItemDetailPage({ id }: { id: string }) {
  const item = ITEMS.find((i) => i.id === id)
  if (!item) return <EmptyState icon={FileQuestion} title={`No item called ${id}`} description="It may have been deleted." action={<Button size="sm" variant="outline" onClick={() => navigate("/items")}>Back to items</Button>} />

  return (
    <div className="flex flex-col gap-6">
      <a href={href("/items")} className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" />Items</a>
      <PageHeader title={<span className="inline-flex items-center gap-3">{item.name}<StatusBadge outcome={item.state} /></span>}
        description={<span className="font-mono text-xs">{item.id}</span>}
        actions={<Button size="sm" onClick={() => toast.success(`Started ${item.id}`)}><Play className="size-3.5" />Run now</Button>} />

      {item.state === "failed" && <Note tone="warn">The last run failed: the upstream API returned 503. It retries on the next schedule, or run it now.</Note>}

      <Tabs defaultValue="overview">
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="history">History</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>

        <TabsContent value="overview" className="mt-4 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricTile label="Cost" value={usd(item.cost)} spark={item.spark} />
            <MetricTile label="Runs" value={item.spark.length} footer="last 12 hours" />
            <MetricTile label="Success rate" value={null} absentReason="Nothing finished yet" />
          </div>
          <Panel><SectionHeader title="Details" className="mb-3" />
            <KV rows={[["Owner", item.owner], ["Updated", `${fmtTime(item.updated)} (${ago(item.updated)})`], ["State", <StatusBadge outcome={item.state} size="sm" />]]} /></Panel>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <MiniTable head={["Run", "Result", "Cost"]} empty="No runs yet."
            rows={item.spark.slice(0, 6).map((v, i) => [<span className="font-mono text-xs">run-{i + 1}</span>, <StatusBadge outcome={i === 2 ? "failed" : "done"} size="sm" />, <span className="font-mono text-xs">{usd(v / 10)}</span>])} />
        </TabsContent>

        <TabsContent value="settings" className="mt-4 grid gap-4">
          <Panel className="border-destructive/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><p className="text-sm font-medium">Delete this item</p><p className="text-xs text-muted-foreground">Removes it and its history. This can't be undone.</p></div>
              <DeleteDialog name={item.id} />
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DeleteDialog({ name }: { name: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="size-3.5" />Delete</Button></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Delete <span className="font-mono">{name}</span>?</DialogTitle>
          <DialogDescription>Its history goes too. This can't be undone.</DialogDescription></DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild><Button variant="destructive" onClick={() => { toast.success(`Deleted ${name}`); navigate("/items") }}>Delete</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
