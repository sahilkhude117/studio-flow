from django.urls import path
from . import views

urlpatterns = [
    path('catch/<str:user_id>/<str:flow_id>', views.catch_hook, name='catch-hook'),
]