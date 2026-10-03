from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from projects.models import Project
from .models import Task


class TaskAPITests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username="user1",
            password="testpass123",
        )
        self.user2 = User.objects.create_user(
            username="user2",
            password="testpass123",
        )
        self.project1 = Project.objects.create(
            owner=self.user1,
            name="User 1 Project",
        )
        self.project2 = Project.objects.create(
            owner=self.user2,
            name="User 2 Project",
        )
        self.task1 = Task.objects.create(
            owner=self.user1,
            title="User 1 Task",
            project=self.project1,
        )
        self.task2 = Task.objects.create(
            owner=self.user2,
            title="User 2 Task",
            project=self.project2,
        )

    def test_unauthenticated_user_cannot_access_tasks(self):
        response = self.client.get("/api/tasks/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_user_only_sees_own_tasks(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.get("/api/tasks/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.task1.id)

    def test_user_can_assign_own_project_to_task(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.post(
            "/api/tasks/",
            {
                "title": "New Task",
                "description": "Test task",
                "priority": "Medium",
                "status": "Pending",
                "project": self.project1.id,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            response.data["project"],
            self.project1.id,
        )

    def test_user_cannot_assign_another_users_projects(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.post(
            "/api/tasks/",
            {
                "title": "Invalid Task",
                "description": "This should fail",
                "priority": "Medium",
                "status": "Pending",
                "project": self.project2.id,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "project",
            response.data,
        )
