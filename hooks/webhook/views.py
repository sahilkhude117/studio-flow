from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import User, Flow, FlowRun, FlowRunOutbox
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


@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_user(request, user_id):

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user)
    return Response(serializer.data)