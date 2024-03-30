from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from . import models


class SampleAdmin(admin.ModelAdmin):
  exclude=("username",)
  def save_model(self, request, obj, form, change):
    obj.username = obj.user.name
    super().save_model(request, obj, form, change)


class ProfileAdminForm(forms.ModelForm):
    following = forms.ModelMultipleChoiceField(
        queryset=models.Profile.objects.all(),
        required=False,
        widget=forms.SelectMultiple(attrs={'disabled': 'disabled'}),
    )

    class Meta:
        model = models.Profile
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(ProfileAdminForm, self).__init__(*args, **kwargs)
        if self.instance.pk is not None:
            self.initial['following'] = [values[0] for values in self.instance.following.values_list('pk')]


class ProfileAdmin(admin.ModelAdmin):
    form = ProfileAdminForm


# Register your models here.
admin.site.register(models.User, UserAdmin)
admin.site.register(models.Sample, SampleAdmin)
admin.site.register(models.Tag)
admin.site.register(models.Folder)
admin.site.register(models.Profile, ProfileAdmin)
