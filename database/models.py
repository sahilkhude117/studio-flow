import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    
    # Fix the related_name for these fields
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='database_user_set',  # Custom related_name
        related_query_name='database_user'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='database_user_set',  # Custom related_name
        related_query_name='database_user'
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']
    
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