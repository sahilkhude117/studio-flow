
from rest_framework import serializers
from database.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        if 'username' not in validated_data:
            # Either set username to email or require it from request
            validated_data['username'] = validated_data.get('email')

        user = User.objects.create_user(**validated_data)
        return user