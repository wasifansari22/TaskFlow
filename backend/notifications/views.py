from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "delete", "post", "head", "options"]

    def get_queryset(self):
        return Notification.objects.filter(owner=self.request.user)

    @action(detail=False, methods=["post"], url_path="mark-all-read")
    def mark_all_read(self, request):
        self.get_queryset().filter(read=False).update(read=True)
        return Response({"detail": "All notifications marked as read."})

    @action(detail=False, methods=["post"], url_path="clear-all")
    def clear_all(self, request):
        self.get_queryset().delete()
        return Response({"detail": "Notification cleared."})

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
