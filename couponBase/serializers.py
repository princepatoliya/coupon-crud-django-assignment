from rest_framework import serializers
from couponBase.models import Coupon
from django.utils import timezone

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

  def update(self, instance, validated_data):
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

class UpdateCouponSerializer(serializers.ModelSerializer):
  class Meta:
    model = Coupon
    fields = ('id', 'value', 'is_percentage', 'start_date', 'end_date')