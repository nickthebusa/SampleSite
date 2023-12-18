from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response


from . import models
from .serializers import *

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
  queryset = models.User.objects.all()
  serializer_class = UserSerializer
  permission_classes = [IsAuthenticated]
  authentication_classes = (TokenAuthentication,)
  
  
  def get_permissions(self):
    if self.request.method == "GET":
      return [permissions.AllowAny()]
    return super().get_permissions()

  
class SampleViewSet(viewsets.ModelViewSet):
  queryset = models.Sample.objects.all()
  serializer_class = SampleSerializer
  

class TagViewSet(viewsets.ModelViewSet):
  queryset = models.Tag.objects.all()
  serializer_class = TagSerializer
  
