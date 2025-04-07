from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from database.models import Flow, Trigger, Action, AvailableAction, AvailableTrigger
from .serializers import FlowCreateSerializer, FlowListSerializer , FlowDetailSerializer
from django.shortcuts import get_object_or_404

# Req: GET, POST
# Endpoint: /api/v1/flow/:flowId
class FlowDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, flowId):
        
        flow = get_object_or_404(
            Flow.objects.prefetch_related(
                'actions',
                'actions__actionId',
                'trigger',
                'trigger__triggerId'
            ),
            id=flowId,
            userId=request.user
        )

        serializer = FlowDetailSerializer(flow)

        return Response({
            'flow': serializer.data
        })


class ToggleFlowStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            flow = Flow.objects.get(pk=pk, userId=request.user)
            flow.active = not flow.active
            flow.save()
            return Response({"message": "Flow status updated", 'active': flow.active})
        except Flow.DoesNotExist:
            return Response({"error": "Flow not found"}, status=status.HTTP_404_NOT_FOUND)


class DeleteFlowView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            flow = Flow.objects.get(pk=pk, userId=request.user)
            flow.delete()
            return Response({"message": "Flow deleted"})
        except Flow.DoesNotExist:
            return Response({"error": "Flow not found"}, status=status.HTTP_404_NOT_FOUND)


# Req: GET, POST
# Endpoint: /api/v1/flow/
class FlowView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        flows = Flow.objects.filter(userId=request.user).prefetch_related(
            'actions',
            'actions__actionId',  # This is the AvailableAction 
            'trigger',
            'trigger__triggerId'  # This is the AvailableTrigger
        )

        formatted_flows = []
        for flow in flows:
            steps = []

            if flow.trigger:
                steps.append({
                    'type': 'trigger',
                    'service': flow.trigger.triggerId.name.lower(),
                    'logoUrl': flow.trigger.triggerId.image,
                    'config': flow.trigger.metadata
                })

            for action in flow.actions.all():
                steps.append({
                    'type': 'action',
                    'service': action.actionId.name.lower(),
                    'logoUrl': action.actionId.image,
                    'config': action.metadata
                })

            formatted_flows.append({
                'id': str(flow.id),
                'name': flow.name,
                'createdAt': flow.createdAt.isoformat(),
                'active': flow.active,
                'steps': steps
            })
        
        return Response({
            'flows': formatted_flows
        })
    
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
    

        
