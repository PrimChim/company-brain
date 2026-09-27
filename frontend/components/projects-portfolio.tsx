'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, FileText, FolderKanban, Loader2, MoreHorizontal, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { WorkspaceBrand, WorkspaceNav } from '@/components/workspace-nav'
import { ProfileMenu } from '@/components/profile-menu'

type Project = { uid: string; name: string; entries?: number; members?: string[] }

type Person = { name: string; role: string }

const fallbackProjects: Project[] = [
  { uid: 'p1', name: 'Gantavya', entries: 24, members: ['Maya Chen', 'Ravi Shah', 'Noah Lee'] },
  { uid: 'p2', name: 'EventFlow', entries: 18, members: ['Priya Nair', 'Sam Ortiz'] },
  { uid: 'p3', name: 'Company Brain', entries: 31, members: ['Maya Chen', 'Jordan Kim', 'Ravi Shah'] },
  { uid: 'p4', name: 'Laligurash Youth Club', entries: 12, members: ['Noah Lee', 'Priya Nair'] },
]

const fallbackPeople: Person[] = [
  { name: 'Maya Chen', role: 'Founder' }, { name: 'Ravi Shah', role: 'Engineer' },
  { name: 'Noah Lee', role: 'Operations' }, { name: 'Priya Nair', role: 'Engineer' },
  { name: 'Sam Ortiz', role: 'Operations' }, { name: 'Jordan Kim', role: 'Designer' },
]

export function ProjectsPortfolio({ initialProjects = [], initialPeople = [] }: { initialProjects?: Project[]; initialPeople?: Person[] }) {
  const [projects, setProjects] = useState(initialProjects.length ? initialProjects : fallbackProjects)
  const [people] = useState(initialPeople.length ? initialPeople : fallbackPeople)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [assignedPeople, setAssignedPeople] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const roleCounts = useMemo(() => people.reduce<Record<string, number>>((counts, person) => { counts[person.role] = (counts[person.role] || 0) + 1; return counts }, {}), [people])
  const createProject = async () => {
    if (!name.trim()) return
    setSaving(true)
    const draft = { uid: `p-${Date.now()}`, name: name.trim(), entries: 0, members: [] }
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE}/brain/api/projects/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: draft.name }) })
      const created = response.ok ? await response.json() : {}
      setProjects((current) => [...current, { ...draft, ...created }])
    } catch { setProjects((current) => [...current, draft]) }
    setName(''); setOpen(false); setSaving(false)
  }
  const initials = (value: string) => value.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  return <main className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-card/85 backdrop-blur"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-10"><WorkspaceBrand /><div className="flex items-center gap-3"><WorkspaceNav /><ProfileMenu /></div></div></header>
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10 lg:py-12"><div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace / portfolio</p><h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">Projects</h1><p className="mt-2 max-w-xl text-sm text-muted-foreground">See how your knowledge, people, and work connect across active projects.</p></div><Button onClick={() => setOpen(true)}><Plus data-icon="inline-start" /> Add project</Button></div>
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3"><Stat label="Active projects" value={projects.length} icon={<FolderKanban />} /><Stat label="Connected entries" value={projects.reduce((sum, project) => sum + (project.entries || 0), 0)} icon={<FileText />} /><Stat label="Team members" value={people.length} icon={<Users />} /></div>
      <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Active portfolio</h2><p className="mt-1 text-sm text-muted-foreground">{projects.length} project nodes connected to Atlas.</p></div><Badge variant="outline" className="hidden gap-1.5 sm:flex"><span className="size-1.5 rounded-full bg-emerald-500" /> Live workspace</Badge></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{projects.map((project) => <Card key={project.uid} className="flex flex-col transition-shadow hover:shadow-md"><CardHeader className="gap-4 pb-4"><div className="flex items-start justify-between gap-3"><div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><BriefcaseBusiness /></div><DropdownMenu><DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Actions for ${project.name}`} className="size-8" />}><MoreHorizontal /></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setName(project.name); setOpen(true) }}><Pencil data-icon="inline-start" /> Edit project</DropdownMenuItem><DropdownMenuItem variant="destructive" onClick={() => setProjects((current) => current.filter((item) => item.uid !== project.uid))}><Trash2 data-icon="inline-start" /> Delete project</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div><div><h3 className="text-lg font-semibold tracking-tight">{project.name}</h3><p className="mt-1 text-sm text-muted-foreground">{project.entries || 0} connected entries</p></div></CardHeader><CardContent className="mt-auto flex flex-col gap-5"><div><p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Assigned team</p><div className="flex items-center"><div className="flex -space-x-2">{(project.members || []).slice(0, 4).map((member) => <Avatar key={member} className="size-8 border-2 border-card"><AvatarFallback className="bg-muted text-[10px] font-semibold">{initials(member)}</AvatarFallback></Avatar>)}</div><span className="ml-3 text-xs text-muted-foreground">{project.members?.length || 0} members</span></div></div><Link href={`/?project=${encodeURIComponent(project.name)}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">View project entries <ArrowUpRight /></Link></CardContent></Card>)}</div>
      <div className="mt-8 rounded-xl border border-border bg-card p-5"><div className="flex items-center justify-between gap-4"><div><h2 className="font-semibold">Team distribution</h2><p className="mt-1 text-sm text-muted-foreground">Current members by role across the portfolio.</p></div><Users className="text-muted-foreground" /></div><div className="mt-5 flex flex-wrap gap-2">{Object.entries(roleCounts).map(([role, count]) => <Badge key={role} variant="secondary">{role} · {count}</Badge>)}</div></div>
    </div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>Create a project</DialogTitle><DialogDescription>Add a new project node to your knowledge workspace.</DialogDescription></DialogHeader><div className="flex flex-col gap-5 py-2"><label className="flex flex-col gap-2 text-sm font-medium" htmlFor="project-name">Project name<Input id="project-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Research Hub" /></label><fieldset className="flex flex-col gap-2"><legend className="text-sm font-medium">Assigned people</legend><p className="text-xs text-muted-foreground">Choose who is connected to this project.</p><details className="group relative"><summary className="flex min-h-10 cursor-pointer list-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"><span>{assignedPeople.length ? `${assignedPeople.length} ${assignedPeople.length === 1 ? 'person' : 'people'} selected` : 'Select people'}</span><span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span></summary><div className="absolute inset-x-0 top-full z-10 mt-2 flex flex-col gap-1 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg">{people.map((person) => { const selected = assignedPeople.includes(person.name); return <label key={person.name} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted"><input type="checkbox" checked={selected} onChange={() => setAssignedPeople((current) => selected ? current.filter((name) => name !== person.name) : [...current, person.name])} className="size-4 accent-primary" />{person.name}</label> })}</div></details>{assignedPeople.length > 0 && <div className="flex flex-wrap gap-2" aria-label="Selected people">{assignedPeople.map((person) => <span key={person} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{person}</span>)}</div>}</fieldset></div><DialogFooter><DialogClose render={<Button variant="outline" />}>Cancel</DialogClose><Button onClick={createProject} disabled={saving || !name.trim()}>{saving && <Loader2 className="animate-spin" data-icon="inline-start" />} Create project</Button></DialogFooter></DialogContent></Dialog>
  </main>
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) { return <Card><CardContent className="flex items-center justify-between p-4 lg:p-5"><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p></div><div className="text-muted-foreground">{icon}</div></CardContent></Card> }

export type { Project, Person }

