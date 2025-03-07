from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RestaurantSerializer
from .models import Restaurant

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
            return Response({"message": "Login successful", "restaurant_id": restaurant.id})
        return Response({"error": "Invalid credentials"}, status=400)
