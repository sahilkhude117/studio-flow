from rest_framework import serializers
from database.models import AvailableAction


# flow_api/serializers.py (add if not already present)
class AvailableActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableAction
        fields = ['id', 'name', 'image']