
from django.db import models
from users.models import User
from django.utils.timezone import now

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class RestaurantManager(BaseUserManager):
    def create_restaurant(self, email, name, password=None):
        if not email:
            raise ValueError("Restaurant must have an email address")
        restaurant = self.model(email=self.normalize_email(email), name=name)
        restaurant.set_password(password)
        restaurant.save(using=self._db)
        return restaurant

class Restaurant(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    cuisine = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = RestaurantManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.name

class MenuCategory(models.Model):
    name = models.CharField(max_length=255)

class MenuItem(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(blank=True, null=True)
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

class Branch(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    location = models.TextField()
    latitude = models.TextField(blank=True, null=True)
    longitude = models.TextField(blank=True, null=True)
    timing = models.TimeField(blank=True, null=True)
    is_main = models.BooleanField(default=False)

class Deal(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    description=models.TextField(blank=True,null=True)
    is_valid=models.BooleanField(default=True)
    dateTime=models.DateField(default=now ,blank=True,null=True)
    imgae=models.ImageField(blank=True,null=True)
    total_price = models.IntegerField()

class DealItem(models.Model):
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    deal_id=models.ForeignKey(Deal,on_delete=models.CASCADE)

class NotificationRestaurant(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    review = models.ForeignKey('users.Review', on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)


