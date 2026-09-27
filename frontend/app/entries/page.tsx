import { KnowledgeWorkspace } from '@/components/knowledge-workspace'

type Entry = { id: string; type: 'task' | 'risk' | 'fact' | 'decision'; title: string; content: string; date: string; status: string; requiresSignOff?: boolean; staleAfter?: string; project: { id: string; name: string }; created_by?: string; edited_by?: string; related: { id: string; title: string; rel_type: string }[] }

export default async function Page() {
  let entries: Entry[] = []
  const API_BASE = process.env.NEXT_PUBLIC_API_URL
  try {
    const response = await fetch(`${API_BASE}/brain/api/entries/`, { cache: 'no-store' })
    if (response.ok) entries = await response.json()
  } catch {
    // The local API is optional in preview; the client renders representative entries.
  }
  return <KnowledgeWorkspace initialEntries={entries} />
}

export const metadata = { title: 'Atlas — Knowledge Workspace', description: 'Manage knowledge entries, decisions, risks, and team context.' }
export const dynamic = 'force-dynamic'
