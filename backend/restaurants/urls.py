from django.urls import path
from .views import RestaurantSignupView, RestaurantLoginView

urlpatterns = [
    path('signup/', RestaurantSignupView.as_view(), name='restaurant-signup'),
    path('login/', RestaurantLoginView.as_view(), name='restaurant-login'),
]
