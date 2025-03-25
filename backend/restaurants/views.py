from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RestaurantSerializer
from .models import Restaurant
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework_simplejwt.exceptions import TokenError


class RestaurantSignupView(CreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]

class RestaurantLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        restaurant = Restaurant.objects.filter(email=email).first()

        if restaurant and restaurant.check_password(password):
            refresh=RefreshToken.for_user(restaurant)

            return Response({"message": "Login successful", "restaurant_id": restaurant.id,"access_token":str(refresh.access_token),"refresh_token":str(refresh)})
        return Response({"error": "Invalid credentials"}, status=400)
    
class ProtectedView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        return Response({"message":f"Your successfully authenicated {request.restaurant.name}"})
    

class VerifyAccessTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        access_token = request.data.get("access_token")

        if not access_token:
            return Response({"error": "Access token is required"}, status=400)

        try:
            token = AccessToken(access_token)
            return Response({"message": "Token is valid", "user_id": token["user_id"]})
        except TokenError:
            return Response({"error": "Invalid or expired access token"}, status=400)

