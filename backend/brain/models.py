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

class Project(DjangoNode):
    uid = UniqueIdProperty()
    name = StringProperty(required=True)

# Custom relationship to handle relationships between entries (e.g., depends_on, resolves)
class EntryToEntryRel(StructuredRel):
    type = StringProperty()  # e.g., "depends_on", "caused_by", "resolves", "related_to"

class Entry(DjangoNode):
    uid = UniqueIdProperty()
    entry_type = StringProperty(required=True) # decision, task, risk, fact
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

    # (Entry)-[:INVOLVES]->(Person)
    people = RelationshipTo('Person', 'INVOLVES')

    # (Entry)-[:RELATES_TO]->(Entry)
    related_entries = RelationshipTo('Entry', 'RELATES_TO', model=EntryToEntryRel)