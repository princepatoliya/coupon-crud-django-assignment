from django.contrib import admin
from couponBase.models import Coupon
# Register your models here.

class CouponAdmin(admin.ModelAdmin):
  list_display = ('id', 'code', 'value', 'is_percentage', 'start_date', 'end_date', 'updated_at', 'deleted_at')
  search_fields = ('code',)
  ordering = ('id', 'start_date', 'end_date')

admin.site.register(Coupon, CouponAdmin)



# class DiscountAdmin(admin.ModelAdmin):
#   list_display = ('id', 'value', 'is_percentage')
#   ordering = ('id', 'value', 'is_percentage')
# admin.site.register(Discount, DiscountAdmin)
