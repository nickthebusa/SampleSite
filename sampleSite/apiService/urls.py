from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('users', views.UserViewSet, basename='users')
router.register('samples', views.SampleViewSet, basename='samples')
router.register('tags', views.TagViewSet, basename='tags')

urlpatterns = [
  path('api/', include(router.urls), name='router-urls'),
  path('api/get_users/', views.UserViewSet.as_view({'get': 'get_users'}), name='get_users'),
]
