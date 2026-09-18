from django_neomodel import DjangoNode
from neomodel import (
    StringProperty,
    BooleanProperty,
    DateProperty,
    DateTimeProperty,
    RelationshipTo,
    RelationshipFrom,
    UniqueIdProperty,
    StructuredRel
)       

class Person(DjangoNode):
    uid = UniqueIdProperty()
    name = StringProperty(required=True)
    role = StringProperty()

    # --- Relationships ---
    # (Person)-[:WORKS_ON]->(Project)
    projects = RelationshipTo('Project', 'WORKS_ON')
    
    # Reverse lookups
    created_entries = RelationshipFrom('Entry', 'CREATED_BY')
    edited_entries = RelationshipFrom('Entry', 'EDITED_BY')


class Project(DjangoNode):
    uid = UniqueIdProperty()
    name = StringProperty(required=True, unique_index=True)
    description = StringProperty()

    # --- Relationships ---
    # Reverse lookups
    members = RelationshipFrom('Person', 'WORKS_ON')
    entries = RelationshipFrom('Entry', 'BELONGS_TO')


class EntryToEntryRel(StructuredRel):
    type = StringProperty()  # e.g., "depends_on", "caused_by", "resolves", "related_to"


class Entry(DjangoNode):
    uid = UniqueIdProperty()
    entry_type = StringProperty(required=True)  # decision, task, risk, fact
    title = StringProperty(required=True)
    content = StringProperty()
    date = DateProperty()
    status = StringProperty()
    requires_sign_off = BooleanProperty(default=False)
    stale_after = StringProperty()
    created_at = DateTimeProperty()
    updated_at = DateTimeProperty()
    reviewed_at = DateTimeProperty(default=None)

    # --- Graph Relationships ---
    # (Entry)-[:BELONGS_TO]->(Project)
    project = RelationshipTo('Project', 'BELONGS_TO')

    # (Entry)-[:CREATED_BY]->(Person)
    created_by = RelationshipTo('Person', 'CREATED_BY')

    # (Entry)-[:EDITED_BY]->(Person)
    edited_by = RelationshipTo('Person', 'EDITED_BY')

    # General involvement if needed (e.g., tagged stakeholders)
    involves = RelationshipTo('Person', 'INVOLVES')

    # (Entry)-[:RELATES_TO]->(Entry)
    related_entries = RelationshipTo('Entry', 'RELATES_TO', model=EntryToEntryRel)