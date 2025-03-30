from rest_framework import serializers
from .models import Restaurant ,MenuItem,Branch,MenuCategory,Deal,DealItem,NotificationRestaurant

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

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=MenuItem
        fields='__all__'
        extra_kwargs = {'restaurant': {'read_only': True}}


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model=Branch
        fields='__all__'

class MenuCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=MenuCategory
        fields='__all__'

class NotificationRestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model=NotificationRestaurant
        fields='__all__'


class DealItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DealItem
        fields = ["item","quantity"]



class DealSerializer(serializers.ModelSerializer):
    items = DealItemSerializer(many=True, write_only=True)

    class Meta:
        model = Deal
        fields = ["total_price","description","dateTime","image","is_valid", "items"]
        extra_kwargs = {'restaurant': {'read_only': True}}

    def create(self, validated_data):
        items_data = validated_data.pop("items")  # List of MenuItem IDs
        deal = Deal.objects.create(**validated_data)

        # Create DealItem entries for each MenuItem ID
        for item in items_data:
            print(item)
            DealItem.objects.create(item=item["item"], deal_id=deal, quantity=item["quantity"])

        return deal