from django.urls import path
from .views import *

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('check/', check_user, name='check'),
    path('logout/', logout_user, name='logout'),
    path('patients/', patients_list, name='patients'),
    path('patients/<int:pk>/', patient_details, name='patient-details'),
    path('create/', create_patient, name='patient-create'),
    path('delete/<int:pk>/', delete_patient, name='patient-delete'),
    path('update/<int:pk>/', update_patient, name='update-patient'),
    path('result/<int:pk>/', cbc_result, name='result'),
    path('download/<int:pk>/', download_result, name='download'),
]
