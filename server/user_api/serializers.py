
from rest_framework import serializers
from database.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        # The default result includes access and refresh tokens
        data = super().validate(attrs)
        
        # Add user data to the response
        user = self.user
        data['user'] = {
            'id': str(user.id),  # Convert UUID to string if needed
            'username': user.username,
            'email': user.email,
            # Add any other user fields you need
        }
        
        return data



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