from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import SignupView, UserDetailView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('signin/', TokenObtainPairView.as_view(), name='signin'),  # JWT login endpoint
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', UserDetailView.as_view(), name='user_details'),
]