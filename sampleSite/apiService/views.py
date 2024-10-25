from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.http import HttpResponse
from rest_framework.response import Response
import mimetypes
from PIL import Image

from . import models
from .serializers import *

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
  queryset = models.User.objects.all()
  serializer_class = UserSerializer


class SampleViewSet(viewsets.ModelViewSet):
  queryset = models.Sample.objects.all()
  serializer_class = SampleSerializer

  def create(self, request, *args, **kwargs):
    return super().create(request, *args, **kwargs)

  # returns the sample objects from a list of pk's in the url
  @action(detail=True, methods=['get'])
  def get_samples_by_ids(self, request):
    sample_ids = request.query_params.getlist('samples_ids[]', [])
    samples = models.Sample.objects.filter(id__in=sample_ids)
    serializer = self.get_serializer(samples, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  # returns the user's uploaded samples of a user based on the pk in url
  @action(detail=True, methods=['get'])
  def get_user_samples_by_user_id(self, request, pk=None):
    user = models.Profile.objects.get(user=pk)
    samples = models.Sample.objects.filter(id__in=user.user_samples.all())
    serializer = self.get_serializer(samples, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  # returns the user's saved samples of a user based on the pk in url
  @action(detail=True, methods=['get'])
  def get_user_saved_samples(self, request, pk=None):
    user = models.Profile.objects.get(user=pk)
    samples = models.Sample.objects.filter(id__in=user.saved_samples.all())
    serializer = self.get_serializer(samples, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  # endpoint for downloading sample audio file
  @action(detail=True, methods=["get"])
  def download_file(self, request, pk=None):
    sample = self.get_object()
    response = HttpResponse(sample.audio_file.read(), content_type='audio/wav')
    response['Content-Disposition'] = f'attachment; filename="{sample.title}.wav"'
    return response


class TagViewSet(viewsets.ModelViewSet):
  queryset = models.Tag.objects.all()
  serializer_class = TagSerializer

  
class ProfileViewSet(viewsets.ModelViewSet):
  queryset = models.Profile.objects.all()
  serializer_class = ProfileSerializer


  @action(detail=True, methods=['put'])
  def follow_unfollow(self, request, followed_id, follower_id):

    if models.Profile.objects.filter(user=followed_id).exists():
      followed_user = models.Profile.objects.get(user=followed_id)
    if models.Profile.objects.filter(user=follower_id).exists():
      follower_user = models.Profile.objects.get(user=follower_id)

    if followed_user and follower_user:
      if follower_user in followed_user.followers.all():
        followed_user.followers.remove(follower_user)
        return Response({'success': 'updatedDB'})
      elif follower_user not in followed_user.followers.all():
        followed_user.followers.add(follower_user)
        return Response({'success': 'updatedDB'})

    return Response({'error': 'did not update'})


  @action(detail=True, methods=['put'])
  def add_saved_sample(self, request, pk=None):
    user_profile = self.get_object()
    sample = models.Sample.objects.get(pk=request.data.get('sample_id'))
    if sample:
      user_profile.saved_samples.add(sample)
      return Response({'success': 'updated DB'})
    return Response({'error': 'sample not found'})

  @action(detail=True, methods=['put'])
  def remove_saved_sample(self, request, pk=None):
    user_profile = self.get_object()
    sample = models.Sample.objects.get(pk=request.data.get('sample_id'))
    if sample:
      user_profile.saved_samples.remove(sample)
      return Response({'success': 'updated DB'})
    return Response({'error': 'sample not found'})

  @action(detail=True, methods=['put'])
  def edit_profile(self, request, pk=None):
    user_profile = self.get_object()
    user = models.User.objects.get(pk=pk)
    name = request.data.get('name')
    image = request.data.get('image')
    if name or image:
      if name and name.rstrip() != "":
        user_profile.name = name 
        user.username = name 
      if image and is_image(image):
        user_profile.image = image
      user_profile.save()
      user.save()
      return Response({"success": "updated DB"})
    return Response({"error": "something went wrong"})





def is_image(file):
    try:
        Image.open(file)
        return True
    except (IOError, Image.DecompressionBombError):
        return False
