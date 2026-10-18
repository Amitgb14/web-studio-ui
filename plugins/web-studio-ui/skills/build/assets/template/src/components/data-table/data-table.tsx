import {
  flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable, type ColumnDef, type SortingState,
} from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useState, type ReactNode } from "react"

import { FacetedFilter, type FacetOption } from "@/components/data-table/faceted-filter"
import { DataTablePagination } from "@/components/data-table/pagination"
import { ViewOptions } from "@/components/data-table/view-options"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

/** The table recipe: search, faceted filters with live counts, sortable
 *  mono headers, a View menu and pagination. One component for every list. */
export function DataTable<T>({ data, columns, search, facets = [], noun, nouns, empty, onRow, pageSize = 15, toolbar, initialSort }: {
  data: T[]; columns: ColumnDef<T, unknown>[]; search?: (row: T, q: string) => boolean
  facets?: { column: string; title: string; options: FacetOption[] }[]; noun: string; nouns?: string; empty: ReactNode
  onRow?: (row: T) => void; pageSize?: number; toolbar?: ReactNode; initialSort?: SortingState
}) {
  const [query, setQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>(initialSort ?? [])
  const rows = search && query.trim() ? data.filter((r) => search(r, query.trim().toLowerCase())) : data
  const table = useReactTable({
    data: rows, columns, state: { sorting }, onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(), getFacetedUniqueValues: getFacetedUniqueValues(), getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {search && (
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={`Search ${nouns ?? noun + "s"}`} value={query} onChange={(e) => setQuery(e.target.value)} className="h-8 pl-8" />
          </div>
        )}
        {facets.map((f) => <FacetedFilter key={f.column} column={table.getColumn(f.column)} title={f.title} options={f.options} />)}
        <div className="ml-auto flex items-center gap-2">{toolbar}<ViewOptions table={table} /></div>
      </div>
      <Table>
        <TableHeader className="bg-muted/30">
          {table.getHeaderGroups().map((g) => (
            <TableRow key={g.id} className="hover:bg-transparent">
              {g.headers.map((h) => <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className={cn(onRow && "cursor-pointer")}
              onClick={(e) => { if (onRow && !(e.target as HTMLElement).closest("a,button,[role=checkbox],[role=menu]")) onRow(row.original) }}>
              {row.getVisibleCells().map((cell) => <TableCell key={cell.id} className="align-top">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
            </TableRow>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-sm text-muted-foreground">{empty}</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      {data.length > pageSize && <DataTablePagination table={table} noun={noun} nouns={nouns} />}
    </div>
  )
}

export const facetFilter = (row: { getValue: (id: string) => unknown }, id: string, value: string[]) => value.includes(String(row.getValue(id)))
