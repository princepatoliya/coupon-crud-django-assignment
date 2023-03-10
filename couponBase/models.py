from django.db import models
from django.utils import timezone

# Create your models here.

# class Discount(models.Model):
#   created_at = models.DateTimeField(auto_now_add = True, editable = False)
#   updated_at = models.DateTimeField(auto_now = True)
#   deleted_at = models.DateTimeField(null = True, blank = True)

#   value = models.IntegerField(default=0)
#   is_percentage = models.BooleanField(default=False)

  
#   def __str__(self):
#     if self.is_percentage:
#       return "{0}%".format(self.value)
#       # return "{0}% - Discount".format(self.value)

#     return "₹{0}".format(self.value)


class Coupon(models.Model):
  created_at = models.DateTimeField(auto_now_add = True, editable = False)
  updated_at = models.DateTimeField(auto_now = True)
  deleted_at = models.DateTimeField(null = True, blank = True)

  code = models.CharField(max_length=6, unique=True)
  value = models.IntegerField(default=0)
  is_percentage = models.BooleanField(default=False)

  start_date = models.DateTimeField()
  end_date = models.DateTimeField()
  used_count = models.IntegerField(default=0)
  # is_active = models.BooleanField(default=True)

 
