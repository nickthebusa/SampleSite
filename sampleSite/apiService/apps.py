from django.apps import AppConfig


class ApiserviceConfig(AppConfig):
  default_auto_field = 'django.db.models.BigAutoField'
  name = 'apiService'
  
  def ready(self):
    import apiService.signals