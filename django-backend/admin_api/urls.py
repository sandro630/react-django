from django.urls import path

from . import views

urlpatterns = [
    path('input_school/', views.input_school),
    path('input_subject/', views.input_subject),
    path('input_grade/', views.input_grade),
    path('input_role/', views.input_role),
    path('input_student_need/', views.input_student_need),
    path('input_state_standard/', views.input_state_standard),
    path('input_standard/', views.input_standard),
]