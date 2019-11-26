from rest_framework import serializers
from .models import *


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'

class SchoolSerializer(serializers.ModelSerializer):
    state_name = serializers.ReadOnlyField()

    class Meta:
        model = School
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'


class GradeTriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeTrigger
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class Student_NeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student_Need
        fields = '__all__'

class General_TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = General_Tag
        fields = '__all__'

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = '__all__'

class BaseDataSerializer(serializers.Serializer):
    roles = RoleSerializer(many=True)
    grades = GradeTriggerSerializer(many=True)
    subjects = SubjectSerializer(many=True)
    student_needs = Student_NeedSerializer(many=True)
    general_tags = General_TagSerializer(many=True)

class SchoolDataSerializer(serializers.Serializer):
    schools = SchoolSerializer(many=True)

class SubjectTriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectTrigger
        fields = '__all__'

class GradeTriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeTrigger
        fields = '__all__'

class DocTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocType
        fields = '__all__'

class StandardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Standard
        fields = '__all__'

class CorDataSerializer(serializers.Serializer):
    subject_triggerword = SubjectTriggerSerializer(many=True)
    grade_triggerword = GradeTriggerSerializer(many=True)
    doctype = DocTypeSerializer(many=True)
    general_tags = General_TagSerializer(many=True)
    collections = CollectionSerializer(many=True)

