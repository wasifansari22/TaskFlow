from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer

User = get_user_model()


class LoginView(APIView):

    def post(self, request):
        identifier = request.data.get("identifier")
        password = request.data.get("password")

        if not identifier or not password:
            return Response(
                {
                    "detail": "Username/email and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        identifier = identifier.strip()

        # Try to find the user by email first.
        user_by_email = (
            User.objects.filter(email__iexact=identifier).first()
        )

        username = (
            user_by_email.username
            if user_by_email
            else identifier
        )

        user = authenticate(
            username=username,
            password=password,
        )

        if user is None:
            return Response(
                {
                    "detail": "Invalid username/email or password."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, created = Token.objects.get_or_create(user=user)
        full_name = f"{user.first_name} {user.last_name}".strip()

        return Response(
            {
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "name": full_name or user.username,
                },
            },
            status=status.HTTP_200_OK,
        )


class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save()

        token, created = Token.objects.get_or_create(user=user)

        full_name = f"{user.first_name} {user.last_name}".strip()

        return Response(
            {
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "name": full_name or user.username,
                },
            },
            status=status.HTTP_201_CREATED,
        )
