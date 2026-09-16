from django.shortcuts import render
from django.http import HttpResponse
from config.neo4j import verify_connection

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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
    
    # add project node
    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                project_instance = serializer.save()
                return Response(serializer.data ,status=status.HTTP_201_CREATED)
            except:
                return Response({"error":"Project with same name already exists!"}, status=status.HTTP_409_CONFLICT)