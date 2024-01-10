from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from . import models

class SampleAdmin(admin.ModelAdmin):
  exclude=("username",)
  def save_model(self, request, obj, form, change):
    obj.username = obj.user.name
    super().save_model(request, obj, form, change)

# Register your models here.
admin.site.register(models.User, UserAdmin)
admin.site.register(models.Sample, SampleAdmin)
admin.site.register(models.Tag)
admin.site.register(models.Folder)
admin.site.register(models.Profile)