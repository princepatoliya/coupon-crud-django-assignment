from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from couponBase.models import Coupon
from couponBase.serializers import CouponSerializer, UpdateCouponSerializer
from rest_framework.renderers import JSONRenderer
from couponBase.renderers import CouponRenderer
from rest_framework.exceptions import APIException


# Create your views here.
# class DiscountView(APIView):

#   def get(self, request, format=None):
#     discountList = self.getAllDiscount()
#     discountSerializeList = DiscountSerializer(discountList, many=True)
#     return Response(discountSerializeList.data, status=status.HTTP_200_OK)

#   def getAllDiscount(self):
#     return Discount.objects.filter(deleted_at__isnull = True)

class CouponView(APIView, APIException):
  renderer_classes = [CouponRenderer]

  def post(self, request, format=None):
    couponSerializeData = CouponSerializer(data = request.data.get("data"))
    couponSerializeData.is_valid(raise_exception=True)
    couponSerializeData.save()
    return Response(couponSerializeData.data, status=status.HTTP_201_CREATED)

  def get(self, request, pk=None, format=None):
    if pk is not None:
      couponData = self.getCouponById(pk)
      couponSerializer = CouponSerializer(couponData)
      return Response(couponSerializer.data, status=status.HTTP_200_OK)
    
    couponList = self.getAllCoupon()
    couponSerializeList = CouponSerializer(couponList, many = True)
    return Response(couponSerializeList.data, status=status.HTTP_200_OK)

  def patch(self, request, pk=None, format=None):
    print("data: ", request.data.get("data"))
    couponData = Coupon.objects.get(id=pk)
    couponSerializeData = CouponSerializer(instance=couponData, data = request.data.get("data"), partial=True)
    couponSerializeData.is_valid(raise_exception=True)
    couponSerializeData.save()  
    return Response(couponSerializeData.data, status=status.HTTP_200_OK)

  def delete(self, request, pk, format=None):
    couponData = self.getCouponById(pk)
    couponSerializeData = CouponSerializer(data = request.data.get("data"), partial=True)
    couponSerializeData.delete(instance=couponData, validated_data=couponSerializeData)
    return Response(status=status.HTTP_202_ACCEPTED)

  def getAllCoupon(self):
    return Coupon.objects.filter(deleted_at__isnull = True)

  def getCouponById(self, couponId):
    couponData = Coupon.objects.filter(id = couponId, deleted_at__isnull = True)
    if couponData.count() < 1:
      raise APIException("Coupon Id not Found")
    return couponData[0]


