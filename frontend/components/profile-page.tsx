import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WorkspaceBrand, WorkspaceNav } from '@/components/workspace-nav'
import { ProfileMenu } from '@/components/profile-menu'

export function ProfilePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/90">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <WorkspaceBrand subtitle="Team workspace" />
          <div className="flex items-center gap-3"><WorkspaceNav /><ProfileMenu /></div>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 py-8 lg:px-10 lg:py-12">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" /> Back to workspace</Link>
        <div className="mb-8 flex items-center gap-4"><Avatar className="size-16"><AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">MC</AvatarFallback></Avatar><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your account</p><h1 className="text-3xl font-semibold tracking-tight">Maya Chen</h1><p className="text-sm text-muted-foreground">Workspace administrator</p></div></div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="transition-all duration-200 hover:shadow-md"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Mail className="size-4 text-muted-foreground" /> Contact</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">maya.chen@atlas.team</p></CardContent></Card>
          <Card className="transition-all duration-200 hover:shadow-md"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="size-4 text-muted-foreground" /> Access</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Administrator permissions</p></CardContent></Card>
        </div>
      </div>
    </main>
  )
}
