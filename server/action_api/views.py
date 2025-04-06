
from rest_framework.views import APIView
from rest_framework.response import Response
from database.models import AvailableAction
from .serializers import AvailableActionSerializer

class AvailableActionsView(APIView):
    def get(self, request):
        available_actions = AvailableAction.objects.all()
        serializer = AvailableActionSerializer(available_actions, many=True)

        return Response({
            'availableActions': serializer.data
        })