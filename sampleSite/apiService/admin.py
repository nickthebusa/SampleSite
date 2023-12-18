from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from . import models

# custom user admin class
class UserAdmin(BaseUserAdmin):
  fieldsets = BaseUserAdmin.fieldsets + (
    (None, {'fields': ('image','user_samples','followers','following',)}),
  )

# Register your models here.
admin.site.register(models.User, UserAdmin)
admin.site.register(models.Sample)
admin.site.register(models.Tag)
admin.site.register(models.Folder)