import requests
from django.conf import settings
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed

class SupabaseJWTAuthentication(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            raise AuthenticationFailed("No valid token provided")

        token = auth_header.split(" ")[1]

        # Validate token using Supabase
        response = requests.get(f"{settings.SUPABASE_URL}/auth/v1/user", headers={
            "Authorization": f"Bearer {token}",
            "apikey": settings.SUPABASE_KEY
        })

        if response.status_code != 200:
            raise AuthenticationFailed("Invalid token")

        request.user = response.json()  # Store user info
        return True
