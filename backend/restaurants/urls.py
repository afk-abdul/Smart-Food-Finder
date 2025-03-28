from django.urls import path
from .views import RestaurantSignupView, RestaurantLoginView, ProtectedView,VerifyAccessTokenView,MenuItemDetailView,MenuItemListCreateView,BranchDetailView,BranchListCreateView
from .views import MenuCategoryListView,NotficationListView,GetAccessTokenView
urlpatterns = [
    path('signup/', RestaurantSignupView.as_view(), name='restaurant-signup'),
    path('login/', RestaurantLoginView.as_view(), name='restaurant-login'),
    path('protected/', ProtectedView.as_view(), name='restaurant-protected'),
    path("verify-access-token/", VerifyAccessTokenView.as_view(), name="verify_access_token"),
    path("get-access-token/", GetAccessTokenView.as_view(), name="get_access_token"),
    path("menu-items/", MenuItemListCreateView.as_view(), name="menu-item-list-create"),
    path("menu-items/<int:pk>/", MenuItemDetailView.as_view(), name="menu-item-detail"),
    path("branchs/",BranchListCreateView.as_view(),name="branch-create"),
    path("branchs/<int:pk>/",BranchDetailView.as_view(),name="branch-detail"),
    path("menuCategory",MenuCategoryListView.as_view(),name="menuCategory"),
    path("notifications/<int:pk>/",NotficationListView.as_view(),name="notification-detail"),


]
