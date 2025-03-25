
from django.contrib import admin
from .models import Restaurant, MenuCategory, MenuItem, Deal,DealItem,NotificationRestaurant

admin.site.register(Restaurant)
admin.site.register(MenuCategory)
admin.site.register(MenuItem)
admin.site.register(Deal)
admin.site.register(DealItem)
admin.site.register(NotificationRestaurant)