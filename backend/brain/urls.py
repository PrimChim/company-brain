from django.urls import path
from .views import *

urlpatterns = [
    path('check_connection/', check_connection, name='check_connection'),
    path('api/entries/', EntryListCreateView.as_view(), name='entry_list'),
]
