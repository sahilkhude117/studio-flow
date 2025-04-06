from rest_framework import serializers
from database.models import Flow, Trigger, AvailableTrigger, AvailableAction

class ActionSerializer(serializers.Serializer):
    availableActionId = serializers.CharField()
    actionMetadata = serializers.JSONField(required=False, default=dict)

class FlowCreateSerializer(serializers.Serializer):
    availableTriggerId = serializers.CharField()
    triggerMetadata = serializers.JSONField(required=False,default=dict)
    actions = ActionSerializer(many=True)

    def validate(self, data):
        try:
            AvailableTrigger.objects.get(id=data['availableTriggerId'])
        except AvailableTrigger.DoesNotExist:
            raise serializers.ValidationError("Invalid trigger ID")
        
        for action in data['actions']:
            try:
                AvailableAction.objects.get(id=action['availableActionId'])
            except AvailableAction.DoesNotExist:
                raise serializers.ValidationError(f"Invalid action ID: {action['availableActionId']}")
            
        return data