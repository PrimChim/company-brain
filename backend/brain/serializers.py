from rest_framework import serializers
from .models import Entry, Person, Project

class PersonSerializer(serializers.Serializer):
    uid = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=100)

    def create(self, validated_data):
        # Create and save a node in Neo4j
        return Person(**validated_data).save()

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance
    

class RelatedEntryInputSerializer(serializers.Serializer):
    target_id = serializers.CharField()
    relationship_type = serializers.CharField()

class EntrySerializer(serializers.Serializer):
    id = serializers.CharField(source='uid', read_only=True)
    type = serializers.CharField(source='entry_type')
    title = serializers.CharField()
    content = serializers.CharField()
    date = serializers.DateField(required=False)
    status = serializers.CharField()
    requiresSignOff = serializers.BooleanField(source='requires_sign_off', default=False)
    staleAfter = serializers.CharField(source='stale_after', required=False)
    
    # WRITE-ONLY FIELDS (Received from Postman / Frontend JSON payload)
    projectId = serializers.CharField(write_only=True)
    peopleIds = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    relatedEntries = RelatedEntryInputSerializer(many=True, write_only=True, required=False)

    # READ-ONLY FIELDS (Returned in GET JSON responses)
    project = serializers.SerializerMethodField(read_only=True)
    people = serializers.SerializerMethodField(read_only=True)
    related = serializers.SerializerMethodField(read_only=True)

    def get_project(self, obj):
        proj = obj.project.single()
        return {"id": proj.uid, "name": proj.name} if proj else None

    def get_people(self, obj):
        return [{"id": p.uid, "name": p.name, "role": p.role} for p in obj.people.all()]

    def get_related(self, obj):
        result = []
        for rel in obj.related_entries.definition: # Traverse relationships
            target_node = obj.related_entries.single()
            rel_obj = obj.related_entries.relationship(target_node)
            if target_node and rel_obj:
                result.append({
                    "id": target_node.uid,
                    "title": target_node.title,
                    "relationshipType": rel_obj.type
                })
        return result

    def create(self, validated_data):
        # 1. Extract relationship payload arrays
        project_id = validated_data.pop('projectId')
        people_ids = validated_data.pop('peopleIds', [])
        related_entries = validated_data.pop('relatedEntries', [])

        # 2. Create base Entry node
        entry = Entry(**validated_data).save()

        # 3. Connect to Project
        try:
            project_node = Project.nodes.get(uid=project_id)
            entry.project.connect(project_node)
        except Project.DoesNotExist:
            raise serializers.ValidationError({"projectId": "Project not found."})

        # 4. Connect to People
        for pid in people_ids:
            try:
                person_node = Person.nodes.get(uid=pid)
                entry.people.connect(person_node)
            except Person.DoesNotExist:
                pass

        # 5. Connect to related Entries with relationship property
        for rel in related_entries:
            try:
                target_entry = Entry.nodes.get(uid=rel['target_id'])
                entry.related_entries.connect(target_entry, {'type': rel['relationship_type']})
            except Entry.DoesNotExist:
                pass

        return entry