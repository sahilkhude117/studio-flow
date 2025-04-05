from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from database.models import User, Flow, FlowRun, FlowRunOutbox
from .serializers import UserSerializer

@api_view(['POST'])
def catch_hook(request, user_id, flow_id):
    """ Process incoming webhook data and create FlowRun and FlowRunOutbox records """

    try:
        flow = Flow.objects.get(id=flow_id)

        # Create FlowRun and FlowRunOutbox in a transaction
        with transaction.atomic():
            flow_run = FlowRun.objects.create(
                flowId = flow,
                metadata = request.data
            )

            FlowRunOutbox.objects.create(
                flowRunId=flow_run
            )
        
        return Response({
            "message": "Webhook received",
            "flowRunId": str(flow_run.id)
        })
    
    except Flow.DoesNotExist:
        return Response(
            {'error': f'Flow with ID {flow_id} not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )