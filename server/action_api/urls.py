from django.urls import path
from .views import AvailableActionsView

urlpatterns = [
    path('available/', AvailableActionsView.as_view(), name='available-triggers'),
]