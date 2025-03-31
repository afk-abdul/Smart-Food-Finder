from rest_framework.generics import CreateAPIView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RestaurantSerializer ,MenuItemSerializer ,BranchSerializer,MenuCategorySerializer,NotificationRestaurantSerializer,DealSerializer
from .models import Restaurant ,MenuItem,Branch,MenuCategory,DealItem,Deal,NotificationRestaurant
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils.timezone import now


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
    

class GetAccessTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=400)

        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)
            return Response({"access_token": new_access_token})
        except TokenError:
            return Response({"error": "Invalid or expired refresh token"}, status=400)



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

class MenuItemListCreateView(generics.ListCreateAPIView):
    serializer_class=MenuItemSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        restaurant = Restaurant.objects.filter(id=self.request.user.id).first()
        if restaurant:
            return MenuItem.objects.filter(restaurant=restaurant)
        return MenuItem.objects.none()

    
    def perform_create(self, serializer):
        restaurant = Restaurant.objects.filter(id=self.request.user.id).first()
        if serializer.is_valid():
            serializer.save(restaurant=restaurant)
        else:
            print(serializer.errors)


class MenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        restaurant = Restaurant.objects.filter(id=self.request.user.id).first()
        if restaurant:
            return MenuItem.objects.filter(restaurant=restaurant)
        return MenuItem.objects.none()


class BranchListCreateView(generics.ListCreateAPIView):
    serializer_class=BranchSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        restaurant = Restaurant.objects.filter(id=self.request.user.id).first()
        return Branch.objects.filter(restaurant=restaurant)
    def perform_create(self, serializer):
        if serializer.is_valid():
            restaurant = Restaurant.objects.filter(id=self.request.user.id).first()
            branches=Branch.objects.filter(restaurant=restaurant)
            is_main_branch = not branches.exists()
            serializer.save(restaurant=restaurant,is_main=is_main_branch)


class BranchDetailView(generics.UpdateDestroyAPIView):
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        restaurant = Restaurant.objects.filter(id=self.request.user.id).first()

        return Branch.objects.filter(restaurant=restaurant)


class MenuCategoryListView(generics.ListAPIView):
    queryset=MenuCategory.objects.all()
    serializer_class=MenuCategorySerializer
    permission_classes=[AllowAny]


class NotficationListView(generics.RetrieveUpdateAPIView):
    serializer_class=NotificationRestaurantSerializer
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        return NotificationRestaurant.objects.filter(restaurant=self.request.user)
    


class DealCreateView(generics.ListCreateAPIView):
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        restaurant = Restaurant.objects.filter(id=self.request.user.id).first()
        serializer.save(restaurant=restaurant)
    
    def get_queryset(self):
        restaurant = Restaurant.objects.filter(id=self.request.user.id).first()
        return Deal.objects.filter(restaurant=restaurant, is_valid=True, dateTime__gte=now().date())
    
class DealUpdateView(generics.UpdateAPIView):
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        restaurant = Restaurant.objects.filter(id=self.request.user.id).first()
        if restaurant:
            return Deal.objects.filter(restaurant=restaurant)
        return Deal.objects.none()

        