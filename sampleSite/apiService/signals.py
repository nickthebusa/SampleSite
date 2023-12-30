from . import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import os
from pathlib import Path
from django.conf import settings

from .models import *


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
  """
  Signal receiver to create a Profile instance when a User is created.
  """
  if created:
    Profile.objects.create(user=instance, name=instance.username)
        

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
  """
  Signal receiver to save the Profile instance when a User is saved.
  """
  instance.profile.save()
  
@receiver(post_save, sender=Sample)
def update_user_samples(sender, instance, created, **kwargs):
  """
  Signal handler to update user_samples filed in user's profile
  when a new Sample is uploaded
  """
  if created:
    user_profile, created = Profile.objects.get_or_create(user=instance.user)
    user_profile.user_samples.add(instance)
    