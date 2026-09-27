'use client'

import Link from 'next/link'
import { ArrowRight, BrainCircuit, CheckCircle2, CircleAlert, FileText, Network, Sparkles, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  { icon: Network, title: 'Graph-Backed Knowledge', description: 'Connect decisions, tasks, and risks directly to project nodes and team members.' },
  { icon: Sparkles, title: 'Parameterized AI Assistant', description: 'Ask contextual questions across your organization’s history with session-aware chat.' },
  { icon: BrainCircuit, title: 'Live Portfolio Stream', description: 'Track project updates, owner assignments, and stale entries in real time.' },
]

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#09090B] text-zinc-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white"><BrainCircuit className="size-5" /></span><span>Atlas <span className="text-zinc-500">/ Company Brain</span></span></Link>
        <div className="flex items-center gap-3"><Button asChild variant="outline" className="border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800"><Link href="/login">Login</Link></Button><Button asChild className="bg-blue-600 text-white hover:bg-blue-500"><Link href="/login">Get Started</Link></Button></div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pt-28">
        <div><Badge className="mb-6 gap-2 border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/10"><Sparkles className="size-3" /> Powered by Knowledge Graphs &amp; AI</Badge><h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">The Central Memory for Your Entire Organization</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">Capture decisions, tasks, risks, and facts. Connect your team, projects, and contextual knowledge in a unified graph database.</p><div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg" className="bg-blue-600 text-white transition-all duration-200 hover:scale-105 hover:bg-blue-500"><Link href="/login">Launch App <ArrowRight data-icon="inline-end" /></Link></Button><Button asChild size="lg" variant="outline" className="border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800"><Link href="#features">Learn More</Link></Button></div></div>
        <Card className="border-zinc-800 bg-[#18181B] shadow-2xl shadow-blue-950/20"><CardHeader className="flex-row items-center justify-between border-b border-zinc-800"><div><p className="text-xs uppercase tracking-wider text-zinc-500">Knowledge entry</p><CardTitle className="mt-2 text-lg text-white">Launch scope is approved</CardTitle></div><Badge className="bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10">Decision</Badge></CardHeader><CardContent className="space-y-6 p-6"><div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 text-emerald-400" /><div><p className="font-medium text-zinc-100">Ship the Atlas beta to the founding workspace.</p><p className="mt-1 text-sm text-zinc-500">Approved by the product team · Today</p></div></div></div><div className="grid grid-cols-2 gap-4"><div><p className="text-xs uppercase tracking-wider text-zinc-500">Project</p><p className="mt-2 font-medium text-zinc-200">Company Brain</p></div><div><p className="text-xs uppercase tracking-wider text-zinc-500">Connected team</p><div className="mt-2 flex -space-x-2"><span className="grid size-7 place-items-center rounded-full border-2 border-[#18181B] bg-blue-600 text-[10px] font-semibold">PG</span><span className="grid size-7 place-items-center rounded-full border-2 border-[#18181B] bg-violet-600 text-[10px] font-semibold">AM</span><span className="grid size-7 place-items-center rounded-full border-2 border-[#18181B] bg-amber-600 text-[10px] font-semibold">+4</span></div></div></div><div className="flex items-center gap-3 border-t border-zinc-800 pt-4 text-sm text-zinc-400"><FileText className="size-4 text-blue-400" /> 18 linked entries <CircleAlert className="ml-auto size-4 text-amber-400" /> 2 open risks</div></CardContent></Card>
      </section>

      <section id="features" className="border-y border-zinc-900 bg-zinc-950/50"><div className="mx-auto grid max-w-7xl gap-4 px-6 py-20 lg:grid-cols-3 lg:px-8">{features.map(({ icon: Icon, title, description }) => <Card key={title} className="border-zinc-800 bg-[#18181B] transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700"><CardContent className="p-6"><Icon className="size-6 text-blue-400" /><h2 className="mt-5 text-lg font-semibold text-white">{title}</h2><p className="mt-2 leading-7 text-zinc-400">{description}</p></CardContent></Card>)}</div></section>

      <section className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8"><Users className="mx-auto size-8 text-blue-400" /><h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">Ready to streamline your team&apos;s knowledge?</h2><p className="mx-auto mt-3 max-w-xl text-zinc-400">Give every decision, project, and relationship a connected home.</p><Button asChild size="lg" className="mt-8 bg-blue-600 text-white hover:bg-blue-500"><Link href="/login">Sign In to Atlas <ArrowRight data-icon="inline-end" /></Link></Button></section>
      <footer className="border-t border-zinc-900 px-6 py-6 text-center text-sm text-zinc-600">© 2026 Company Brain. All rights reserved.</footer>
    </main>
  )
}
