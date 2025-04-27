from rest_framework import serializers
from .models import Restaurant ,MenuItem,Branch,MenuCategory,Deal,DealItem,NotificationRestaurant
import base64
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
    image = serializers.SerializerMethodField()
    image_upload = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = MenuItem
        fields = '__all__'
        extra_kwargs = {
            'restaurant': {'read_only': True}
        }

    def get_image(self, obj):
        if obj.image:
            return base64.b64encode(obj.image).decode("utf-8")
        return None

    def create(self, validated_data):
        image_data = validated_data.pop("image_upload", None)
        print("Updating image_upload (base64):", image_data[:30] + "..." if image_data else "None")

        if image_data:
            try:
                validated_data["image"] = base64.b64decode(image_data)
            except Exception as e:
                print("Image decode error:", e)
                raise serializers.ValidationError("Invalid image data")
        return super().create(validated_data)

    def update(self, instance, validated_data):
        image_data = validated_data.pop("image_upload", None)
        if image_data:
            try:
                instance.image = base64.b64decode(image_data)
            except Exception:
                raise serializers.ValidationError("Invalid image data")
        return super().update(instance, validated_data)

class BranchSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_upload = serializers.CharField(write_only=True, required=False)
    class Meta:
        model=Branch
        fields='__all__'
        extra_kwargs={'restaurant':{'read_only':True}}
    def get_image(self, obj):
        if obj.image:
            return base64.b64encode(obj.image).decode('utf-8')
        return None

    def create(self, validated_data):
        image_data = validated_data.pop("image_upload", None)
        if image_data:
            validated_data["image"] = base64.b64decode(image_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        image_data = validated_data.pop("image_upload", None)
        if image_data:
            instance.image = base64.b64decode(image_data)
        return super().update(instance, validated_data)

class MenuCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=MenuCategory
        fields='__all__'

class NotificationRestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model=NotificationRestaurant
        fields='__all__'
        extra_kwargs={'restaurant':{'read_only':True}}

class DealItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.name", read_only=True)
    class Meta:
        model = DealItem
        fields = ["item","item_name","quantity"]

class DealSerializer(serializers.ModelSerializer):
    items = DealItemSerializer(many=True)
    image = serializers.SerializerMethodField()
    image_upload = serializers.CharField(write_only=True, required=False)
    class Meta:
        model = Deal
        fields = '__all__'
        extra_kwargs = {"id": {"read_only": True}, "restaurant": {"read_only": True}}

    def get_image(self, obj):
        if obj.image:
            return base64.b64encode(obj.image).decode('utf-8')
        return None


    def update(self, instance, validated_data):
        # Extract nested items data
        items_data = validated_data.pop("items", [])

        # Update main Deal fields
        instance.total_price = validated_data.get("total_price", instance.total_price)
        instance.description = validated_data.get("description", instance.description)
        instance.dateTime = validated_data.get("dateTime", instance.dateTime)
        image_data = validated_data.pop("image_upload", None)
        if image_data:
            instance.image = base64.b64decode(image_data)
        instance.is_valid = validated_data.get("is_valid", instance.is_valid)
        instance.save()

        # Handling nested DealItems

        existing_items = {item.item.id: item for item in instance.items.all()}  # Existing items dictionary

        for item_data in items_data:
            item_id = item_data["item"].id  # Assuming item is passed as an object, not just an ID
            quantity = item_data["quantity"]

            if item_id in existing_items:
                # Update quantity if the item already exists
                existing_items[item_id].quantity = quantity
                existing_items[item_id].save()
            else:
                # Create new DealItem if not exists
                DealItem.objects.create(deal_id=instance, item=item_data["item"], quantity=quantity)

        # instance.items.all().delete()  # Remove old items
        # for item in items_data:
        #     DealItem.objects.create(
        #         deal_id=instance,
        #         item=item["item"],
        #         quantity=item["quantity"],
        #     )

        return instance


    def create(self, validated_data):
        items_data = validated_data.pop("items")  # List of MenuItem IDs
        image_data = validated_data.pop("image_upload", None)
        deal = Deal.objects.create(**validated_data)
        if image_data:
            validated_data["image"] = base64.b64decode(image_data)
        # Create DealItem entries for each MenuItem ID
        for item in items_data:
            print(item)
            DealItem.objects.create(item=item["item"], deal_id=deal, quantity=item["quantity"])

        return deal