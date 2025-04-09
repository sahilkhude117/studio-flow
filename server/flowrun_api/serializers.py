from rest_framework import serializers
from django.utils import timezone
import datetime
from database.models import Flow, FlowRun, ActionExecution

class ActionExecutionSerializer(serializers.ModelSerializer):
    actionName = serializers.SerializerMethodField()
    
    class Meta:
        model = ActionExecution
        fields = ['id', 'actionName', 'status', 'started_at', 'completed_at', 'result']
        
    def get_actionName(self, obj):
        return obj.actionId.actionId.name

class FlowRunSerializer(serializers.ModelSerializer):
    flowName = serializers.SerializerMethodField()
    timestamp = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    executionResults = serializers.SerializerMethodField()
    actionExecutions = ActionExecutionSerializer(many=True, read_only=True)

    class Meta:
        model = FlowRun
        fields = ['id', 'flowName', 'status', 'timestamp', 'duration', 
                 'metadata', 'executionResults', 'actionExecutions', 'created_at', 'completed_at']

    def get_flowName(self, obj):
        return obj.flowId.name

    def get_timestamp(self, obj):
        return obj.created_at.strftime("%b %d, %Y %H:%M:%S")

    def get_status(self, obj):
        # Convert the database status to the frontend status format
        status_mapping = {
            'completed': 'success',
            'failed': 'failed',
            'processing': 'running',
            'pending': 'running'
        }
        return status_mapping.get(obj.status, 'running')
    
    def get_duration(self, obj):
        if obj.completed_at:
            duration = obj.completed_at - obj.created_at
            # Format duration as minutes:seconds
            total_seconds = duration.total_seconds()
            minutes = int(total_seconds // 60)
            seconds = int(total_seconds % 60)
            return f"{minutes}m {seconds}s"
        else:
            duration = timezone.now() - obj.created_at
            total_seconds = duration.total_seconds()
            minutes = int(total_seconds // 60)
            seconds = int(total_seconds % 60)
            return f"{minutes}m {seconds}s"
        
    def get_executionResults(self, obj):
        # Extract execution_results from metadata if it exists
        return obj.metadata.get('execution_results', {})