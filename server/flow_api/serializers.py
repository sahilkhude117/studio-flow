from rest_framework import serializers
from database.models import Flow, Trigger, AvailableTrigger, AvailableAction, Action


class AvailableTriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableTrigger
        fields = ['id', 'name', 'image']


class AvailableActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableAction
        fields = ['id', 'name', 'image']


class ActionDetailSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()

    class Meta:
        model = Action
        fields = ['id', 'flowId', 'actionId', 'sortingOrder', 'metadata', 'type']

    def get_type(self, obj):
        return AvailableActionSerializer(obj.actionId).data


class TriggerDetailSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    
    class Meta:
        model = Trigger
        fields = ['id', 'flowId', 'triggerId', 'metadata', 'type']
    
    def get_type(self, obj):
        return AvailableTriggerSerializer(obj.triggerId).data


class FlowListSerializer(serializers.ModelSerializer):
    actions = ActionDetailSerializer(many=True, read_only=True)
    trigger = TriggerDetailSerializer(read_only=True)
    
    class Meta:
        model = Flow
        fields = ['id', 'userId', 'triggerId', 'actions', 'trigger']


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