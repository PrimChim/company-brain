from django.urls import path
from .views import *

urlpatterns = [
    path('check_connection/', check_connection, name='check_connection')
]
