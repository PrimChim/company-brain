'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function ProfileMenu() {
  const router = useRouter()

  function handleLogout() {
    router.push('/')
  }

  return (
    <div className="group relative">
      <button type="button" aria-label="Open profile menu" className="rounded-full outline-none transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-8"><AvatarFallback>MC</AvatarFallback></Avatar>
      </button>
      <div className="invisible absolute right-0 top-full z-20 mt-2 w-48 translate-y-1 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <Link href="/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"><UserRound className="size-4" /> Profile</Link>
        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><LogOut className="size-4" /> Log out</button>
      </div>
    </div>
  )
}

export default ProfileMenu
