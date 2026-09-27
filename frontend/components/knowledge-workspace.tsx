'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, CheckCircle2, CircleAlert, Ellipsis, FileText, Filter, Link2, Menu, Search, ShieldCheck, SlidersHorizontal, X } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { WorkspaceBrand, WorkspaceNav } from '@/components/workspace-nav'
import { ProfileMenu } from '@/components/profile-menu'

type EntryType = 'task' | 'risk' | 'fact' | 'decision'
type Entry = { id: string; type: EntryType; title: string; content: string; date: string; status: string; requiresSignOff?: boolean; staleAfter?: string; project: { id: string; name: string }; created_by?: string; edited_by?: string; related: { id: string; title: string; rel_type: string }[] }

const sampleEntries: Entry[] = []

const typeMeta = {
  task: { label: 'Task', tone: 'text-orange-700 bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  risk: { label: 'Risk', tone: 'text-red-700 bg-red-50 border-red-200', dot: 'bg-red-500' },
  decision: { label: 'Decision', tone: 'text-blue-700 bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  fact: { label: 'Fact', tone: 'text-slate-600 bg-slate-100 border-slate-200', dot: 'bg-slate-500' },
}

export function KnowledgeWorkspace({ initialEntries }: { initialEntries: Entry[] }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [project, setProject] = useState('all')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState<Entry | null>(null)
  const [deletedEntryIds, setDeletedEntryIds] = useState<string[]>([])
  const entries = (initialEntries.length ? initialEntries : sampleEntries).filter((entry) => !deletedEntryIds.includes(entry.id))
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''
  const projects = [...new Set(entries.map((entry) => entry.project.name))]
  const statuses = [...new Set(entries.map((entry) => entry.status))]
  const filtered = useMemo(() => entries.filter((entry) => {
    const haystack = `${entry.title} ${entry.content}`.toLowerCase()
    return haystack.includes(query.toLowerCase()) && (type === 'all' || entry.type === type) && (project === 'all' || entry.project.name === project) && (status === 'all' || entry.status === status)
  }), [entries, query, type, project, status])
  const metrics = { total: entries.length, decisions: entries.filter((entry) => entry.type === 'decision').length, tasks: entries.filter((entry) => entry.type === 'task' && entry.status !== 'Done').length, risks: entries.filter((entry) => entry.type === 'risk' && entry.status !== 'Resolved').length }
  const deleteEntry = async (entry: Entry) => {
    const response = await fetch(`${API_BASE}/brain/api/entries/${entry.id}/`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Unable to delete entry')
    setDeletedEntryIds((current) => [...current, entry.id])
    setSelected((current) => current?.id === entry.id ? null : current)
  }

  return <main className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-card/90">
      <div className="mx-auto flex max-w-360 items-center justify-between gap-4 px-5 py-4 lg:px-10">
        <WorkspaceBrand subtitle="Knowledge base" />
        <div className="flex items-center gap-3"><WorkspaceNav /><ProfileMenu /></div>
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open navigation"><Menu /></Button>
      </div>
    </header>
    <div className="mx-auto max-w-360 px-5 py-8 lg:px-10 lg:py-12">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace / overview</p><h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">Project knowledge</h1><p className="mt-2 max-w-xl text-sm text-muted-foreground">A shared source of truth for decisions, context, and work in motion.</p></div><div className="relative w-full md:max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search entries..." className="h-11 pl-10 pr-10" />{query && <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setQuery('')} aria-label="Clear search"><X /></Button>}</div></div>
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric label="Total entries" value={metrics.total} icon={<FileText />} /><Metric label="Decisions" value={metrics.decisions} icon={<CheckCircle2 />} /><Metric label="Open tasks" value={metrics.tasks} icon={<CircleAlert />} /><Metric label="Active risks" value={metrics.risks} icon={<CircleAlert />} danger /></div>
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-3 lg:flex-row lg:items-center"><div className="flex items-center gap-2 px-2 text-sm font-medium"><SlidersHorizontal className="text-muted-foreground" /> Filters</div><div className="flex flex-wrap gap-1.5">{(['all', 'decision', 'fact', 'task', 'risk'] as const).map((item) => <Button key={item} variant={type === item ? 'secondary' : 'ghost'} size="sm" className="rounded-full capitalize" onClick={() => setType(item)}>{item === 'all' ? 'All types' : typeMeta[item].label}</Button>)}</div><Separator orientation="vertical" className="hidden h-6 lg:block" /><div className="grid grid-cols-2 gap-2 sm:flex"><Select value={project} onValueChange={(value) => setProject(value ?? 'all')}><SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Project" /></SelectTrigger><SelectContent><SelectItem value="all">All projects</SelectItem>{projects.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><Select value={status} onValueChange={(value) => setStatus(value ?? 'all')}><SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{statuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div></div>
      <div className="mb-4 flex items-center justify-between"><p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{filtered.length}</span> entries</p><Button variant="ghost" size="sm" className="text-muted-foreground"><Filter data-icon="inline-start" /> Sort: newest</Button></div>
      {filtered.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((entry) => <EntryCard key={entry.id} entry={entry} onOpen={() => setSelected(entry)} onDelete={() => deleteEntry(entry)} />)}</div> : <Card><CardContent className="flex flex-col items-center gap-2 py-16 text-center"><Search className="text-muted-foreground" /><p className="font-medium">No entries found</p><p className="text-sm text-muted-foreground">Try changing your search or filters.</p></CardContent></Card>}
    </div>
    <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><SheetContent className="w-full overflow-y-auto sm:max-w-xl"><SheetHeader className="border-b pb-6"><div className="mb-3 flex items-center gap-2">{selected && <TypeBadge type={selected.type} />}<Badge variant="outline">{selected?.status}</Badge></div><SheetTitle className="text-2xl tracking-tight">{selected?.title}</SheetTitle><SheetDescription>{selected?.content}</SheetDescription></SheetHeader>{selected && <div className="flex flex-col gap-7 py-6 pl-6"><div className="grid grid-cols-2 gap-4"><Detail label="Project" value={selected.project.name} /><Detail label="Created" value={selected.date} /><Detail label="Stale after" value={selected.staleAfter === 'never' ? 'Never' : `${selected.staleAfter} days`} /><Detail label="Entry ID" value={selected.id} /></div><Separator /><div><h3 className="mb-3 text-sm font-semibold">Related entries <span className="font-normal text-muted-foreground">({selected.related.length})</span></h3><div className="flex flex-col gap-2">{selected.related.length ? selected.related.map((related) => <div key={related.id} className="rounded-lg border p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium">{related.title}</p><p className="mt-1 text-xs text-muted-foreground">{related.id}</p></div><Badge variant="secondary" className="shrink-0">{related.rel_type.replace('_', ' ')}</Badge></div></div>) : <p className="text-sm text-muted-foreground">No linked entries yet.</p>}</div></div><div className="flex flex-col gap-2 sm:flex-row"><Button className="flex-1">Request sign-off <ArrowUpRight data-icon="inline-end" /></Button><Button variant="outline" className="flex-1">Mark as stale</Button></div></div>}<SheetClose className="sr-only" /></SheetContent></Sheet>
  </main>
}

function Metric({ label, value, icon, danger }: { label: string; value: number; icon: React.ReactNode; danger?: boolean }) { return <Card><CardContent className="flex items-center justify-between p-4 lg:p-5"><div><p className="text-xs text-muted-foreground">{label}</p><p className={cn('mt-2 text-2xl font-semibold tracking-tight', danger && 'text-red-600')}>{value}</p></div><div className="text-muted-foreground">{icon}</div></CardContent></Card> }
function TypeBadge({ type }: { type: EntryType }) { const meta = typeMeta[type]; return <Badge variant="outline" className={cn('gap-1.5', meta.tone)}><span className={cn('size-1.5 rounded-full', meta.dot)} />{meta.label}</Badge> }
function EntryCard({ entry, onOpen, onDelete }: { entry: Entry; onOpen: () => void; onDelete: () => Promise<void> }) { return <Card role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && onOpen()} className="group cursor-pointer transition-shadow hover:shadow-md"><CardHeader className="gap-4 pb-3"><div className="flex items-start justify-between gap-3"><div className="flex flex-wrap gap-2"><TypeBadge type={entry.type} /><Badge variant="outline">{entry.status}</Badge>{entry.requiresSignOff && <Badge variant="secondary">Sign-off required</Badge>}</div><DropdownMenu><DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Entry options for ${entry.title}`} className="size-8" />} onClick={(event) => event.stopPropagation()}><Ellipsis /></DropdownMenuTrigger><DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}><DropdownMenuItem variant="destructive" onClick={() => void onDelete()}>Delete entry</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div><div><h2 className="line-clamp-2 text-base font-semibold leading-snug">{entry.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{entry.content}</p></div></CardHeader><CardContent className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground"><span className="max-w-[45%] truncate font-medium text-foreground">{entry.project.name}</span><span>{entry.date}</span><span className="flex items-center gap-1"><Link2 />{entry.related.length}</span></CardContent></Card> }
function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div> }
