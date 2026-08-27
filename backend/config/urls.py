from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("backend_app.urls")),
    path("api/", include("tasks.urls")),
    path("api/", include("projects.urls")),
    path("api/auth/", include("authentication.urls")),
]
