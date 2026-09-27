'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff, Loader2, Mail, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) throw new Error('Invalid username or password. Please try again.')

      const data = await response.json()
      document.cookie = `access_token=${data.access}; path=/; max-age=${keepSignedIn ? 86400 : 3600}; SameSite=Lax`
      router.push('/projects')
      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during authentication.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090B] px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(148,163,184,0.12),transparent_42%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:auto,32px_32px,32px_32px]" />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="relative w-full max-w-md">
        <Card className="border-border/70 bg-card/95 shadow-2xl shadow-black/30 backdrop-blur">
          <CardHeader className="space-y-4 p-6 pb-4 text-center sm:p-8 sm:pb-5">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-border bg-muted/60 text-foreground shadow-sm"><Sparkles aria-hidden="true" /></div>
            <div className="space-y-2">
              <CardTitle className="text-2xl tracking-tight">Welcome to Atlas / Company Brain</CardTitle>
              <CardDescription>Sign in with your organization credentials to access the knowledge graph.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-2 sm:p-8 sm:pt-3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <AnimatePresence initial={false}>
                {errorMessage && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} role="alert" className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>{errorMessage}</span></motion.div>}
              </AnimatePresence>
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-sm font-medium">Username or email</label>
                <div className="relative"><Mail className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden="true" /><Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="you@company.com" className="pl-9" required /></div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <div className="relative"><Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Enter your password" className="pr-10" required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-2 grid size-6 place-items-center rounded text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={keepSignedIn} onChange={(event) => setKeepSignedIn(event.target.checked)} className="size-4 accent-primary" />Keep me signed in</label>
              <Button type="submit" disabled={loading} className="w-full transition-all duration-200 hover:scale-105">{loading ? <><Loader2 className="size-4 animate-spin" />Signing in...</> : 'Sign In'}</Button>
              <p className="text-center text-xs leading-relaxed text-muted-foreground">Don&apos;t have an account? Contact your administrator to be added to the organization graph.</p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
