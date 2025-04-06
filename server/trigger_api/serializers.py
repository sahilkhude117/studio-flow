from rest_framework import serializers
from database.models import AvailableTrigger


# flow_api/serializers.py (add if not already present)
class AvailableTriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableTrigger
        fields = ['id', 'name', 'image']