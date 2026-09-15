from django.contrib import admin
from django.urls import path, include, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('brain/', include('brain.urls')),
    re_path(r'^auth/', include('djoser.urls')),
    # Djoser Token authentication (token/login/, token/logout/)
    path('auth/', include('djoser.urls.jwt')),  # Enables /auth/jwt/create/
]
