from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from database.models import Flow, Trigger, Action, AvailableAction, AvailableTrigger
from .serializers import FlowCreateSerializer, FlowListSerializer , FlowDetailSerializer
from django.shortcuts import get_object_or_404
import requests

# Req : GET
# Endpoint : /api/v1/flow/
class FlowsView(APIView):
    """ return all flows of a user """
    permission_classes = [IsAuthenticated]
    # Get flows
    def get(self, request):
        flows = Flow.objects.filter(userId=request.user)
        response_data = []

        for flow in flows:
            flow_data = {
                'id': str(flow.id),
                'name': flow.name,
                'createdAt': flow.createdAt.isoformat(),
                'active': flow.active,
                'steps': []
            }

            try:
                trigger = flow.trigger 
                available_trigger = trigger.triggerId
                flow_data['steps'].append({
                    "type": "trigger",
                    "service": available_trigger.name,
                    "logoUrl": available_trigger.image,
                    "config": trigger.metadata
                })
            except Trigger.DoesNotExist:
                pass

            actions = flow.actions.all().order_by('sortingOrder')
            for action in actions:
                available_action = action.actionId
                flow_data["steps"].append({
                    "type": "action",
                    "service": available_action.name,
                    "logoUrl": available_action.image,
                    "config": action.metadata
                })

            response_data.append(flow_data)
        
        return Response(response_data)
    # Create flow
    def post(self, request):
        data = request.data

        if not data.get('name') or not data.get('triggerId'):
            return Response(
                {"error": "Name and triggerId are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            available_trigger = AvailableTrigger.objects.get(id=data['triggerId'])
        except AvailableTrigger.DoesNotExist:
            return Response(
                {"error": "Invalid triggerId"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        flow = Flow.objects.create(
            name=data.get('name'),
            userId = request.user,
            triggerId=data.get('triggerId'),
            active=data.get('active', False)
        )

        trigger_metadata = data.get('triggerConfig', {})
        Trigger.objects.create(
            flowId=flow,
            triggerId=available_trigger,
            metadata=trigger_metadata
        )

        steps = [{
            "type": "trigger",
            "service": available_trigger.name,
            "logoUrl": available_trigger.image,
            "config": trigger_metadata
        }]

        actions_data = data.get('actions', [])
        for index, action_data in enumerate(actions_data):
            try:
                available_action = AvailableAction.objects.get(id=action_data.get('actionId'))
                Action.objects.create(
                    flowId=flow,
                    actionId=available_action,
                    metadata=action_data.get('config', {}),
                    sortingOrder=index
                )
                steps.append({
                    "type": "action",
                    "service": available_action.name,
                    "logoUrl": available_action.image,
                    "config": action_data.get('config', {})
                })
            except AvailableAction.DoesNotExist:
                # Skip invalid actions
                continue

        return Response({
            "id": str(flow.id),
            "name": flow.name,
            "createdAt": flow.createdAt.isoformat(),
            "active": flow.active,
            "steps": steps
        }, status=status.HTTP_201_CREATED)


class FlowView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, flowId):
        flow = get_object_or_404(Flow, id=flowId, userId=request.user)
        
        # Build the response data structure
        flow_data = {
            "id": str(flow.id),
            "name": flow.name,
            "createdAt": flow.createdAt.isoformat(),
            "active": flow.active,
            "steps": []
        }

        try:
            trigger = flow.trigger
            available_trigger = trigger.triggerId
            flow_data["steps"].append({
                "type": "trigger",
                "service": available_trigger.name,
                "logoUrl": available_trigger.image,
                "config": trigger.metadata
            })
        except Trigger.DoesNotExist:
            pass

        actions = flow.actions.all().order_by('sortingOrder')
        for action in actions:
            available_action = action.actionId
            flow_data["steps"].append({
                "type": "action",
                "service": available_action.name,
                "logoUrl": available_action.image,
                "config": action.metadata
            })

        return Response(flow_data)
    
    def put(self, request, flowId):
        flow = get_object_or_404(Flow, id=flowId, userId=request.user)
        data = request.data

        if 'name' in data:
            flow.name = data['name']
        if 'active' in data:
            flow.active = data['active']
        flow.save()

        if 'triggerConfig' in data:
            try:
                trigger = flow.trigger
                trigger.metadata = data['triggerConfig']
                trigger.save()
            except Trigger.DoesNotExist:
                # If trigger doesn't exist and triggerId is provided, create it
                if 'triggerId' in data:
                    try:
                        available_trigger = AvailableTrigger.objects.get(id=data['triggerId'])
                        Trigger.objects.create(
                            flowId=flow,
                            triggerId=available_trigger,
                            metadata=data['triggerConfig']
                        )
                    except AvailableTrigger.DoesNotExist:
                        pass

        if 'actions' in data:  

            flow.actions.all().delete()
            
            # Create new actions
            for index, action_data in enumerate(data['actions']):
                try:
                    available_action = AvailableAction.objects.get(id=action_data.get('actionId'))
                    Action.objects.create(
                        flowId=flow,
                        actionId=available_action,
                        metadata=action_data.get('config', {}),
                        sortingOrder=index
                    )
                except AvailableAction.DoesNotExist:
                    # Skip invalid actions
                    continue

        return self.get(request, flowId)


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
            
            # Trigger webhook after flow is saved
            self.trigger_webhook(flow)
            
            return Response({"message": "Flow status updated", 'active': flow.active})
        except Flow.DoesNotExist:
            return Response({"error": "Flow not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the error but don't expose it to the client
            print(f"Error in ToggleFlowStatusView: {str(e)}")
            return Response({"message": "Flow status updated but webhook failed", 'active': flow.active})
    
    def trigger_webhook(self, flow):
        """Trigger webhook with flow information"""
        try:
            # Construct webhook URL using flow ID
            webhook_url = f"http://127.0.0.1:8001/api/v1/hooks/catch/2/{flow.id}"
            
            # Prepare payload with relevant flow information
            payload = {
                "flow_id": str(flow.id),
                "name": flow.name,
                "active": flow.active,
                "trigger_id": flow.triggerId
            }
            
            # Make async request to webhook (non-blocking)
            # For a production app, consider using celery or django-background-tasks
            # This is a simple implementation that won't block the response
            from threading import Thread
            Thread(target=self._send_webhook_request, args=(webhook_url, payload)).start()
            
        except Exception as e:
            # Log the error but don't raise it - we don't want webhook failures 
            # to prevent successful flow status updates
            print(f"Webhook trigger error: {str(e)}")
    
    def _send_webhook_request(self, url, payload):
        """Helper method to send the actual webhook request"""
        try:
            response = requests.post(
                url, 
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=5  # Set a reasonable timeout
            )
            print(f"Webhook response: {response.status_code}")
            if response.status_code >= 400:
                print(f"Webhook error response: {response.text}")
        except Exception as e:
            print(f"Error sending webhook: {str(e)}")

class DeleteFlowView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            flow = Flow.objects.get(pk=pk, userId=request.user)
            flow.delete()
            return Response({"message": "Flow deleted"})
        except Flow.DoesNotExist:
            return Response({"error": "Flow not found"}, status=status.HTTP_404_NOT_FOUND)



