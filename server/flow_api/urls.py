# flow_api/urls.py
from django.urls import path
from .views import FlowView, FlowDetailView, ToggleFlowStatusView, DeleteFlowView

urlpatterns = [
    path('', FlowView.as_view(), name='flow'),
    path('<uuid:flowId>/', FlowDetailView.as_view(), name='flow-detail'),
    path('<uuid:pk>/toggle/',ToggleFlowStatusView.as_view(), name="toggle-status"),
    path('<uuid:pk>/delete/',DeleteFlowView.as_view(), name='delete-flow')
]