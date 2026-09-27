'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/entries', label: 'Entries' },
  { href: '/people', label: 'People' },
  { href: '/projects', label: 'Projects' },
]

export function WorkspaceNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary navigation" className="hidden items-center gap-1 rounded-lg border border-border bg-background p-1 sm:flex">
      {links.map((link) => {
        const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
        return <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined} className={cn('rounded-md px-3 py-1.5 text-sm transition-colors', active ? 'bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:text-foreground')}>{link.label}</Link>
      })}
    </nav>
  )
}

export function WorkspaceBrand({ subtitle = 'Workspace' }: { subtitle?: string }) {
  return <Link href="/" className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">A</div><div><p className="text-sm font-semibold tracking-tight">Atlas</p><p className="text-xs text-muted-foreground">{subtitle}</p></div></Link>
}
