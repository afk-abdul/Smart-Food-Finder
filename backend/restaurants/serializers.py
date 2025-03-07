from rest_framework import serializers
from .models import Restaurant

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'email', 'name', 'cuisine', 'phone', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        restaurant = Restaurant(
            email=validated_data['email'],
            name=validated_data['name'],
            cuisine=validated_data.get('cuisine', ''),
            phone=validated_data.get('phone', ''),
        )
        restaurant.set_password(validated_data['password'])  # Hash password
        restaurant.save()
        return restaurant
