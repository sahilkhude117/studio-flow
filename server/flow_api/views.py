from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from database.models import Flow, Trigger, Action, AvailableAction, AvailableTrigger
from .serializers import FlowCreateSerializer

class FlowCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FlowCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                "message": "Incorrect inputs",
                "errors": serializer.errors
            }, status=status.HTTP_411_LENGTH_REQUIRED)
        
        data = serializer.validated_data

        try:
            with transaction.atomic():
                flow = Flow.objects.create(
                    userId = request.user,
                    triggerId = ""
                )

                available_trigger = AvailableTrigger.objects.get(id=data['availableTriggerId'])

                for index, action_data in enumerate(data['actions']):
                    available_action = AvailableAction.objects.get(id=action_data['availableActionId'])

                    Action.objects.create(
                        flowId= flow,
                        actionId=available_action,
                        sortingOrder=index,
                        metadata=action_data.get('actionMetadata', {})
                    )

                trigger = Trigger.objects.create(
                    flowId=flow,
                    triggerId=available_trigger,
                    metadata=data.get('triggerMetadata', {})
                )

                flow.triggerId = str(trigger.id)
                flow.save()

                return Response({
                    "flowId": flow.id
                }, status=status.HTTP_201_CREATED)

        except AvailableTrigger.DoesNotExist:
            return Response({
                "message": "Invalid trigger ID"
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except AvailableAction.DoesNotExist:
            return Response({
                "message": "Invalid action ID"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                "message": "Error creating flow",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)