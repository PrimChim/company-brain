from django.urls import path
from .views import *

urlpatterns = [
    path('check_connection/', check_connection, name='check_connection'),
    
    path('api/people/', PeopleView.as_view(), name='people'),
    path('api/people/<str:uid>/', PeopleView.as_view(), name='people-detail-delete'),
    
    path('api/projects/', ProjectsView.as_view(), name='projects'),
    path('api/entries/', EntryListCreateView.as_view(), name='entry'),
    path('api/entries/<str:uid>/', EntryListCreateView.as_view(), name='delete-entry'),
    path('api/entries/retrieve/', EntryFilteredListView.as_view(), name='entry-list'),

    path('api/nlp/', NaturalLanguageQueryView.as_view(), name='nlp-query'),
]
