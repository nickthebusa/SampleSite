from rest_framework import serializers
from rest_framework.authtoken.views import Token
from . import models

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.User
    fields = "__all__"
    
    extra_kwargs = {'password': {
      'write_only': True
    }}
    
  # hashes password
  def create(self, validated_data):
    user = models.User.objects.create_user(**validated_data)
    
    # creates new token for new user
    Token.objects.create(user=user)
    
    return user
    
    
class SampleSerializer(serializers.ModelSerializer):
  
  image = serializers.ImageField(required=False)
  date = serializers.DateTimeField(format="%m/%d/%Y", required=False)
  
  class Meta:
    model = models.Sample
    fields = "__all__"
    

class TagSerializer(serializers.ModelSerializer):
  class Meta: 
    model = models.Tag
    fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):
  following = serializers.SerializerMethodField()
  # username = serializers.ReadOnlyField(source='user.username')
  
  class Meta:
    model = models.Profile
    fields = ('user',
              'name',
              'image',
              'user_samples',
              'saved_samples',
              'followers',
              'following')

  def get_following(self, obj):
    user_ids = obj.following.values_list('user', flat=True)
    return list(user_ids)
