from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Project(models.Model):
    # one user can own many projects
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

    name = models.CharField(max_length=200)

    description = models.TextField(
        blank=True,
        default="No description provided."
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Active",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name
