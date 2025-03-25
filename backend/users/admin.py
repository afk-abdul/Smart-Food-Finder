from django.contrib import admin
from .models import User,Notification,Review,Favourite


admin.site.register(User)
admin.site.register(Notification)
admin.site.register(Review)
admin.site.register(Favourite)
