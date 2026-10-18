import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { PageHeader, SectionHeader } from "@/components/common/page-header"
import { Field, Panel } from "@/components/common/panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export function SettingsPage() {
  const [name, setName] = useState("Nightly report")
  const [schedule, setSchedule] = useState("daily")
  const [notify, setNotify] = useState(true)
  const [notes, setNotes] = useState("")
  const [busy, setBusy] = useState(false)
  const valid = name.trim().length > 0

  const save = async () => {
    setBusy(true)
    await new Promise((r) => setTimeout(r, 500)) // replace with: await api("/api/settings", { name, schedule, notify, notes })
    setBusy(false)
    toast.success("Settings saved")
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Changes apply to the next run." />
      <Panel>
        <SectionHeader title="General" description="The basics." className="mb-4" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="name" hint={!valid ? <span className="text-destructive">A name is required.</span> : undefined}>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!valid} />
          </Field>
          <Field label="Runs" hint="In your time zone.">
            <Select value={schedule} onValueChange={setSchedule}>
              <SelectTrigger className="w-full" aria-label="Runs"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="hourly">Every hour</SelectItem><SelectItem value="daily">Every day at 09:00</SelectItem><SelectItem value="manual">Only when I run it</SelectItem></SelectContent>
            </Select>
          </Field>
          <div className="sm:col-span-2"><Field label="Notes" hint="Optional."><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything worth remembering about this." /></Field></div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4 border-t pt-4">
          <div><p className="text-sm font-medium">Message me when it fails</p><p className="text-xs text-muted-foreground">One message per failure, with the reason.</p></div>
          <Switch checked={notify} onCheckedChange={setNotify} aria-label="Message me when it fails" />
        </div>
      </Panel>
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={save} disabled={!valid || busy}>{busy && <Loader2 className="size-3.5 animate-spin" />}Save</Button>
      </div>
    </div>
  )
}
