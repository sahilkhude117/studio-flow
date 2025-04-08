# flow_api/urls.py
from django.urls import path
from .views import FlowsView, FlowView, ToggleFlowStatusView, DeleteFlowView

urlpatterns = [
    path('', FlowsView.as_view(), name='flows'),
    path('<uuid:flowId>/', FlowView.as_view(), name='flow-detail'),
    path('<uuid:pk>/toggle/',ToggleFlowStatusView.as_view(), name="toggle-status"),
    path('<uuid:pk>/delete/',DeleteFlowView.as_view(), name='delete-flow')
]