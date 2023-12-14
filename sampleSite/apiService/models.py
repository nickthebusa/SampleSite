from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime

# Create your models here.
class User(AbstractUser):
  image = models.ImageField(upload_to="profile_images/", default='defaults/default_profile.webp')
  user_samples = models.ManyToManyField('Sample', related_name='user_uploaded_samples', blank=True)
  following = models.ManyToManyField('self', related_name='following_users', blank=True, symmetrical=False)
  followers = models.ManyToManyField('self', related_name='follower_users', blank=True, symmetrical=False)


class Sample(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  title = models.CharField(max_length=50)
  description = models.CharField(max_length=150, blank=True)
  audio_file = models.FileField(upload_to='audio_files/')
  tags = models.ManyToManyField('Tag', blank=True)
  date = models.DateField(default=datetime.date.today)
  image = models.ImageField(upload_to="sample_images/", default='defaults/output01.webp')
  
  def __str__(self):
    return self.title
  

class Tag(models.Model):
  name = models.CharField(max_length=100)
  
  def __str__(self):
    return self.name
  
  
class Folder(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  samples = models.ManyToManyField(Sample, related_name='samples_in_folder', blank=True)
  folders = models.ManyToManyField("self", related_name="inner_folders", blank=True, symmetrical=False)
  name = models.CharField(max_length=50)
  
  def __str__(self):
    return self.name