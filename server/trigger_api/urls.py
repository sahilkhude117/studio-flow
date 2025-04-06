from django.urls import path
from .views import AvailableTriggersView

urlpatterns = [
    path('available/', AvailableTriggersView.as_view(), name='available-triggers'),
]