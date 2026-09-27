import { ProjectsPortfolio, type Person, type Project } from '@/components/projects-portfolio'

export default async function Page() {
  let projects: Project[] = []
  let people: Person[] = []

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  try {
    const [projectsResponse, peopleResponse] = await Promise.all([
      fetch(`${API_BASE}/brain/api/projects/`, { cache: 'no-store' }),
      fetch(`${API_BASE}/brain/api/people/`, { cache: 'no-store' }),
    ])

    if (projectsResponse.ok) {
      const rawProjectsData = await projectsResponse.json()
      
      // Extract array whether the backend sends a wrapped payload or direct array
      const rawList = Array.isArray(rawProjectsData) 
        ? rawProjectsData 
        : (rawProjectsData.projects || [])

      // Transform raw backend nodes/objects into the exact format ProjectsPortfolio expects
      projects = rawList.map((item: any) => ({
        uid: item.uid || item.id || '',
        name: item.name || '',
        entries: item.entries ?? item.connected_entries_count ?? 0,
        // Convert list of member objects [{ name: '...' }] or list of strings to string array
        members: Array.isArray(item.members)
          ? item.members.map((m: any) => (typeof m === 'string' ? m : m.name))
          : Array.isArray(item.team_members)
          ? item.team_members.map((m: any) => (typeof m === 'string' ? m : m.name))
          : [],
      }))
    }

    if (peopleResponse.ok) {
      const rawPeopleData = await peopleResponse.json()
      
      people = Array.isArray(rawPeopleData)
        ? rawPeopleData.map((p: any) => ({
            name: p.name || '',
            role: p.role || 'Member',
          }))
        : []
    }
  } catch (err) {
    console.error('Failed to fetch from Django backend, using client fallbacks:', err)
  }

  return <ProjectsPortfolio initialProjects={projects} initialPeople={people} />
}

export const metadata = {
  title: 'Atlas — Projects portfolio',
  description: 'Explore active projects and their connected knowledge and team members.',
}

export const dynamic = 'force-dynamic'