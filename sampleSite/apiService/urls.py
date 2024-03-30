from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('users', views.UserViewSet, basename='users')
router.register('samples', views.SampleViewSet, basename='samples')
router.register('tags', views.TagViewSet, basename='tags')
router.register('profiles', views.ProfileViewSet, basename='profiles')

urlpatterns = [
  path('api/', include(router.urls), name='router-urls'),
  path('api/get_users/', views.UserViewSet.as_view({'get': 'get_users'}), name='get_users'),
  path('api/follow_unfollow/<int:followed_id>/<int:follower_id>/', views.ProfileViewSet.as_view({'put': 'follow_unfollow'}), name='follow_unfollow'),
  path('api/get_samples_by_ids/', views.SampleViewSet.as_view({'get': 'get_samples_by_ids'}), name='get_samples_by_ids'),
  path('api/download_file/<int:pk>/', views.SampleViewSet.as_view({'get': 'download_file'}), name='download_file'),
  path('api/add_saved_sample/<int:pk>/', views.ProfileViewSet.as_view({'put': 'add_saved_sample'}), name='add_saved_sample'),
  path('api/remove_saved_sample/<int:pk>/', views.ProfileViewSet.as_view({'put': 'remove_saved_sample'}), name='remove_saved_sample'),
  path('api/edit_profile/<int:pk>/', views.ProfileViewSet.as_view({'put': 'edit_profile'}), name='edit_profile'),
  path('api/get_user_samples_by_user_id/<int:pk>', views.SampleViewSet.as_view({'get': 'get_user_samples_by_user_id'}), name='get_user_samples_by_user_id'),
  path('api/get_user_saved_samples/<int:pk>', views.SampleViewSet.as_view({'get': 'get_user_saved_samples'}), name='get_user_saved_samples')
]
