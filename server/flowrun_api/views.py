from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
import datetime
from django.db.models import Q
from database.models import FlowRun
from .serializers import FlowRunSerializer


class FlowRunsView(APIView):
    def get(self, request):
        # Get query parameters
        status_filter = request.query_params.get('status', 'all')
        time_filter = request.query_params.get('time', '24h')
        user_id = request.user.id  # Assuming the user is authenticated
        flow_run_id = request.query_params.get('id')

        # Base query - get runs for flows owned by the current user
        queryset = FlowRun.objects.filter(flowId__userId=user_id)
        
        if flow_run_id:
            queryset = queryset.filter(id=flow_run_id)
            # If looking for a specific ID, return detailed data
            if queryset.exists():
                flow_run = queryset.first()
                serializer = FlowRunSerializer(flow_run, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Flow run not found"}, status=status.HTTP_404_NOT_FOUND)

        # Apply time filter
        if time_filter == '24h':
            cutoff_time = timezone.now() - datetime.timedelta(hours=24)
            queryset = queryset.filter(created_at__gte=cutoff_time)
        elif time_filter == '7d':
            cutoff_time = timezone.now() - datetime.timedelta(days=7)
            queryset = queryset.filter(created_at__gte=cutoff_time)
        elif time_filter == '30d':
            cutoff_time = timezone.now() - datetime.timedelta(days=30)
            queryset = queryset.filter(created_at__gte=cutoff_time)
        
        # Apply status filter
        if status_filter == 'success':
            queryset = queryset.filter(status='completed')
        elif status_filter == 'failed':
            queryset = queryset.filter(status='failed')
        elif status_filter == 'running':
            queryset = queryset.filter(Q(status='processing') | Q(status='pending'))
        
        # Order by created_at, newest first
        queryset = queryset.order_by('-created_at')
        
        # Serialize the data
        serializer = FlowRunSerializer(queryset, many=True, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class FlowRunDetailView(APIView):
    def get(self, request, pk):
        try:
            flow_run = FlowRun.objects.get(pk=pk, flowId__userId=request.user.id)
            serializer = FlowRunSerializer(flow_run, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except FlowRun.DoesNotExist:
            return Response({"error": "Flow run not found"}, status=status.HTTP_404_NOT_FOUND)
