from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    # One user can own many projects
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="projects",
    )

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Completed", "Completed"),
        ("On Hold", "On Hold"),
    ]

    PRIORITY_CHOICES = [
        ("High", "High"),
        ("Medium", "Medium"),
        ("Low", "Low"),
    ]

    name = models.CharField(max_length=200)

    description = models.TextField(
        blank=True,
        default="No description provided.",
    )

    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default="Medium",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Active",
    )

    due_date = models.DateField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
