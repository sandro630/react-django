from django.shortcuts import render
import os
import csv
import json
import glob
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.apps import apps
import codecs

# not expect duplication of data

@api_view(["GET"])
def input_school(request):
    title = []
    State = apps.get_model('users', 'State')
    School = apps.get_model('users', 'School')
    with open('F:/pending/react-django/djangobackend/data/schools.csv', mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        line_count = 0
        for row in csv_reader:
            try:
                s = State.objects.get(StateName=row["State"])
                if row["Type"] == "Public":
                    have_standard = 1
                elif row["Type"] == "Private":
                    have_standard = 0
                else: 
                    have_standard = 2
                sch = School(Name=row["School_Name"], City=row["City"], District=row["District_Name"], Have_standard=have_standard, State=s)
                sch.save()
            except State.DoesNotExist:
                s = State(StateName=row["State"])
                s.save()
                if row["Type"] == "Public":
                    have_standard = 1
                elif row["Type"] == "Private":
                    have_standard = 0
                else: 
                    have_standard = 2
                sch = School(Name=row["School_Name"], City=row["City"], District=row["District_Name"], Have_standard=have_standard, State=s)
                sch.save()

    return Response({"Input Schools": "success"})

@api_view(["GET"])
def input_subject(request):
    Subject = apps.get_model('users', 'Subject')
    SubjectTrigger = apps.get_model('users', 'SubjectTrigger')
    with open('F:/pending/react-django/djangobackend/data/subjects.csv', mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            try:
                s = Subject.objects.get(Name=row["Subject"])
            except Subject.DoesNotExist:
                s = Subject(Name=row["Subject"])
                s.save()
            try:
                st = SubjectTrigger.objects.get(TriggerWord=row["TriggerWord"])
            except SubjectTrigger.DoesNotExist:
                st = SubjectTrigger(TriggerWord=row["TriggerWord"], Subject=s)
                st.save()

    return Response({"Input Subject and Subject Triggerword": "success"})

@api_view(["GET"])
def input_grade(request):
    Grade = apps.get_model('users', 'Grade')
    GradeTrigger = apps.get_model('users', 'GradeTrigger')
    with open('F:/pending/react-django/djangobackend/data/grades.csv', mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            tws = row["TriggerWord"].split(",")
            try:
                g = Grade.objects.get(Grade=row["Grade"])
            except Grade.DoesNotExist:
                g = Grade(Grade=row["Grade"])
                g.save()
            for tw in tws:
                try:
                    gt = GradeTrigger.objects.get(TriggerWord=tw)
                except GradeTrigger.DoesNotExist:
                    gt = GradeTrigger(TriggerWord=tw, Grade=g)
                    gt.save()

    return Response({"Input Grade and Grade TriggerWord": "success"})

@api_view(["GET"])
def input_role(request):
    Role = apps.get_model('users', 'Role')
    with open('F:/pending/react-django/djangobackend/data/roles.csv', mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            r = Role(Title=row["Title"])
            r.save()

    return Response({"Input Role": "success"})

@api_view(["GET"])
def input_student_need(request):
    Student_Need = apps.get_model('users', 'Student_Need')
    with open('F:/pending/react-django/djangobackend/data/student_needs.csv', mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            sn = Student_Need(Population=row["Population"])
            sn.save()

    return Response({"Input Student Population": "success"})

@api_view(["GET"])
def input_state_standard(request):
    StandardSet = apps.get_model('users', 'StandardSet')
    StateStandard = apps.get_model('users', 'StateStandard')
    Standard = apps.get_model('users', 'Standard')
    State = apps.get_model('users', 'State')
    Subject = apps.get_model('users', 'Subject')
    with open('F:/pending/react-django/djangobackend/data/state_standard.csv', mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            try:
                standard_set = StandardSet.objects.get(SetLabel=row["Standards"])
                try:
                    state = State.objects.get(StateName=row["State"])
                except State.DoesNotExist:
                    state = State(StateName=row["State"])
                    state.save()

                subject = Subject.objects.get(Name=row["Subject"])
                try :
                    state_standard = StateStandard.objects.get(State=state, Subject=subject, StandardSet=standard_set)
                except StateStandard.DoesNotExist:
                    state_standard = StateStandard(State=state, Subject=subject, StandardSet=standard_set, Category=row["Category"])
                    state_standard.save()
            except StandardSet.DoesNotExist:
                standard_set = StandardSet(SetLabel=row["Standards"])
                standard_set.save()
                state = State.objects.get(StateName=row["State"])
                subject = Subject.objects.get(Name=row["Subject"])
                state_standard = StateStandard(State=state, Subject=subject, StandardSet=standard_set, Category=row["Category"])
                state_standard.save()
    
    return Response({"Input State Standard": "Success"})
                
@api_view(["GET"])
def input_standard(request):
    types_of_encoding = ["utf8", "cp1252"]
    Standard = apps.get_model('users', 'Standard')
    StandardSet = apps.get_model('users', 'StandardSet')
    Grade = apps.get_model('users', 'Grade')
    GradeTrigger = apps.get_model('users', 'GradeTrigger')
    folder_path = 'F:/pending/react-django/djangobackend/data/standard/*.csv'
    folder_files = glob.glob(folder_path)

    for folder_name in folder_files:
        standard_lable = os.path.basename(folder_name).split(".")[0]
        for encoding_type in types_of_encoding:
            with codecs.open(folder_name, encoding = encoding_type, errors ='replace', mode='r') as csv_file:
                csv_reader = csv.DictReader(csv_file)
                for row in csv_reader:
                    try:
                        grade = GradeTrigger.objects.get(TriggerWord=row["Grade"]).Grade
                    except GradeTrigger.DoesNotExist:
                        grade = Grade.objects.get(Grade=row["Grade"])
                    standard_set = StandardSet.objects.get(SetLabel=standard_lable)
                    try:
                        standard = Standard.objects.get(StandardSet=standard_set, 
                            Grade=grade,
                            Strand=row["Strand"], 
                            Standard_Number=row["Standard Number"], 
                            Description=row["Description"])
                    except Standard.DoesNotExist:
                        standard = Standard(StandardSet=standard_set, 
                            Grade=grade, 
                            Strand=row["Strand"], 
                            Standard_Number=row["Standard Number"], 
                            Description=row["Description"])
                        standard.save()

    return Response({"Input Standard": "Success"})