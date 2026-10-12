from django.db import models
from django.conf import settings


class Notification(models.Model):
    TYPE_CHOICES = [
        ("task-created", "Task Created"),
        ("task-updated", "Task Updated"),
        ("task-completed", "Task Completed"),
        ("task-deleted", "Task Deleted"),
        ("project-created", "Project Created"),
        ("project-updated", "Project Updated"),
        ("project-deleted", "Project Deleted"),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    read = models.BooleanField(default=False)

    related_task = models.ForeignKey(
        "tasks.Task",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notifications",
    )
    related_project = models.ForeignKey(
        "projects.Project",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notifications",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
