'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Bot, Loader2, MessageCircle, Plus, Sparkles, SquarePlus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ContextCreateModal } from '@/components/context-create-modal'
import { cn } from '@/lib/utils'

// Data interfaces matching backend response payload
interface EntryItem {
  id: string
  type: 'decision' | 'task' | 'risk' | 'fact'
  title: string
  content: string
  date: string
  status: string
  requiresSignOff?: boolean
  project?: { id: string; name: string }
}

interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text?: string
  parsedIntent?: Record<string, any>
  entries?: EntryItem[]
}

const PREBUILT_QUESTIONS = [
  'What decisions were made for Gantavya?',
  'What risks are currently open?',
  'What tasks are assigned to Pritam?',
  'Which entries require sign-off?',
]

export function FloatingSpeedDial() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  // Chat State
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // Main Submit Handler to fetch NLP results from backend
  async function handleAiSubmit(e?: React.FormEvent, customPrompt?: string) {
    if (e) e.preventDefault()
    
    const query = (customPrompt || prompt).trim()
    if (!query || loading) return

    // 1. Append user message to thread
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: query }
    setMessages((prev) => [...prev, userMsg])
    setPrompt('')
    setLoading(true)

    try{
      const API_BASE = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE}/brain/api/nlp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      })

      if (!response.ok) {
        throw new Error('Failed to query backend AI service')
      }

      const resData = await response.json()

      // 3. Append AI response payload to chat history
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        parsedIntent: resData.parsed_intent,
        entries: resData.data || [],
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Sorry, I encountered an error searching knowledge base records. Please verify backend connection.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (pathname === '/' || pathname === '/login') return null

  return (
    <>
      {/* Floating Speed Dial Floating Button */}
      <div 
        className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3" 
        onMouseEnter={() => setOpen(true)}
      >
        <div 
          className={cn(
            'flex flex-col items-end gap-3 transition-all duration-200', 
            open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
          )}
        >
          <Button 
            type="button" 
            variant="secondary" 
            className="group rounded-full pl-3 shadow-lg" 
            onClick={() => { setAiOpen(true); setOpen(false) }}
          >
            <span>Ask AI</span>
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
          </Button>

          <Button 
            type="button" 
            variant="secondary" 
            className="group rounded-full pl-3 shadow-lg" 
            onClick={() => { setCreateOpen(true); setOpen(false) }}
          >
            <span>Add New</span>
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <SquarePlus className="size-4" />
            </span>
          </Button>
        </div>

        <Button 
          type="button" 
          size="icon" 
          aria-label={open ? 'Close quick actions' : 'Open quick actions'} 
          aria-expanded={open} 
          className="size-12 rounded-full shadow-xl transition-all duration-200 hover:scale-105" 
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <MessageCircle className="size-6 -rotate-45" /> : <Plus className="size-6" />}
        </Button>
      </div>

      {/* AI Drawer / Sheet Component */}
      <Sheet open={aiOpen} onOpenChange={setAiOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md p-0">
          <SheetHeader className="border-b px-5 py-5">
            <SheetTitle className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Bot className="size-5" />
              </span> 
              AI Search & Chat
            </SheetTitle>
            <SheetDescription>Search across decisions, facts, tasks, and risks.</SheetDescription>
          </SheetHeader>

          {/* Main Chat Stream Container */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
            {/* Introductory Header Banner */}
            <div className="rounded-xl bg-muted p-4 text-sm leading-6">
              Ask a question and I&apos;ll connect the answer to your company&apos;s knowledge.
            </div>

            {/* Rendered Conversation Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex flex-col gap-2 rounded-xl p-3 text-sm',
                  msg.sender === 'user'
                    ? 'ml-auto max-w-[85%] bg-primary text-primary-foreground'
                    : 'mr-auto w-full bg-muted/60 border'
                )}
              >
                {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                {/* Returned Entry Cards List from Backend */}
                {msg.entries && msg.entries.length > 0 && (
                  <div className="flex flex-col gap-3 mt-1">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Found {msg.entries.length} matching {msg.entries.length === 1 ? 'entry' : 'entries'}:
                    </p>
                    {msg.entries.map((item) => (
                      <div key={item.id} className="rounded-lg border bg-background p-3 shadow-sm text-foreground">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={cn(
                            "px-2 py-0.5 text-[10px] font-medium rounded-full uppercase",
                            item.type === 'decision' && "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
                            item.type === 'fact' && "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
                            item.type === 'task' && "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
                            item.type === 'risk' && "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                          )}>
                            {item.type}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{item.status}</span>
                        </div>
                        
                        <h4 className="font-semibold text-sm hover:underline cursor-pointer">
                          {item.title}
                        </h4>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {item.content}
                        </p>

                        {item.project && (
                          <div className="mt-2 text-[10px] font-medium text-primary">
                            Project: {item.project.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State Result */}
                {msg.entries && msg.entries.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">
                    No entries found matching this prompt criteria.
                  </p>
                )}
              </div>
            ))}

            {/* Spinner Loading State */}
            {loading && (
              <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground bg-muted/40 rounded-xl w-fit">
                <Loader2 className="size-4 animate-spin" />
                <span>Parsing query & searching...</span>
              </div>
            )}

            {/* Suggestion Quick Action Pills */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-xs font-medium text-muted-foreground">Try asking</p>
              {PREBUILT_QUESTIONS.map((question) => (
                <Button
                  key={question}
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => handleAiSubmit(undefined, question)}
                  className="h-auto justify-start whitespace-normal py-2.5 text-left font-normal text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Bottom Chat Input Form */}
          <form onSubmit={handleAiSubmit} className="mt-auto border-t p-4">
            <div className="flex items-center gap-2 rounded-xl border bg-background p-1.5 focus-within:ring-1 focus-within:ring-ring">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Ask about your organization..."
              />
              <Button type="submit" size="icon" disabled={loading || !prompt.trim()} aria-label="Send question">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Connected to the Company Brain Engine
            </p>
          </form>
        </SheetContent>
      </Sheet>

      {/* Global Contextual Create Modal */}
      <ContextCreateModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
