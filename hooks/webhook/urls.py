from django.urls import path
from . import views

urlpatterns = [
    path('catch/<str:user_id>/<str:flow_id>', views.catch_hook, name='catch-hook'),
    path('users', views.create_user, name='create-user'),
    path('users/<int:user_id>', views.get_user , name='get-user'),
]