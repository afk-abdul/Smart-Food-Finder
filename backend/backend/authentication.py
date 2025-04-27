from rest_framework_simplejwt.authentication import JWTAuthentication
from restaurants.models import Restaurant
from users.models import User
from rest_framework import exceptions

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token["user_id"]
        except KeyError:
            raise exceptions.AuthenticationFailed("Token contained no recognizable user identification")

        try:
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            pass
        
        try:
            restaurant = Restaurant.objects.get(id=user_id)
            return restaurant
        except Restaurant.DoesNotExist:
            pass

        raise exceptions.AuthenticationFailed("User not found")
