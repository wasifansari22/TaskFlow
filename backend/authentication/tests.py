from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token


class AccountSecurityTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="security_user",
            email="security@example.com",
            password="SecurePass!9328",
        )
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()

    def test_profile_requires_authentication(self):
        response = self.client.get("/api/auth/profile/")
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_password_change_requires_authentication(self):
        response = self.client.post(
            "/api/auth/change-password/",
            {
                "current_password": "SecurePass!9328",
                "new_password": "AnotherSecure!8427",
                "confirm_new_password": "AnotherSecure!8427",
            },
            format="json",
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_password_change_invalidates_old_token(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.token.key}"
        )

        response = self.client.post(
            "/api/auth/change-password/",
            {
                "current_password": "SecurePass!9328",
                "new_password": "AnotherSecure!8427",
                "confirm_new_password": "AnotherSecure!8427",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

        new_token = response.data["token"]
        self.assertNotEqual(new_token, self.token.key)

        # The old token must no longer authenticate.
        old_token_response = self.client.get("/api/auth/profile/")
        self.assertEqual(
            old_token_response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        # The replacement token should authenticate.
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {new_token}"
        )
        new_token_response = self.client.get("/api/auth/profile/")
        self.assertEqual(
            new_token_response.status_code,
            status.HTTP_200_OK,
        )

    def test_wrong_current_password_is_rejected(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.token.key}"
        )

        response = self.client.post(
            "/api/auth/change-password/",
            {
                "current_password": "WrongPassword!123",
                "new_password": "AnotherSecure!8427",
                "confirm_new_password": "AnotherSecure!8427",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertTrue(
            Token.objects.filter(key=self.token.key).exists()
        )
