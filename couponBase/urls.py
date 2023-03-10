from django.urls import path, include
from couponBase.views import CouponView

urlpatterns = [
  path('', CouponView.as_view(), name="coupon"),
  path('<int:pk>/', CouponView.as_view()),
  # path('discount/', DiscountView.as_view(), name="discount")
]
