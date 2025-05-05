from django.urls import path
from .views import RestaurantSignupView, RestaurantLoginView, ProtectedView,VerifyAccessTokenView,MenuItemDetailView,MenuItemListCreateView,BranchDetailView,BranchListCreateView
from .views import MenuCategoryListView,NotficationListView,GetAccessTokenView,DealCreateView,DealUpdateView,NotficationUpdateView,DealDeleteView
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
    path("menuCategory/",MenuCategoryListView.as_view(),name="menuCategory"),
    path("notifications/",NotficationListView.as_view(),name="notifications"),
    path("notifications/<int:pk>",NotficationUpdateView.as_view(),name="notification-update"),
    path("create-deal/",DealCreateView.as_view(),name="create-deal"),
    path("update-deal/<int:pk>/",DealUpdateView.as_view(),name="update-deal"),
    path("delete-deal/<int:pk>/",DealDeleteView.as_view(),name="update-deal"),


]
