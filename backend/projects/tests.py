from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
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


class ProjectSecurityTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            username="project_user_a",
            password="SecurePass!9328",
        )
        self.user_b = User.objects.create_user(
            username="project_user_b",
            password="SecurePass!9328",
        )

        self.project_a = Project.objects.create(
            owner=self.user_a,
            name="Private Project",
        )

        self.client = APIClient()
        self.token_b = Token.objects.create(user=self.user_b)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.token_b.key}"
        )

    def test_user_can_only_list_their_own_projects(self):
        response = self.client.get("/api/projects/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn(
            self.project_a.id,
            [project["id"] for project in response.data],
        )

    def test_user_cannot_retrieve_another_users_project(self):
        response = self.client.get(
            f"/api/projects/{self.project_a.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_new_project_is_owned_by_authenticated_user(self):
        response = self.client.post(
            "/api/projects/",
            {"name": "User B's New Project"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        project = Project.objects.get(
            name="User B's New Project"
        )
        self.assertEqual(project.owner, self.user_b)
