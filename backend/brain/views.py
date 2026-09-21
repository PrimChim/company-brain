from django.shortcuts import render
from django.http import HttpResponse
from config.neo4j import verify_connection

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from neomodel import db
from .models import *
from .serializers import *


def check_connection(request):
    connection = verify_connection()
    return HttpResponse(connection)

class EntryListCreateView(APIView):
    def get(self, request):
        entries = Entry.nodes.all()
        serializer = EntrySerializer(entries, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EntrySerializer(data=request.data)
        if serializer.is_valid():
            entry = serializer.save()
            return Response(EntrySerializer(entry).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PeopleView(APIView):
    
    # retrieve people
    def get(self, request):
        people = Person.nodes.all()
        serializer = PersonSerializer(people, many=True)
        return Response(serializer.data)
    
    # add people node
    def post(self, request):
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            person_instance = serializer.save()
            return Response(serializer.data ,status=status.HTTP_201_CREATED)
        
    # delete a people node with UID
    def delete(self, request, uid=None):
        if not uid:
            return Response(
                {"error": "UID parameter is required for deletion."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        person = Person.nodes.first_or_none(uid=uid)
        
        if not person:
            return Response(
                {"error": "Person with this UID does not exist."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Deletes the node and its relationships in Neo4j
        person.delete()
        
        return Response(
            {"message": f"Person with UID '{uid}' was successfully deleted."}, 
            status=status.HTTP_200_OK
        )
        
class ProjectsView(APIView):

    # retrieve people
    def get(self, request):
        # Cypher query to fetch projects along with connected entries & team members
        query = """
        MATCH (pr:Project)
        OPTIONAL MATCH (e:Entry)-[:BELONGS_TO]->(pr)
        OPTIONAL MATCH (e)-[:INVOLVES]->(p:Person)
        WITH pr, 
             count(DISTINCT e) AS connected_entries_count, 
             collect(DISTINCT p) AS team_members
        RETURN pr, connected_entries_count, team_members
        """
        results, _ = db.cypher_query(query)
        
        projects_data = []
        total_entries_count = 0
        all_unique_people = set()

        for row in results:
            pr_node = row[0]
            entries_count = row[1] or 0
            people_nodes = [p for p in row[2] if p]

            total_entries_count += entries_count
            for p in people_nodes:
                all_unique_people.add(p.get('uid'))

            members_list = [
                {
                    "id": p.get('uid'),
                    "name": p.get('name'),
                    "role": p.get('role', '')
                } for p in people_nodes
            ]

            projects_data.append({
                "id": pr_node.get('uid'),
                "name": pr_node.get('name'),
                "connected_entries_count": entries_count,
                "team_members_count": len(members_list),
                "team_members": members_list
            })

        response_payload = {
            "summary": {
                "active_projects": len(projects_data),
                "total_connected_entries": total_entries_count,
                "total_team_members": len(all_unique_people)
            },
            "projects": projects_data
        }

        return Response(response_payload, status=status.HTTP_200_OK)
    
    # add project node
    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                project_instance = serializer.save()
                return Response(serializer.data ,status=status.HTTP_201_CREATED)
            except:
                return Response({"error":"Project with same name already exists!"}, status=status.HTTP_409_CONFLICT)



# 1) Entries related to person, project, or both
class EntryFilteredListView(APIView):
    def get(self, request):
        person_id = request.query_params.get('personId')
        project_id = request.query_params.get('projectId')

        # Base pattern matching Entry
        query = "MATCH (e:Entry) "
        where_clauses = []
        params = {}

        if project_id:
            where_clauses.append("EXISTS { (e)-[:BELONGS_TO]->(:Project {uid: $project_id}) }")
            params['project_id'] = project_id

        if person_id:
            where_clauses.append("EXISTS { (e)-[:INVOLVES]->(:Person {uid: $person_id}) }")
            params['person_id'] = person_id

        if where_clauses:
            query += "WHERE " + " AND ".join(where_clauses) + " "

        query += "RETURN e"

        results, _ = db.cypher_query(query, params)
        entries = [Entry.inflate(row[0]) for row in results]

        return Response(EntrySerializer(entries, many=True).data, status=status.HTTP_200_OK)


# 2) Projects involving a specific person
class PersonProjectsListView(APIView):
    def get(self, request, uid):
        query = """
        MATCH (p:Person {uid: $uid})<-[:INVOLVES]-(e:Entry)-[:BELONGS_TO]->(pr:Project)
        RETURN DISTINCT pr
        """
        results, _ = db.cypher_query(query, {"uid": uid})
        projects = [Project.inflate(row[0]) for row in results]

        return Response(ProjectSerializer(projects, many=True).data, status=status.HTTP_200_OK)


# 3) People involved in a specific project
class ProjectPeopleListView(APIView):
    def get(self, request, uid):
        query = """
        MATCH (pr:Project {uid: $uid})<-[:BELONGS_TO]-(e:Entry)-[:INVOLVES]->(p:Person)
        RETURN DISTINCT p
        """
        results, _ = db.cypher_query(query, {"uid": uid})
        people = [Person.inflate(row[0]) for row in results]

        return Response(PersonSerializer(people, many=True).data, status=status.HTTP_200_OK)