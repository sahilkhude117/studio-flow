from rest_framework import serializers
from database.models import User, Flow, Trigger, Action, AvailableAction, AvailableTrigger, FlowRun, FlowRunOutbox

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}} 

class AvailableTriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableTrigger
        fields = ['id', 'name', 'image']

class AvailableActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableAction
        fields = ['id', 'name', 'image']

class TriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trigger
        fields = ['id', 'flowId', 'triggerId', 'metadata']

class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action
        fields = ['id', 'flowId', 'actionId', 'metadata', 'sortingOrder']

class FlowRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlowRun
        fields = ['id', 'flowId', 'metadata']

class FlowRunOutboxSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlowRunOutbox
        fields = ['id', 'flowRunId']

class FlowSerializer(serializers.ModelSerializer):
    trigger = TriggerSerializer(read_only=True)
    actions = ActionSerializer(many=True, read_only=True)
    flowRuns = FlowRunSerializer(many=True, read_only=True)

    class Meta:
        model = Flow
        fields = ['id', 'triggerId', 'userId', 'trigger', 'actions', 'flowRuns']