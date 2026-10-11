from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
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


class TaskSecurityTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            username="user_a",
            password="SecurePass!9328",
        )
        self.user_b = User.objects.create_user(
            username="user_b",
            password="SecurePass!9328",
        )

        self.project_a = Project.objects.create(
            owner=self.user_a,
            name="User A Project",
        )
        self.task_a = Task.objects.create(
            owner=self.user_a,
            project=self.project_a,
            title="User A Task",
        )

        self.client = APIClient()
        self.token_b = Token.objects.create(user=self.user_b)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.token_b.key}"
        )

    def test_user_can_only_list_their_own_tasks(self):
        response = self.client.get("/api/tasks/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn(
            self.task_a.id,
            [task["id"] for task in response.data],
        )

    def test_user_cannot_access_another_users_task(self):
        response = self.client.get(
            f"/api/tasks/{self.task_a.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_update_another_users_task(self):
        response = self.client.patch(
            f"/api/tasks/{self.task_a.id}/",
            {"title": "Unauthorized change"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.task_a.refresh_from_db()
        self.assertEqual(self.task_a.title, "User A Task")

    def test_user_cannot_delete_another_users_task(self):
        response = self.client.delete(
            f"/api/tasks/{self.task_a.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Task.objects.filter(pk=self.task_a.id).exists())

    def test_user_cannot_assign_another_users_project(self):
        response = self.client.post(
            "/api/tasks/",
            {
                "title": "Unauthorized project task",
                "project": self.project_a.id,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertFalse(
            Task.objects.filter(
                owner=self.user_b,
                title="Unauthorized project task",
            ).exists()
        )
