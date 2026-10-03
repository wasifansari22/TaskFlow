from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Project


class ProjectAPITests(APITestCase):

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

    def test_unauthenticated_user_cannot_access_projects(self):
        response = self.client.get("/api/projects/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_user_only_sees_own_projects(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.get("/api/projects/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.project1.id)

    def test_user_cannot_access_another_users_project(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.get(
            f"/api/projects/{self.project2.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )
