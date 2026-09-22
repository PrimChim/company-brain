from rest_framework import serializers
from .models import Entry, Person, Project

class PersonSerializer(serializers.Serializer):
    uid = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=100)
    role = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        return Person(**validated_data).save()

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.role = validated_data.get('role', instance.role)
        instance.save()
        return instance


class RelatedEntryInputSerializer(serializers.Serializer):
    target_id = serializers.CharField()
    relationship_type = serializers.CharField()


class EntrySerializer(serializers.Serializer):
    id = serializers.CharField(source='uid', read_only=True)
    type = serializers.CharField(source='entry_type')
    title = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)
    date = serializers.DateField(required=False)
    status = serializers.CharField()
    requiresSignOff = serializers.BooleanField(source='requires_sign_off', default=False)
    staleAfter = serializers.CharField(source='stale_after', required=False)
    
    # WRITE-ONLY FIELDS
    projectId = serializers.CharField(write_only=True)
    createdBy = serializers.CharField(write_only=True, required=False)
    editedByIds = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    relatedEntries = RelatedEntryInputSerializer(many=True, write_only=True, required=False)
    involvedIds = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    # READ-ONLY FIELDS
    project = serializers.SerializerMethodField(read_only=True)
    created_by = serializers.SerializerMethodField(read_only=True)
    edited_by = serializers.SerializerMethodField(read_only=True)
    related = serializers.SerializerMethodField(read_only=True)
    involves = serializers.SerializerMethodField(read_only=True)

    def get_project(self, obj):
        proj = obj.project.single()
        return {"id": proj.uid, "name": proj.name} if proj else None

    def get_created_by(self, obj):
        creator = obj.created_by.single()
        return {"id": creator.uid, "name": creator.name, "role": creator.role} if creator else None

    def get_edited_by(self, obj):
        return [{"id": p.uid, "name": p.name, "role": p.role} for p in obj.edited_by.all()]

    def get_involves(self, obj):
        return [{"id": p.uid, "name": p.name, "role": p.role} for p in obj.involves.all()]

    def get_related(self, obj):
        related_data = []
        for target in obj.related_entries.all():
            target_node = Entry.inflate(target) if not isinstance(target, Entry) and hasattr(target, "labels") else target
            try:
                rel = obj.related_entries.relationship(target_node)
                related_data.append({
                    "id": target_node.uid,
                    "title": getattr(target_node, "title", ""),
                    "rel_type": getattr(rel, "type", None) if rel else None
                })
            except Exception:
                continue
        return related_data

    def create(self, validated_data):
        # 1. Extract relationship payload parameters
        project_id = validated_data.pop('projectId')
        created_by_id = validated_data.pop('createdBy', None)
        edited_by_ids = validated_data.pop('editedByIds', [])
        related_entries = validated_data.pop('relatedEntries', [])
        involved_ids = validated_data.pop('involvedIds', [])

        # 2. Create base Entry node
        entry = Entry(**validated_data).save()

        # 3. Connect to Project
        try:
            project_node = Project.nodes.get(uid=project_id)
            entry.project.connect(project_node)
        except Project.DoesNotExist:
            raise serializers.ValidationError({"projectId": "Project not found."})

        # 4. Connect to Creator
        if created_by_id:
            try:
                creator_node = Person.nodes.get(uid=created_by_id)
                entry.created_by.connect(creator_node)
            except Person.DoesNotExist:
                pass

        # 5. Connect to Editors
        for eid in edited_by_ids:
            try:
                editor_node = Person.nodes.get(uid=eid)
                entry.edited_by.connect(editor_node)
            except Person.DoesNotExist:
                pass

        # 6. Connect Involved People (INVOLVES)
        for pid in involved_ids:
            try:
                person_node = Person.nodes.get(uid=pid)
                entry.involves.connect(person_node)
            except Person.DoesNotExist:
                pass

        # 7. Connect related Entries
        for rel in related_entries:
            try:
                target_entry = Entry.nodes.get(uid=rel['target_id'])
                entry.related_entries.connect(target_entry, {'type': rel['relationship_type']})
            except Entry.DoesNotExist:
                pass

        return entry


class ProjectSerializer(serializers.Serializer):
    uid = serializers.CharField(read_only=True)
    name = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    
    def create(self, validated_data):
        return Project(**validated_data).save()