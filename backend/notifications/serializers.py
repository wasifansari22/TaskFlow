from rest_framework import serializers
from projects.models import Project
from tasks.models import Task
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    related_task = serializers.PrimaryKeyRelatedField(
        queryset=Task.objects.all(),
        required=False,
        allow_null=True,
    )
    related_project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Notification
        fields = [
            "id",
            "title",
            "message",
            "type",
            "read",
            "created_at",
            "related_task",
            "related_project",
        ]
        read_only_fields = ["id", "created_at"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request and request.user.is_authenticated:
            self.fields["related_task"].queryset = Task.objects.filter(
                owner=request.user
            )
            self.fields["related_project"].queryset = Project.objects.filter(
                owner=request.user
            )

        # Existing notifications may only have their read state changed.
        if self.instance is not None:
            for field_name in (
                "title",
                "message",
                "type",
                "related_task",
                "related_project",
            ):
                self.fields[field_name].read_only = True
