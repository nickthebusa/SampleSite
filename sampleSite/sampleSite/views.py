from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status

class CustomAuthTokenView(ObtainAuthToken):
  def post(self, request, *args, **kwargs):
    # Call the base class post method to get the token
    response = super().post(request, *args, **kwargs)

    # Check if the login was successful
    if response.status_code == status.HTTP_200_OK:
      # Retrieve the user ID from the token's user
      user_id = Token.objects.get(key=response.data['token']).user_id
      # Include the user ID in the response
      response.data['user_id'] = user_id

    return response
