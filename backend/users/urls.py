from django.urls import path
from .views import (
    UserSignupView, UserLoginView, TokenRefreshView,
    RestaurantDetailView, RestaurantSearchView, RestaurantListView,VerifyAccessTokenView,GetAccessTokenView,AllBranchesByRestaurant,AllMenuItemsByRestaurant,RestaurantDealsView,SimilarRestaurantsAPIView,FoodImageSearchView,AddToFavouriteView,FavouriteListView,RemoveFromFavouriteView
)

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='user-signup'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('restaurant/<int:pk>/', RestaurantDetailView.as_view(), name='restaurant-detail'),
    path('restaurants/search/', RestaurantSearchView.as_view(), name='restaurant-search'),
     path('restaurant/', RestaurantListView.as_view(), name='restaurant-list'),
        path("verify-access-token/", VerifyAccessTokenView.as_view(), name="verify_access_token"),
    path("get-access-token/", GetAccessTokenView.as_view(), name="get_access_token"),
        path('restaurant/<int:restaurant_id>/branches/', AllBranchesByRestaurant.as_view(), name='restaurant-branches'),
    path('restaurant/<int:restaurant_id>/menu-items/', AllMenuItemsByRestaurant.as_view(), name='restaurant-menu-items'),
     path('restaurant/<int:restaurant_id>/deals/', RestaurantDealsView.as_view(), name='restaurant-deals'),
        path('restaurant/similar/<int:restaurant_id>/', SimilarRestaurantsAPIView.as_view()),
path('restaurant/image-search/', FoodImageSearchView.as_view(), name='food-image-search'),
        path('restaurant/favourites/', FavouriteListView.as_view(), name='list_favourites'),
        path('restaurant/favourites/add/<int:restaurant_id>/', AddToFavouriteView.as_view(), name='add_to_favourites'),
        path('restaurant/favourites/remove/<int:restaurant_id>/', RemoveFromFavouriteView.as_view(), name='remove_from_favourites'),

]
