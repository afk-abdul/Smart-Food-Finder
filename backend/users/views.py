from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from restaurants.models import Restaurant, Branch, MenuItem
from restaurants.serializers import RestaurantSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.exceptions import TokenError
from restaurants.models import Deal, Restaurant
from restaurants.serializers import DealSerializer
from django.shortcuts import get_object_or_404
from restaurants.models import Branch, MenuItem  # Import from restaurants app
from restaurants.serializers import BranchSerializer, MenuItemSerializer  # Reuse existing serializers
import requests
import re
import inflect
from rapidfuzz import fuzz
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Favourite
from restaurants.models import Restaurant
from .models import Favourite
from .serializers import FavouriteSerializer  

class AllBranchesByRestaurant(APIView):
    permission_classes = [AllowAny]

    def get(self, request, restaurant_id):
        branches = Branch.objects.filter(restaurant_id=restaurant_id)
        serializer = BranchSerializer(branches, many=True)
        return Response(serializer.data)

class AllMenuItemsByRestaurant(APIView):
    permission_classes = [AllowAny]

    def get(self, request, restaurant_id):
        menu_items = MenuItem.objects.filter(restaurant_id=restaurant_id)
        serializer = MenuItemSerializer(menu_items, many=True)
        return Response(serializer.data)



class RestaurantDealsView(APIView):
    permission_classes = [AllowAny  ]

    def get(self, request, restaurant_id):
        restaurant = get_object_or_404(Restaurant, id=restaurant_id)
        deals = Deal.objects.filter(restaurant=restaurant)
        serializer = DealSerializer(deals, many=True)
        return Response(serializer.data)
User = get_user_model()

class UserSignupView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "user_id": user.id,
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            })
        return Response({"error": "Invalid credentials"}, status=400)

class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=400)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({"access_token": access_token})
        except Exception as e:
            return Response({"error": str(e)}, status=400) 
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


class RestaurantDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            restaurant = Restaurant.objects.get(pk=pk)
            serializer = RestaurantSerializer(restaurant)
            return Response(serializer.data)
        except Restaurant.DoesNotExist:
            return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)




class RestaurantSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        name = request.query_params.get("name")
        city = request.query_params.get("city")
        price = request.query_params.get("price")
        item = request.query_params.get("item")
        cuisine = request.query_params.get("cuisine")

        queryset = Restaurant.objects.all()

        if name:
            queryset = queryset.filter(name__icontains=name)

        if cuisine:
            queryset = queryset.filter(cuisine__icontains=cuisine)

        if city:
            queryset = queryset.filter(branch__city__icontains=city).distinct()

        if price:
            try:
                price = float(price)
                queryset = queryset.filter(menuitem__price__lte=price).distinct()
            except ValueError:
                return Response({"error": "Invalid price value"}, status=400)

        if item:
            queryset = queryset.filter(menuitem__name__icontains=item).distinct()

        # If any of name, cuisine, or item is provided and should work as a combined search input
        combined = request.query_params.get("search")
        if combined:
            queryset = queryset.filter(
                Q(name__icontains=combined) |
                Q(cuisine__icontains=combined) |
                Q(menuitem__name__icontains=combined)
            ).distinct()

        serializer = RestaurantSerializer(queryset.distinct(), many=True)
        return Response(serializer.data)


class RestaurantListView(generics.ListAPIView):
    permission_classes = [AllowAny]

    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

class SimilarRestaurantsAPIView(APIView):
    def get(self, request, restaurant_id):
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response({"detail": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

        if not restaurant.cuisine:
            return Response({"detail": "No cuisine information available for this restaurant."}, status=status.HTTP_400_BAD_REQUEST)

        similar_restaurants = Restaurant.objects.exclude(id=restaurant.id).filter(cuisine=restaurant.cuisine)

        serializer = RestaurantSerializer(similar_restaurants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
# from django.conf import settings


class FoodImageSearchView(APIView):
    def post(self, request):
        api_key = "3c7a910c451663c1c5ca37d95f55918289be56e5"
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)

        api_url = 'https://api.logmeal.com/v2/image/recognition/dish'
        headers = {
            'Authorization': f'Bearer {api_key}'
        }
        files = {'image': image_file}

        response = requests.post(api_url, headers=headers, files=files)

        print(f"Status code: {response.status_code}")
        try:
            data = response.json()
            # print("Response JSON:", data)
        except ValueError:
            print("Non-JSON response:", response.text)
            return Response({'error': 'Invalid response from food recognition service.'}, status=response.status_code)

        if not data.get('recognition_results'):
            return Response({'error': 'No food recognized.'}, status=status.HTTP_404_NOT_FOUND)
        
        

        p = inflect.engine()

        dish_name = data['recognition_results'][0]['name']
        print(f"Recognized dish name: {dish_name}")
        keywords = re.findall(r'\w+', dish_name.lower())  # ['chocolate', 'croissant']

        # Normalize words to singular
        normalized_keywords = set()
        for word in keywords:
            singular = p.singular_noun(word)
            normalized_keywords.add(singular if singular else word)

        # Get all menu items (or cache this for performance)
        all_menu_items = MenuItem.objects.all()
        matched_items = []

        for item in all_menu_items:
            name = item.name.lower()
            for keyword in normalized_keywords:
                if fuzz.partial_ratio(keyword, name) >= 80:  # Adjustable threshold
                    matched_items.append(item)
                    break  # avoid duplicates

        if not matched_items:
            return Response({'error': 'No matching menu items found.'}, status=status.HTTP_404_NOT_FOUND)

        # Find restaurants with those menu items
        restaurants = Restaurant.objects.filter(menuitem__in=matched_items).distinct()
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# views.py
# Updated AddToFavouriteView with authentication fix
class AddToFavouriteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, restaurant_id):
        user = request.user

        # Check if the restaurant already exists in favourites
        if Favourite.objects.filter(user=user, restaurant_id=restaurant_id).exists():
            return Response({'detail': f'Already in favourites for user {user.username}.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response({'detail': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)

        Favourite.objects.create(user=user, restaurant=restaurant)
        return Response({'detail': f'Added to favourites for user {user.username}.'}, status=status.HTTP_201_CREATED)


from rest_framework.exceptions import APIException

class FavouriteListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            favourites = Favourite.objects.filter(user=request.user).select_related('restaurant')
            serializer = FavouriteSerializer(favourites, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            # Log the error for debugging
            print(f"Error in FavouriteListView: {e}")
            raise APIException("Could not fetch favourites. Please try again later.")



class RemoveFromFavouriteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, restaurant_id):
        user = request.user
        try:
            favourite = Favourite.objects.get(user=user, restaurant_id=restaurant_id)
            favourite.delete()
            return Response({'detail': f'Removed from favourites for user {user.username}.'}, status=status.HTTP_204_NO_CONTENT)
        except Favourite.DoesNotExist:
            return Response({'detail': f'Not in favourites for user {user.username}.'}, status=status.HTTP_404_NOT_FOUND)