from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "priority",
            "status",
            "due_date",
            "project",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_project(self, project):
        request = self.context.get("request")
        if request and project and project.owner != request.user:
            raise serializers.ValidationError(
                "You can only assign tasks to your own projects.")
        return project
