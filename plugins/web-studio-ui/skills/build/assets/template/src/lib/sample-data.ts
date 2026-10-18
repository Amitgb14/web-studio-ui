// Example data so the starter renders without a backend. Replace with api() calls.
export type ItemState = "running" | "idle" | "failed" | "pending" | "done"
export interface Item { id: string; name: string; owner: string; state: ItemState; cost: number; updated: number; spark: number[] }

const now = Math.floor(Date.now() / 1000)
const STATES: ItemState[] = ["running", "idle", "failed", "pending", "done"]
export const ITEMS: Item[] = Array.from({ length: 24 }, (_, i) => ({
  id: `item-${String(i + 1).padStart(2, "0")}`,
  name: ["Nightly report", "Price watch", "Backup", "Inbox triage", "Deploy check", "Digest"][i % 6],
  owner: ["ana", "raj", "mei"][i % 3],
  state: STATES[(i * 7) % 5],
  cost: Math.round(((i * 37) % 90) * 13) / 100,
  updated: now - i * 1700,
  spark: Array.from({ length: 12 }, (_, j) => 4 + ((i + j * 5) % 9)),
}))
