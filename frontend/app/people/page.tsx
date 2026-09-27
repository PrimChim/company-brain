import { PeopleDirectory } from '@/components/people-directory'

type Person = { uid: string; name: string; role: string; assignedEntries?: number; projects?: string[] }

export default async function Page() {
  let people: Person[] = []
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_BASE}/brain/api/people/`, { cache: 'no-store' })
    if (response.ok) people = await response.json()
  } catch {
    // The local API is optional in preview; the client renders representative team members.
  }

  return <PeopleDirectory initialPeople={people} />
}

export const metadata = {
  title: 'Atlas — People directory',
  description: 'Manage the people contributing to your Atlas workspace.',
}

export const dynamic = 'force-dynamic'
