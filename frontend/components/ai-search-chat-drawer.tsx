"use client"

import { useState } from "react"
import { ArrowUpRight, Check, Filter, Send, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type EntryType = "decision" | "fact" | "task" | "risk"

type SearchEntry = {
  id: string
  type: EntryType
  title: string
  content: string
  date: string
  status: string
  project: { id: string; name: string }
  related: { id: string; title: string; rel_type: string }[]
}

const sampleEntries: SearchEntry[] = [
  {
    id: "e8",
    type: "fact",
    title: "Gantavya targets a mobile-first user base",
    content: "Analytics from the pilot show more than 80% of users access the platform from Android devices, so mobile performance is the priority.",
    date: "2025-08-30",
    status: "Verified",
    project: { id: "pr1", name: "Gantavya" },
    related: [{ id: "e1", title: "Use PostgreSQL for the Gantavya platform", rel_type: "related_to" }],
  },
  {
    id: "e1",
    type: "decision",
    title: "Use PostgreSQL for the Gantavya platform",
    content: "The team decided to use PostgreSQL as the primary database for the Gantavya platform because of its relational features and reliability.",
    date: "2025-09-02",
    status: "Confirmed",
    project: { id: "pr1", name: "Gantavya" },
    related: [{ id: "e2", title: "Prepare the first EventFlow deployment", rel_type: "related_to" }],
  },
]

const followUps = [
  "Are there any open tasks or risks logged for Gantavya?",
  "Who are the team members involved in Gantavya?",
  "Show entries related to PostgreSQL or backend infrastructure.",
]

const typeStyles: Record<EntryType, string> = {
  decision: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  fact: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  task: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  risk: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
}

function EntryResult({ entry, onSelect }: { entry: SearchEntry; onSelect: (id: string) => void }) {
  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="gap-3 p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <Badge className={cn("capitalize", typeStyles[entry.type])} variant="outline">{entry.type}</Badge>
          <Badge variant="secondary"><Check data-icon="inline-start" />{entry.status}</Badge>
        </div>
        <Button className="h-auto justify-start whitespace-normal p-0 text-left text-sm font-semibold tracking-tight hover:text-primary" variant="link" onClick={() => onSelect(entry.id)}>
          {entry.title}<ArrowUpRight data-icon="inline-end" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4 pt-2">
        <p className="text-sm leading-6 text-muted-foreground">{entry.content}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{entry.date}</span><span aria-hidden="true">·</span><span>{entry.project.name}</span><span aria-hidden="true">·</span><span>{entry.related.length} related</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function AiSearchChatDrawer({ open, onOpenChange, onSelectEntry }: { open: boolean; onOpenChange: (open: boolean) => void; onSelectEntry: (id: string) => void }) {
  const [prompt, setPrompt] = useState("")
  const [includeRelated, setIncludeRelated] = useState(true)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle>AI Search & Chat</SheetTitle>
          <SheetDescription>Search your knowledge base with natural language.</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex justify-end">
              <div className="max-w-[90%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground">What entries exist for Gantavya?</div>
            </div>
            <Card className="mt-5 border-primary/15 bg-primary/4">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div><p className="text-sm font-semibold">Found 2 entries associated with the Gantavya project</p><p className="mt-1 text-xs text-muted-foreground">1 Fact, 1 Decision</p></div>
                <Badge variant="secondary">2 results</Badge>
              </CardContent>
            </Card>
            <div className="mt-5 flex flex-col gap-3">{sampleEntries.map((entry) => <EntryResult key={entry.id} entry={entry} onSelect={onSelectEntry} />)}</div>
            <section className="mt-7"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Try asking next</p><div className="flex flex-col items-start gap-2">{followUps.map((question) => <Button key={question} className="h-auto justify-start whitespace-normal rounded-full px-3 py-2 text-left text-xs" variant="outline" onClick={() => setPrompt(question)}>{question}</Button>)}</div></section>
          </div>
          <div className="border-t border-border bg-card p-4">
            <div className="flex items-center gap-2"><Input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask about your knowledge base..." onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) setPrompt("") }} /><Button size="icon" aria-label="Send message" className="transition-all duration-200 hover:scale-105"><Send /></Button></div>
            <div className="mt-3 flex items-center gap-2"><Button size="sm" variant={includeRelated ? "secondary" : "ghost"} onClick={() => setIncludeRelated(!includeRelated)}><SlidersHorizontal data-icon="inline-start" />Related entries</Button><Button size="sm" variant="ghost"><Filter data-icon="inline-start" />Filters</Button></div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AiSearchChatDrawer
