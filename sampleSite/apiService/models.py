from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime

# Create your models here.
class User(AbstractUser):
  pass 


class Sample(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  title = models.CharField(max_length=50)
  description = models.CharField(max_length=150, blank=True)
  audio_file = models.FileField(upload_to='audio_files/')
  tags = models.ManyToManyField('Tag', blank=True)
  date = models.DateField(default=datetime.date.today)
  image = models.ImageField(upload_to="sample_images/", default='defaults/output01.jpeg')
  
  def __str__(self):
    return self.title
  

class Tag(models.Model):
  name = models.CharField(max_length=100)
  
  def __str__(self):
    return self.name