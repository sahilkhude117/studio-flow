# flow_api/urls.py
from django.urls import path
from .views import FlowView, FlowDetailView

urlpatterns = [
    path('', FlowView.as_view(), name='flow'),
    path('<uuid:flowId>/', FlowDetailView.as_view(), name='flow-detail')
]