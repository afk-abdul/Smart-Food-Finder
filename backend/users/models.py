from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True)
    preferences = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    read = models.BooleanField(default=False)
    deal=models.ForeignKey('restaurants.Deal', on_delete=models.CASCADE)

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey('restaurants.Restaurant', on_delete=models.CASCADE)
    text = models.TextField()
    rate = models.IntegerField()
    time_date = models.DateTimeField(auto_now_add=True)
    image = models.TextField(blank=True, null=True)

class Favourite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey('restaurants.Restaurant', on_delete=models.CASCADE)

