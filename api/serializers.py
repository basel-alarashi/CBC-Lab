from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Patient, ImageModel, Result
from drf_extra_fields.fields import Base64ImageField

UserModel = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, clean_data):
        user_object = UserModel.objects.create_user(
            email=clean_data['email'],
            password=clean_data['password']
        )
        user_object.username = clean_data['username']
        user_object.save()
        return user_object


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        user = authenticate(
            username=clean_data['email'],
            password=clean_data['password']
        )
        if not user:
            raise serializers.ValidationError('User Not Found.')
        return user


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):
    image = Base64ImageField()

    class Meta:
        model = ImageModel
        fields = '__all__'


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'
