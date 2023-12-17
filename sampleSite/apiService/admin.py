from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from . import models

# Register your models here.
admin.site.register(models.User, UserAdmin)
admin.site.register(models.Sample)
admin.site.register(models.Tag)
admin.site.register(models.Folder)