from django.shortcuts import render
from django.http import HttpResponse
from config.neo4j import verify_connection
# Create your views here.

def check_connection(request):
    connection = verify_connection()
    return HttpResponse(connection)