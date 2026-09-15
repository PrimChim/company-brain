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