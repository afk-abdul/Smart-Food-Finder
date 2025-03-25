from django.urls import path
from .views import RestaurantSignupView, RestaurantLoginView, ProtectedView,VerifyAccessTokenView

urlpatterns = [
    path('signup/', RestaurantSignupView.as_view(), name='restaurant-signup'),
    path('login/', RestaurantLoginView.as_view(), name='restaurant-login'),
    path('protected/', ProtectedView.as_view(), name='restaurant-protected'),
    path("verify-access-token/", VerifyAccessTokenView.as_view(), name="verify_access_token"),

]
