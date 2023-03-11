from rest_framework import serializers
from couponBase.models import Coupon
from django.utils import timezone
from rest_framework.exceptions import APIException


# class DiscountSerializer(serializers.ModelSerializer):
#   class Meta:
#     model = Discount
#     fields = ('id', 'value', 'is_percentage')


class CouponSerializer(serializers.ModelSerializer):
  class Meta:
    model = Coupon
    fields = ('id', 'created_at', 'updated_at', 'code', 'value', 'is_percentage', 'start_date', 'end_date', 'used_count')
    extra_kwargs = {
      'value': { 'required': True },
      'is_percentage': { 'required': True },
    }
  
  def create(self, validated_data):
    self.validateCouponParams(validated_data)
    return Coupon.objects.create(**validated_data)
    

  def update(self, instance, validated_data):
    self.validateCouponParams(validated_data)
    print("------------------")
    instance.value = validated_data.get('value', instance.value)
    instance.is_percentage = validated_data.get('is_percentage', instance.is_percentage)
    instance.start_date = validated_data.get('start_date', instance.start_date)
    instance.end_date = validated_data.get('end_date', instance.end_date)
    instance.save()
    return instance
  
  def delete(self, instance, validated_data):
    instance.deleted_at = timezone.now()
    instance.save()
    return instance
  
  def validateCouponParams(self, paramsData):
    print(paramsData)
    print("startDate: ", paramsData.get("start_date"))
    print("endDate: ", paramsData.get("end_date"))
    print("is_p: ", paramsData.get("is_percentage"))
    print("is value: ", paramsData.get("value"))

    if paramsData.get("start_date") > paramsData.get("end_date"):
      raise serializers.ValidationError("Invalid start & end dates for coupon")

    if paramsData.get("is_percentage") == True and paramsData.get("value") > 100:
      raise serializers.ValidationError("Percentage coupon value must be less or equal to 100")
      
class UpdateCouponSerializer(serializers.ModelSerializer):
  class Meta:
    model = Coupon
    fields = ('id', 'value', 'is_percentage', 'start_date', 'end_date')