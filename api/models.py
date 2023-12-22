from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager


class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('An Email is Required.')
        if not password:
            raise ValueError('A Password is Required.')
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('An Email is Required.')
        if not password:
            raise ValueError('A Password is Required.')
        user = self.create_user(email, password)
        user.is_superuser = True
        user.save()
        return user


class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=63)
    email = models.EmailField(max_length=127, unique=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = AppUserManager()

    def __str__(self):
        return self.username


class Patient(models.Model):
    patient_name = models.CharField(max_length=127)
    age = models.PositiveIntegerField()
    sexuality = models.CharField(max_length=10)
    supervisor = models.ForeignKey(
        to=AppUser,
        on_delete=models.CASCADE,
        related_name='patient'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(AppUser, auto_now=True)

    def __str__(self):
        return self.patient_name


class ImageModel(models.Model):
    image = models.ImageField(blank=True, null=True, upload_to='images')
    patient = models.ForeignKey(
        to=Patient,
        on_delete=models.CASCADE,
        related_name='img'
    )

    def __str__(self):
        return self.patient.patient_name


class Result(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    rbcs = models.FloatField()
    wbcs = models.FloatField()
    platelets = models.FloatField()
    hgb = models.FloatField()
    hct = models.FloatField()
    mcv = models.FloatField()
    mch = models.FloatField()
    mchc = models.FloatField()
    rdw = models.FloatField()
    patient = models.ForeignKey(
        to=Patient,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.patient.patient_name
