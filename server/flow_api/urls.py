# flow_api/urls.py
from django.urls import path
from .views import FlowCreateView

urlpatterns = [
    path('', FlowCreateView.as_view(), name='flow_create'),
]