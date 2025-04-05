from django.db import models
import uuid
import json

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    class Meta:
        db_table = 'User'

    def __str__(self) -> str:
        return f'{self.name} ({self.email})'
    
class Flow(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    triggerId = models.CharField(max_length=100)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, related_name='flows')

    class Meta:
        db_table = 'Flow'

    def __str__(self) -> str:
        return f'Flow {self.id}'
    
class AvailableTrigger(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    image = models.CharField(max_length=500)

    class Meta:
        db_table = 'AvailableTrigger'

    def __str__(self) -> str:
        return self.name
    
class Trigger(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    flowId = models.OneToOneField(Flow, on_delete=models.CASCADE,related_name='trigger')
    triggerId = models.ForeignKey(AvailableTrigger, on_delete=models.CASCADE, related_name='triggers')
    metadata = models.JSONField(default=dict)

    class Meta:
        db_table = 'Trigger'

    def __str__(self) -> str:
        return f'Trigger for Flow {self.flowId}'
    
class AvailableAction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    image = models.CharField(max_length=255)
    
    class Meta:
        db_table = 'AvailableAction'

    def __str__(self):
        return self.name
    
class Action(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    flowId = models.ForeignKey(Flow, on_delete=models.CASCADE, related_name='actions')
    actionId = models.ForeignKey(AvailableAction, on_delete=models.CASCADE, related_name='actions')
    metadata = models.JSONField(default=dict)
    sortingOrder = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'Action'

    def __str__(self):
        return f"Action {self.id} for Flow {self.flowId}"
    
class FlowRun(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    flowId = models.ForeignKey(Flow, on_delete=models.CASCADE, related_name='flowRuns')
    metadata = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'FlowRun'

    def __str__(self):
        return f"FlowRun {self.id}"

class FlowRunOutbox(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    flowRunId = models.OneToOneField(FlowRun, on_delete=models.CASCADE, related_name='flowRunOutbox')
    
    class Meta:
        db_table = 'FlowRunOutbox'

    def __str__(self):
        return f"FlowRunOutbox for {self.flowRunId}"