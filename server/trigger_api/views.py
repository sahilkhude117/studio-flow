
from rest_framework.views import APIView
from rest_framework.response import Response
from database.models import AvailableTrigger
from .serializers import AvailableTriggerSerializer

class AvailableTriggersView(APIView):
    def get(self, request):
        available_triggers = AvailableTrigger.objects.all()
        serializer = AvailableTriggerSerializer(available_triggers, many=True)

        return Response({
            'availableTriggers': serializer.data
        })