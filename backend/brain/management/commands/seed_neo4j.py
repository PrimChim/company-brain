from datetime import datetime
from django.core.management.base import BaseCommand
from brain.models import Person, Project, Entry


class Command(BaseCommand):
    help = "Seeds Neo4j database with initial mock data (People, Projects, and Entries)"

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Clearing existing Neo4j graph data..."))
        
        # Clear existing nodes for a clean seed environment
        for p in Person.nodes.all():
            p.delete()

        for pr in Project.nodes.all():
            pr.delete()

        for e in Entry.nodes.all():
            e.delete()

        # -------------------------------------------------------------
        # 1. MOCK DATA DEFINITIONS
        # -------------------------------------------------------------
        PEOPLE = [
            {"id": "p1", "name": "Pritam Gurung", "role": "Founder"},
            {"id": "p2", "name": "Ram Thapa", "role": "Engineer"},
            {"id": "p3", "name": "Tul Kashi Gurung", "role": "Operations"},
            {"id": "p4", "name": "Project Manager", "role": "PM"},
            {"id": "p5", "name": "Finance Team", "role": "Finance"},
        ]

        PROJECTS = [
            {"id": "pr1", "name": "Gantavya"},
            {"id": "pr2", "name": "EventFlow"},
            {"id": "pr3", "name": "Company Brain"},
            {"id": "pr4", "name": "Laligurash Youth Club"},
        ]

        INITIAL_ENTRIES = [
            {
                "id": "e1",
                "type": "decision",
                "title": "Use PostgreSQL for the Gantavya platform",
                "content": "The team decided to use PostgreSQL as the primary database for the Gantavya platform because of its relational features and reliability.",
                "projectId": "pr1",
                "peopleIds": ["p1", "p2"],
                "date": "2025-09-02",
                "status": "Confirmed",
                "requiresSignOff": False,
                "staleAfter": "never",
                "relatedIds": ["e2"],
                "relationshipType": "related_to",
                "createdAt": "2025-09-02T09:15:00Z",
                "updatedAt": "2025-09-04T11:20:00Z",
                "reviewedAt": "2025-09-04T11:20:00Z",
            },
            {
                "id": "e2",
                "type": "task",
                "title": "Prepare the first EventFlow deployment",
                "content": "Set up the production environment and configure the API and frontend domains.",
                "projectId": "pr2",
                "peopleIds": ["p1"],
                "date": "2025-09-05",
                "status": "In progress",
                "requiresSignOff": True,
                "staleAfter": "14",
                "relatedIds": ["e1"],
                "relationshipType": "depends_on",
                "createdAt": "2025-09-05T08:00:00Z",
                "updatedAt": "2025-09-08T16:45:00Z",
                "reviewedAt": None,
            },
            {
                "id": "e3",
                "type": "risk",
                "title": "Limited memory on the hosting server",
                "content": "The current server may not have enough RAM to reliably run the automation service.",
                "projectId": "pr3",
                "peopleIds": ["p1"],
                "date": "2025-09-06",
                "status": "Open",
                "requiresSignOff": True,
                "staleAfter": "30",
                "relatedIds": ["e2"],
                "relationshipType": "caused_by",
                "createdAt": "2025-09-06T13:30:00Z",
                "updatedAt": "2025-09-06T13:30:00Z",
                "reviewedAt": None,
            },
            {
                "id": "e4",
                "type": "fact",
                "title": "The organization currently uses Google Sheets for donor tracking",
                "content": "The youth club tracks donors, donations, and Facebook thank-you posts using Google Sheets.",
                "projectId": "pr4",
                "peopleIds": ["p1"],
                "date": "2025-08-28",
                "status": "Verified",
                "requiresSignOff": False,
                "staleAfter": "60",
                "relatedIds": [],
                "relationshipType": None,
                "createdAt": "2025-08-28T10:05:00Z",
                "updatedAt": "2025-08-29T09:10:00Z",
                "reviewedAt": "2025-08-29T09:10:00Z",
            },
            {
                "id": "e5",
                "type": "decision",
                "title": "Adopt weekly async standups over daily calls",
                "content": "To reduce meeting fatigue across time zones, the team will post written updates in a shared thread every Monday instead of holding daily video calls.",
                "projectId": "pr3",
                "peopleIds": ["p1", "p3", "p4"],
                "date": "2025-09-09",
                "status": "Proposed",
                "requiresSignOff": True,
                "staleAfter": "30",
                "relatedIds": [],
                "relationshipType": None,
                "createdAt": "2025-09-09T14:00:00Z",
                "updatedAt": "2025-09-09T14:00:00Z",
                "reviewedAt": None,
            },
            {
                "id": "e6",
                "type": "task",
                "title": "Design the ticket check-in flow for EventFlow",
                "content": "Create wireframes for QR-based check-in, including offline fallback and staff role permissions.",
                "projectId": "pr2",
                "peopleIds": ["p2", "p4"],
                "date": "2025-09-10",
                "status": "Not started",
                "requiresSignOff": False,
                "staleAfter": "14",
                "relatedIds": ["e2"],
                "relationshipType": "related_to",
                "createdAt": "2025-09-10T07:40:00Z",
                "updatedAt": "2025-09-10T07:40:00Z",
                "reviewedAt": None,
            },
            {
                "id": "e7",
                "type": "risk",
                "title": "Donor data stored without backups",
                "content": "Donor records live in a single spreadsheet with no automated backup, creating a risk of permanent data loss.",
                "projectId": "pr4",
                "peopleIds": ["p1", "p5"],
                "date": "2025-09-01",
                "status": "Monitoring",
                "requiresSignOff": True,
                "staleAfter": "30",
                "relatedIds": ["e4"],
                "relationshipType": "caused_by",
                "createdAt": "2025-09-01T12:00:00Z",
                "updatedAt": "2025-09-07T09:30:00Z",
                "reviewedAt": None,
            },
            {
                "id": "e8",
                "type": "fact",
                "title": "Gantavya targets a mobile-first user base",
                "content": "Analytics from the pilot show more than 80% of users access the platform from Android devices, so mobile performance is the priority.",
                "projectId": "pr1",
                "peopleIds": ["p2", "p3"],
                "date": "2025-08-30",
                "status": "Verified",
                "requiresSignOff": False,
                "staleAfter": "60",
                "relatedIds": ["e1"],
                "relationshipType": "related_to",
                "createdAt": "2025-08-30T11:15:00Z",
                "updatedAt": "2025-08-30T11:15:00Z",
                "reviewedAt": "2025-08-31T08:00:00Z",
            },
            {
                "id": "e9",
                "type": "task",
                "title": "Migrate donor tracking off Google Sheets",
                "content": "Move donor and donation records into the Company Brain database and set up a nightly backup job.",
                "projectId": "pr4",
                "peopleIds": ["p1", "p5"],
                "date": "2025-09-08",
                "status": "Blocked",
                "requiresSignOff": True,
                "staleAfter": "30",
                "relatedIds": ["e7", "e4"],
                "relationshipType": "resolves",
                "createdAt": "2025-09-08T15:20:00Z",
                "updatedAt": "2025-09-11T10:00:00Z",
                "reviewedAt": None,
            },
        ]

        # -------------------------------------------------------------
        # 2. INGEST PEOPLE & PROJECTS
        # -------------------------------------------------------------
        people_map = {}
        for p in PEOPLE:
            person_node = Person(uid=p["id"], name=p["name"], role=p["role"]).save()
            people_map[p["id"]] = person_node
        self.stdout.write(self.style.SUCCESS(f"Created {len(people_map)} Person nodes."))

        project_map = {}
        for pr in PROJECTS:
            project_node = Project(uid=pr["id"], name=pr["name"]).save()
            project_map[pr["id"]] = project_node
        self.stdout.write(self.style.SUCCESS(f"Created {len(project_map)} Project nodes."))

        # Helper parser for date/datetime ISO strings
        def parse_date(d_str):
            return datetime.strptime(d_str, "%Y-%m-%d").date() if d_str else None

        def parse_datetime(dt_str):
            if not dt_str:
                return None
            return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))

        # -------------------------------------------------------------
        # 3. INGEST ENTRIES (PASS 1: CREATE NODES)
        # -------------------------------------------------------------
        entry_map = {}
        for item in INITIAL_ENTRIES:
            entry_node = Entry(
                uid=item["id"],
                entry_type=item["type"],
                title=item["title"],
                content=item["content"],
                date=parse_date(item["date"]),
                status=item["status"],
                requires_sign_off=item["requiresSignOff"],
                stale_after=item["staleAfter"],
                created_at=parse_datetime(item["createdAt"]),
                updated_at=parse_datetime(item["updatedAt"]),
                reviewed_at=parse_datetime(item["reviewedAt"]),
            ).save()

            # Connect Project relationship
            if item["projectId"] in project_map:
                entry_node.project.connect(project_map[item["projectId"]])

            # Connect People relationships
            for pid in item["peopleIds"]:
                if pid in people_map:
                    entry_node.people.connect(people_map[pid])

            entry_map[item["id"]] = entry_node

        self.stdout.write(self.style.SUCCESS(f"Created {len(entry_map)} Entry nodes with Project & Person links."))

        # -------------------------------------------------------------
        # 4. INGEST ENTRY-TO-ENTRY RELATIONSHIPS (PASS 2)
        # -------------------------------------------------------------
        rel_count = 0
        for item in INITIAL_ENTRIES:
            source_entry = entry_map[item["id"]]
            rel_type = item.get("relationshipType")

            for target_id in item.get("relatedIds", []):
                if target_id in entry_map and rel_type:
                    target_entry = entry_map[target_id]
                    source_entry.related_entries.connect(target_entry, {"type": rel_type})
                    rel_count += 1

        self.stdout.write(
            self.style.SUCCESS(f"Created {rel_count} Entry-to-Entry graph relationships.")
        )
        self.stdout.write(self.style.SUCCESS("Neo4j database seeding complete!"))