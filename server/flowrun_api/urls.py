from django.urls import path
from .views import FlowRunsView, FlowRunDetailView

urlpatterns = [
    path('', FlowRunsView.as_view(), name='flow-runs'),
    path('<uuid:pk>/', FlowRunDetailView.as_view(), name='flow-run-detail')
]