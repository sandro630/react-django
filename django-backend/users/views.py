from __future__ import print_function
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.core import serializers
core_serializers = serializers
from django.http import JsonResponse
import requests
import json
from .serializers import *
from collections import namedtuple
import time
import datetime
from django.forms.models import model_to_dict
from django.shortcuts import render
from .models import *
import uuid
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from django.db.models import Q
import sys
import tldextract
import re
from urllib.parse import urlparse, parse_qs
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import csv
import io


CLIENT_ID = 'hUq5QmrIYSHu15LKS7nHjnXteMApeTHHTwSEWz9x'
CLIENT_SECRET = 'ealGKj90JJ3ERVVPOeFpwbZhUgNVZIvNERXSLlqmQKHcUCm8nLxAd3wtzYmbEh61ER6x4XqZGO0yd8vj9JL4PHmdPREx3VMXdOHYsDLWcXZQiiet3AP4HcOpyxkifJtB'
CHROME_DRIVE_PATH = settings.CHROME_DRIVE_PATH
STATIC_PATH = settings.STATIC_PATH


def index(request):
    return render(request, 'index.html')


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
            
    json_data = json.loads(request.POST.get("register_info"))
    GmailID = json_data["googleID"]
    Email = json_data["Email"]
    selected_general_tags = json_data["selected_general_tags"]
    selected_grades = json_data["selected_grades"]
    selected_role = json_data["selected_role"]
    selected_school = json_data["selected_school"]
    selected_student_needs = json_data["selected_student_needs"]
    selected_subjects = json_data["selected_subjects"]
    firstname = json_data["Firstname"]
    lastname = json_data["Lastname"]
    school = selected_school.split(", ")[0]
    state_name = selected_school.split(", ")[2]
    city = selected_school.split(", ")[1]
    sh = School.objects.get(Name=school, City=city, State=State.objects.get(StateName=state_name))
    try:
        rl = Role.objects.get(Title=selected_role[0]["label"])
    except Role.DoesNotExist:
        rl = Role(Title=selected_role[0]["label"])
        rl.save()
    new_user = User(GmailID=GmailID,School=sh,Role=rl,Firstname=firstname,Lastname=lastname, Email=Email)
    new_user.save()

    for sbj in selected_subjects:
        try:
            t_sbj = Subject.objects.get(Name=sbj["label"])
        except Subject.DoesNotExist:
            t_sbj = Subject(Name=sbj["label"])
            t_sbj.save()
        new_user.Subjects.add(t_sbj)
        try:
            sub_trg = SubjectTrigger.objects.get(TriggerWord=sbj["label"])
        except SubjectTrigger.DoesNotExist:
            sub_trg = SubjectTrigger(TriggerWord=sbj["label"], Subject=t_sbj)
            sub_trg.save()
    
    for gd in selected_grades:
        t_gd = GradeTrigger.objects.get(TriggerWord=gd["label"])
        new_user.Grades.add(t_gd.Grade)

    for gd in selected_grades:
        t_gd = GradeTrigger.objects.get(TriggerWord=gd["label"])
        new_user.GradeTrigger.add(t_gd)
    
    for sn in selected_student_needs:
        try:
            t_sn = Student_Need.objects.get(Population=sn["label"])
        except Student_Need.DoesNotExist:
            t_sn = Student_Need(Population=sn["label"])
            t_sn.save()
        new_user.Student_needs.add(t_sn)
    
    for gt in selected_general_tags:
        try:
            t_gt = General_Tag.objects.get(Tag=gt["label"])
        except General_Tag.DoesNotExist:
            t_gt = General_Tag(Tag=gt["label"])
            t_gt.save()
        new_user.General_Tags.add(t_gt)
    
    # add shared collection when login from shared page
    next_page = request.POST.get("next_page")
    if next_page != "/home":
        uuid = next_page[1:]
        collection_detail = Collection.objects.get(uuid=uuid)
        try:
            shared_user = User.objects.get(GmailID=GmailID)
            if shared_user.pk == new_user.pk:
                try:
                    shared_collection = SharedCollection.objects.get(SharedUser=shared_user, SharedCollection=collection_detail)
                except SharedCollection.DoesNotExist:
                    shared_collection = SharedCollection(SharedUser=shared_user, SharedCollection=collection_detail)
                    shared_collection.save()
        except User.DoesNotExist:
            return Response({"RegisterSuccess": False}, 200)


    return Response({"RegisterSuccess": True}, 200)


@api_view(['POST'])
def update_profile(request):
    json_data = json.loads(request.POST.get("register_info"))
    GmailID = json_data["googleID"]
    Email = json_data["Email"]
    selected_general_tags = json_data["selected_general_tags"]
    selected_grades = json_data["selected_grades"]
    selected_role = json_data["selected_role"]
    selected_school = json_data["selected_school"]
    selected_student_needs = json_data["selected_student_needs"]
    selected_subjects = json_data["selected_subjects"]
    firstname = json_data["Firstname"]
    lastname = json_data["Lastname"]
    school = selected_school.split(", ")[0]
    state_name = selected_school.split(", ")[2]
    city = selected_school.split(", ")[1]
    sh = School.objects.get(Name=school, City=city, State=State.objects.get(StateName=state_name))
    try:
        rl = Role.objects.get(Title=selected_role[0]["label"])
    except Role.DoesNotExist:
        rl = Role(Title=selected_role[0]["label"])
        rl.save()
    new_user = User.objects.get(GmailID=GmailID)

    new_user.Role = rl
    new_user.School = sh
    new_user.Subjects.clear()
    for sbj in selected_subjects:
        try:
            t_sbj = Subject.objects.get(Name=sbj["label"])
        except Subject.DoesNotExist:
            t_sbj = Subject(Name=sbj["label"])
            t_sbj.save()
        new_user.Subjects.add(t_sbj)
        try:
            sub_trg = SubjectTrigger.objects.get(TriggerWord=sbj["label"])
        except SubjectTrigger.DoesNotExist:
            sub_trg = SubjectTrigger(TriggerWord=sbj["label"], Subject=t_sbj)
            sub_trg.save()
    
    new_user.Grades.clear()
    for gd in selected_grades:
        t_gd = GradeTrigger.objects.get(TriggerWord=gd["label"])
        new_user.Grades.add(t_gd.Grade)

    new_user.GradeTrigger.clear()
    for gd in selected_grades:
        t_gd = GradeTrigger.objects.get(TriggerWord=gd["label"])
        new_user.GradeTrigger.add(t_gd)

    new_user.Student_needs.clear()
    for sn in selected_student_needs:
        try:
            t_sn = Student_Need.objects.get(Population=sn["label"])
        except Student_Need.DoesNotExist:
            t_sn = Student_Need(Population=sn["label"])
            t_sn.save()
        new_user.Student_needs.add(t_sn)
    
    new_user.General_Tags.clear()
    for gt in selected_general_tags:
        try:
            t_gt = General_Tag.objects.get(Tag=gt["label"])
        except General_Tag.DoesNotExist:
            t_gt = General_Tag(Tag=gt["label"])
            t_gt.save()
        new_user.General_Tags.add(t_gt)
    
    return Response({"updateSuccess": True}, 200)



@api_view(['POST'])
def token(request):
    '''
    Gets tokens with username and password. Input should be in the format:
    {"username": "username", "password": "1234abcd"}
    '''
    r = requests.post(
    'http://127.0.0.1:8000/o/token/', 
        data={
            'grant_type': 'password',
            'username': "username",
            'password': "1234abcd",
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
        },
    )
    return Response(r.json())



@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    '''
    Registers user to the server. Input should be in the format:
    {"refresh_token": "<token>"}
    '''
    r = requests.post(
    'http://127.0.0.1:8000/o/token/', 
        data={
            'grant_type': 'refresh_token',
            'refresh_token': request.data['refresh_token'],
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
        },
    )
    return Response(r.json())


@api_view(['POST'])
@permission_classes([AllowAny])
def revoke_token(request):
    '''
    Method to revoke tokens.
    {"token": "<token>"}
    '''
    r = requests.post(
        'http://127.0.0.1:8000/o/revoke_token/', 
        data={
            'token': request.data['token'],
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
        },
    )
    # If it goes well return sucess message (would be empty otherwise) 
    if r.status_code == requests.codes.ok:
        return Response({'message': 'token revoked'}, r.status_code)
    # Return the error if it goes badly
    return Response(r.json(), r.status_code)


@api_view(['POST'])
def login(request):
    try:
        user = User.objects.get(GmailID=request.POST.get('GmailID'))
        return Response({"loginSuccess": True}, 200)
    except User.DoesNotExist:
        # print("doesnotexist")
        return Response({"loginSuccess": False}, 200)


@api_view(['GET'])
def basedata(request):
    # time.sleep(5)
    return Response(getBaseData())


def getBaseData():
    Basedata = namedtuple('Basedata', ('roles', 'subjects', 'grades', 'student_needs', 'general_tags'))

    basedata = Basedata(
        roles=Role.objects.all(),
        subjects=Subject.objects.all(),
        grades=GradeTrigger.objects.all(),
        student_needs=Student_Need.objects.all(),
        general_tags=General_Tag.objects.all(),
    )
    serializer = BaseDataSerializer(basedata)
    return serializer.data


@api_view(['POST'])
def get_profile_data(request):
    google_id = request.POST.get("google_id")
    user = User.objects.get(GmailID=google_id)
    doc_json = {}
    doc_json["selected_school"] = user.School.Name + ", " + user.School.City + ", " + user.School.State.StateName
    doc_json["selected_role"] = user.Role.Title
    
    selected_subject = []
    for sub in user.Subjects.all():
        selected_subject.append(sub.Name)
    doc_json["selected_subject"] = selected_subject

    selected_grade = []
    for gr in user.GradeTrigger.all():
        selected_grade.append(gr.TriggerWord)
    doc_json["selected_grade"] = selected_grade
    
    selected_student_need = []
    for sn in user.Student_needs.all():
        selected_student_need.append(sn.Population)
    doc_json["selected_student_need"] = selected_student_need

    selected_general_tag = []
    for gt in user.General_Tags.all():
        selected_general_tag.append(gt.Tag)
    doc_json["selected_general_tag"] = selected_general_tag

    return Response({"profile_data": doc_json, "basedata": getBaseData()})



@api_view(["POST"])
def search_school(request):
    input_length = request.POST.get("inputLength")
    input_value = request.POST.get("inputValue")
    min_query_length = 4
    school_suggestions = []
    if int(input_length) <= min_query_length - 1:
        return Response({"schools": json.dumps(school_suggestions)})
    else:
        filtered_school = School.objects.filter(Name__icontains=input_value)
        Schooldata = namedtuple('Schooldata', ('schools'))

        schooldata = Schooldata(
            schools=filtered_school
        )
        serializer = SchoolDataSerializer(schooldata)
        return Response(serializer.data)


@api_view(['POST'])
def cordata(request):
    # time.sleep(5)
    return Response( getCorData(request) )


def getCorData(request):
    GmailID = request.POST.get("GmailID")
    user = User.objects.get(GmailID=GmailID)

    general_tags = General_Tag.objects.all()
    subject_triggerword = SubjectTrigger.objects.all()
    grade_triggerword = GradeTrigger.objects.all()
    doctype = DocType.objects.all()
    cols = Collection.objects.filter(Owner_User=user)
    
    collections = []
    for c in cols:
        json_data = {}
        json_data["title"] = c.Title
        json_data["pk"] = c.pk

        if c.Thumbnail == "":
            json_data["thumbnail"] = getThumbnailFromCollection(c)
        else:
            json_data["thumbnail"] = c.Thumbnail
        collections.append(json_data)

    return {
        "general_tags": core_serializers.serialize("json", general_tags),
        "subject_triggerword": core_serializers.serialize("json", subject_triggerword),
        "grade_triggerword": core_serializers.serialize("json", grade_triggerword),
        "doctype": core_serializers.serialize("json", doctype),
        "collections": json.dumps(collections)
    }

@api_view(['POST'])
def getStrand(request):
    # time.sleep(5)
    return Response( getStrandData(request) )


def getStrandData(request):
    try:
        selected_subject_triggerword = request.POST.get("selected_subject_triggerword")
        selected_grade_triggerword = request.POST.get("selected_grade_triggerword")
        GmailID = request.POST.get("GmailID")
        state = User.objects.get(GmailID=GmailID).School.State
        category = "Adult" if User.objects.get(GmailID=GmailID).School.Have_standard > 1 else "K12"
        subject = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword).Subject
        grade = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword).Grade

        standard_set = StateStandard.objects.get(State=state, Subject=subject, Category=category).StandardSet
        strand = Standard.objects.filter(StandardSet=standard_set, Grade=grade).values("Strand").distinct()
        return {"strand": json.dumps( list(strand) ), "standard_set": standard_set.SetLabel}
    # except Standard.DoesNotExist or StateStandard.DoesNotExist:
    except:
        return {"strand": json.dumps( list([]) ), "standard_set": ''}


@api_view(['POST'])
def getStandard(request):
    # time.sleep(5)
    return Response({"code": json.dumps( getStandardData(request) ) })


def getStandardData(request):
    selected_subject_triggerword = request.POST.get("selected_subject_triggerword")
    selected_grade_triggerword = request.POST.get("selected_grade_triggerword")
    selected_strand = request.POST.get("selected_strand")
    GmailID = request.POST.get("GmailID")
    state = User.objects.get(GmailID=GmailID).School.State
    category = "Adult" if User.objects.get(GmailID=GmailID).School.Have_standard > 1 else "K12"
    subject = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword).Subject
    grade = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword).Grade
    try:
        standard_set = StateStandard.objects.get(State=state, Subject=subject, Category=category).StandardSet
        code = Standard.objects.filter(StandardSet=standard_set, Grade=grade, Strand=selected_strand).values("id", "Standard_Number", "Description").distinct()
        return {"code": json.dumps( list(code) )}
    except Standard.DoesNotExist or StateStandard.DoesNotExist:
        return {"code": json.dumps( list([]) )}


@api_view(['POST'])
def uploadFile(request):
    c_d_pk = upload(request)
    if c_d_pk['c_pk'] == 0:
        return Response({"col_id": 0, "doc_id": 0, "upload": "already exist"})
    else:
        return Response({"col_id": c_d_pk['c_pk'], "doc_id": c_d_pk['d_pk'], "upload": "success"})


def upload(request):
    json_data = json.loads(request.POST.get("upload_file_info"))
    Title = json_data["Title"]
    GmailID = json_data["GmailID"]
    DocID = json_data["DocID"]
    DocT = json_data["DocType"]
    col_new_title = json_data["col_new_title"]
    col_default_title = json_data["col_default_title"]
    first_name = json_data["first_name"]
    collection_pk = json_data["collection_pk"]
    thumbnail = json_data["web_thumbnail"]
    # selected_methods = json_data["selected_methods"]  # not saved
    selected_general_tags = json_data["selected_general_tags"]
    ServiceType = json_data["ServiceType"] 
    IconUrl = json_data["iconUrl"] 
    Url = json_data["url"]
    standard_pk = json_data["standard_pk"]
    selected_subject_triggerword = json_data["selected_subject_triggerword"]
    selected_grade_triggerword = json_data["selected_grade_triggerword"]
    user = User.objects.get(GmailID=GmailID)
    if collection_pk == "new":
        # determine title of collection
        if col_new_title == "":
            df_col_name = "New Collection"
            c = len( list( Collection.objects.raw("SELECT * FROM users_collection WHERE Title LIKE 'New Collection%%'") ) )

            if c != 0:
                df_col_name += str(c)
        else:
            df_col_name = col_new_title
        
        # save collection
        u = uuid.uuid4()
        col = Collection(
            Title=df_col_name,
            Owner_User=user,
            Description="",
            DateShared = datetime.datetime.now(),
            Thumbnail="", # not saved
            AccessCount=1,
            uuid=u.hex
        )
        col.save()
        try:
            doc = Document.objects.get(DocID=DocID)
            doc.Collection.add(col)
            return {"c_pk": col.pk, "d_pk": doc.pk}
        except Document.DoesNotExist: 
            # save Document
            doc = Document(
                Title=Title, 
                Owner_User=user,
                DocID=DocID,
                DocType = DocType.objects.get(Type=DocT),
                DateShared = datetime.datetime.now(),
                OpenNumber = 0,
                ServiceType = ServiceType,
                IconUrl = IconUrl,
                Url = Url,
                thumbnail = thumbnail,
                Subject = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword).Subject,
                Grade = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword).Grade,
                subject_triggerword = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword),
                grade_triggerword = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword)
            )
            doc.save()
            # add collection
            doc.Collection.add(col)
            if standard_pk != None:
                doc.Standard.add( Standard.objects.get(pk=standard_pk) )
            # add tags
            for gt in selected_general_tags:
                try:
                    eg = General_Tag.objects.get(Tag=gt['label'])
                    doc.General_Tags.add(eg)
                except General_Tag.DoesNotExist:
                    eg = General_Tag(Tag=gt['label'])
                    eg.save()
                    doc.General_Tags.add(eg)
            return {"c_pk": col.pk, "d_pk": doc.pk}
    elif collection_pk == "default":
        # determine title of collection
        if col_default_title == "":
            df_col_name = first_name + "'s First Collection"
        else:
            df_col_name = col_default_title

        # save collection
        u = uuid.uuid4()
        col = Collection(
            Title=df_col_name,
            Owner_User=user,
            Description="",
            DateShared = datetime.datetime.now(),
            Thumbnail="", # not saved
            AccessCount=1,
            uuid=u.hex
        )
        col.save()
        try:
            doc = Document.objects.get(DocID=DocID)
            doc.Collection.add(col)
            return {"c_pk": col.pk, "d_pk": doc.pk}
        except Document.DoesNotExist: 
            # save Document
            doc = Document(
                Title=Title, 
                Owner_User=user,
                DocID=DocID,
                DocType = DocType.objects.get(Type=DocT),
                DateShared = datetime.datetime.now(),
                OpenNumber = 0,
                ServiceType = ServiceType,
                IconUrl = IconUrl,
                Url = Url,
                thumbnail = thumbnail,
                Subject = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword).Subject,
                Grade = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword).Grade,
                subject_triggerword = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword),
                grade_triggerword = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword)
            )
            doc.save()
            # add collection
            doc.Collection.add(col)
            if standard_pk != None:
                doc.Standard.add( Standard.objects.get(pk=standard_pk) )
            # add tags
            for gt in selected_general_tags:
                try:
                    eg = General_Tag.objects.get(Tag=gt['label'])
                    doc.General_Tags.add(eg)
                except General_Tag.DoesNotExist:
                    eg = General_Tag(Tag=gt['label'])
                    eg.save()
                    doc.General_Tags.add(eg)
            return {"c_pk": col.pk, "d_pk": doc.pk}
    else:
        col = Collection.objects.get(pk=collection_pk)
        try:
            doc = Document.objects.get(DocID=DocID)
            # document is already saved in collection, then return
            if col in doc.Collection.all():
                return {"c_pk": 0, "d_pk": 0}
            else:
                # add document to this collection 
                doc.Collection.add(col)
                return {"c_pk": col.pk, "d_pk": doc.pk}
        except Document.DoesNotExist:
            doc = Document(
                Title=Title, 
                Owner_User=user,
                DocID=DocID,
                DocType = DocType.objects.get(Type=DocT),
                DateShared = datetime.datetime.now(),
                OpenNumber = 0,
                ServiceType = ServiceType,
                IconUrl = IconUrl,
                Url = Url,
                thumbnail = thumbnail,
                Subject = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword).Subject,
                Grade = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword).Grade,
                subject_triggerword = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword),
                grade_triggerword = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword)
            )
            doc.save()
            doc.Collection.add(col)
            if standard_pk != None:
                doc.Standard.add( Standard.objects.get(pk=standard_pk) )
            # add tags
            for gt in selected_general_tags:
                try:
                    eg = General_Tag.objects.get(Tag=gt['label'])
                    doc.General_Tags.add(eg)
                except General_Tag.DoesNotExist:
                    eg = General_Tag(Tag=gt['label'])
                    eg.save()
                    doc.General_Tags.add(eg)
            return {"c_pk": col.pk, "d_pk": doc.pk}

@api_view(["POST"])
def updateFile(request):
    json_data = json.loads(request.POST.get("upload_file_info"))
    Title = json_data["Title"]
    DocID = json_data["DocID"]
    doc_pk = json_data["doc_pk"]
    thumbnail = json_data["web_thumbnail"]
    icon_url = json_data["iconUrl"]
    # selected_methods = json_data["selected_methods"]  # not saved
    selected_general_tags = json_data["selected_general_tags"]
    Url = json_data["url"]
    standard_pk = json_data["standard_pk"]
    selected_subject_triggerword = json_data["selected_subject_triggerword"]
    selected_grade_triggerword = json_data["selected_grade_triggerword"]

    doc = Document.objects.get(pk=doc_pk)
    doc.Title = Title
    doc.DocID = DocID
    doc.thumbnail = thumbnail
    doc.Url = Url
    doc.Subject = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword).Subject
    doc.Grade = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword).Grade
    doc.subject_triggerword = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword)
    doc.grade_triggerword = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword)
    if icon_url != "":
        doc.IconUrl = icon_url
    doc.save()

    doc.Standard.clear()
    if standard_pk != None:
        doc.Standard.add( Standard.objects.get(pk=standard_pk) )

    for gt in selected_general_tags:
        try:
            eg = General_Tag.objects.get(Tag=gt['label'])
            doc.General_Tags.add(eg)
        except General_Tag.DoesNotExist:
            eg = General_Tag(Tag=gt['label'])
            eg.save()
            doc.General_Tags.add(eg)
    
    return Response({"message": "update successfully!"})


@api_view(["POST"])
def getMyData(request):
    GmailID = request.POST.get("GmailID")
    owner = User.objects.get(GmailID=GmailID)
    docs = Document.objects.filter(Owner_User=owner)
    # return Response({"docs": core_serializers.serialize("json", docs)})
    result = []
    for d in docs:
        js = {}
        js['id'] = d.pk
        js["title"] = d.Title
        js["DocID"] = d.DocID
        js["subject"] = d.subject_triggerword.TriggerWord
        js["DocType"] = DocType.objects.get(pk=d.DocType.pk).Type
        js["standard"] = []
        for sd in d.Standard.all():
            js["standard"].append(sd.Standard_Number)
        js["iconUrl"] = d.IconUrl
        js["url"] = d.Url
        js["tags"] = []
        
        if d.General_Tags.all():
            for tag in d.General_Tags.all():
                js["tags"].append(tag.Tag)
        result.append(js)
    return Response({"docs": json.dumps(result)})


def get_youtube_id(url):
    u_pars = urlparse(url)
    quer_v = parse_qs(u_pars.query).get('v')
    if quer_v:
        return quer_v[0]
    pth = u_pars.path.split('/')
    if pth:
        return pth[-1]


@api_view(["POST"])
def getWebThumbnail(request):
    global CHROME_DRIVE_PATH
    url = request.POST.get("web_url")
    print(url)
    if not 'http' in url:
        url = "https://" + url
    ext = tldextract.extract(url)
    if ext.domain == "youtube" or ext.domain == "youtu":
        video_id = get_youtube_id(url)
        url = "https://img.youtube.com/vi/" + video_id + "/0.jpg"
        return Response({"thumbnail_url": url})
    
    else:
        try:
            filename = re.sub(r'[\\/*?:"<>.#|]',"",url)
            _start = time.time()
            options = Options()
            options.add_argument("--headless") # Runs Chrome in headless mode.
            options.add_argument('--no-sandbox') # # Bypass OS security model
            options.add_argument('start-maximized')
            options.add_argument('disable-infobars')
            options.add_argument("--disable-extensions")
            driver = webdriver.Chrome(chrome_options=options, executable_path=CHROME_DRIVE_PATH)
            driver.get(url)
            global STATIC_PATH
            driver.save_screenshot(STATIC_PATH + filename + '.png')
            print(settings.STATICFILES_DIRS[0] + '/images/' + filename + '.png')
            driver.quit()
            _end = time.time()
            return Response({"thumbnail_url": '/static/images/' + filename + '.png'})
        except:
            return Response({"thumbnail_url": ""})


@api_view(["POST"])
def get_webimage_by_random_number(request):
    global CHROME_DRIVE_PATH
    url = request.POST.get("web_url")
    number = int( request.POST.get("r_num") )
    if not 'http' in url:
        url = "https://" + url
    ext = tldextract.extract(url)
    if ext.domain == "youtube" or ext.domain == "youtu":
        video_id = get_youtube_id(url)
        url = "https://img.youtube.com/vi/" + video_id + "/" + str(number % 4) + ".jpg"
        return Response({"thumbnail_url": url})
    
    else:
        # try:#
            filename = re.sub(r'[\\/*?:"<>.#|]',"",url)
            _start = time.time()
            options = Options()
            options.add_argument("--headless") # Runs Chrome in headless mode.
            options.add_argument('--no-sandbox') # # Bypass OS security model
            options.add_argument('start-maximized')
            options.add_argument('disable-infobars')
            options.add_argument("--disable-extensions")
            driver = webdriver.Chrome(chrome_options=options, executable_path=CHROME_DRIVE_PATH)
            driver.get(url)
            images = driver.find_elements_by_tag_name('img')
            image_srcs = []
            for image in images:
                image_srcs.append(image.get_attribute('src'))
            return Response({"thumbnail_url": image_srcs[number % len(image_srcs)] if image_srcs else ""})
        # except:
            # return Response({"thumbnail_url": json.dumps([])})


@api_view(["POST"])
def searchData(request):
    gmail_id = request.POST.get("GmailID")
    user = User.objects.get(GmailID=gmail_id)
    
    keyword = request.POST.get("keyword")
    option = request.POST.get("option")
    community_id = request.POST.get("community_id")
    if keyword == "":
        return Response({"docs": json.dumps([])})
    searchResult = []
    if user.School.Have_standard == 2:
        docs = Document.objects.filter( (Q(Title__icontains=keyword) | Q(Standard__Standard_Number__icontains=keyword) | Q(General_Tags__Tag__icontains=keyword) ) & Q(Owner_User__School__Have_standard=2) )
    else:
        docs = Document.objects.filter( Q(Title__icontains=keyword) | Q(Standard__Standard_Number__icontains=keyword) | Q(General_Tags__Tag__icontains=keyword) )
    result = []

    for d in docs:
        js = {}
        js["title"] = d.Title
        js["DocID"] = d.DocID
        js["owner"] = str(User.objects.get(pk=d.Owner_User.pk).Firstname) + " " + str(User.objects.get(pk=d.Owner_User.pk).Lastname)
        js["DocType"] = DocType.objects.get(pk=d.DocType.pk).Type
        js["standard"] = []
        for sd in d.Standard.all():
            js["standard"].append(sd.Standard_Number)
        js["iconUrl"] = d.IconUrl
        js["url"] = d.Url
        js["tags"] = []
        
        if d.General_Tags.all():
            for tag in d.General_Tags.all():
                js["tags"].append(tag.Tag)
        result.append(js)
    return Response({"docs": json.dumps(result)})


def getThumbnailFromCollection(collection):
    docs = Document.objects.filter(Collection=collection)[0:4]
    thumbnail = []
    for d in docs:
        if d.ServiceType == "Website":
            thumbnail.append(d.thumbnail)
        else:
            thumbnail.append("https://drive.google.com/thumbnail?authuser=0&sz=w320&id=" + d.DocID)
    return thumbnail


@api_view(["POST"])
def getCollectiondata(request):
    GmailID = json.loads(request.POST.get("GmailID"))
    user = User.objects.get(GmailID=GmailID)
    cols = Collection.objects.filter(Owner_User=user)
    
    my_collections = []
    for c in cols:
        json_data = {}
        json_data["title"] = c.Title
        json_data["pk"] = c.pk

        if c.Thumbnail == "":
            json_data["thumbnail"] = getThumbnailFromCollection(c)
        else:
            json_data["thumbnail"] = c.Thumbnail
        my_collections.append(json_data)

    shared_collections_key = SharedCollection.objects.filter(SharedUser=user)
    shared_collections = []
    for s in shared_collections_key:
        json_data = {}
        json_data["title"] = s.SharedCollection.Title
        json_data["pk"] = s.SharedCollection.pk
        
        if s.SharedCollection.Thumbnail == "":
            json_data["thumbnail"] = getThumbnailFromCollection(s.SharedCollection)
        else:
            json_data["thumbnail"] = s.SharedCollection.Thumbnail
        shared_collections.append(json_data)

    return Response({"my_collections": json.dumps(my_collections), "share_collections": json.dumps(shared_collections) })


@api_view(["POST"])
def searchCollection(request):
    GmailID = request.POST.get("GmailID")
    keyword = request.POST.get("keyword")
    user = User.objects.get(GmailID=GmailID)
    cols = Collection.objects.filter(Q(Owner_User=user) & (Q(Title__icontains=keyword) | Q(Description__icontains=keyword)))
    
    my_collections = []
    for c in cols:
        json_data = {}
        json_data["title"] = c.Title
        json_data["pk"] = c.pk
        
        if c.Thumbnail == "":
            json_data["thumbnail"] = getThumbnailFromCollection(c)
        else:
            json_data["thumbnail"] = c.Thumbnail
        my_collections.append(json_data)

    shared_collections_key = SharedCollection.objects.filter(SharedUser=user)
    shared_collections = []
    for s in shared_collections_key:
        json_data = {}
        json_data["title"] = s.SharedCollection.Title
        json_data["pk"] = s.SharedCollection.pk
        
        if s.SharedCollection.Thumbnail == "":
            json_data["thumbnail"] = getThumbnailFromCollection(s.SharedCollection)
        else:
            json_data["thumbnail"] = s.SharedCollection.Thumbnail
        shared_collections.append(json_data)

    return Response({"my_collections": json.dumps(my_collections), "share_collections": json.dumps(shared_collections) })


@api_view(["POST"])
def getCollectionDetail(request):
    collection_id = request.POST.get("collection_id")
    collection_detail = Collection.objects.get(pk=collection_id)
    user = collection_detail.Owner_User

    docs = Document.objects.filter(Collection__pk=collection_id)
    documents = []
    for doc in docs:
        doc_json = {}
        doc_json["pk"] = doc.pk
        doc_json["Title"] = doc.Title
        doc_json["DocID"] = doc.DocID
        doc_json["DocType"] = doc.DocType.Type
        doc_json["DateShared"] = doc.DateShared.strftime("%b. %d %Y")
        doc_json["Subject"] = doc.Subject.Name
        doc_json["Grade"] = doc.Grade.Grade
        doc_json["FileType"] = doc.ServiceType if doc.ServiceType == "Website" else "Document" 
        doc_json["thumbnail"] = doc.thumbnail
        doc_json["iconUrl"] = doc.IconUrl
        doc_json["Standards"] = []
        for st in doc.Standard.all():
            doc_json["Standards"].append(st.Standard_Number)
        doc_json["General_Tags"] = []
        for tag in doc.General_Tags.all():
            doc_json["General_Tags"].append(tag.Tag)
        doc_json["Url"] = doc.Url
        documents.append(doc_json)
    
    if collection_detail.Thumbnail == "":
        thumbnail = getThumbnailFromCollection(collection_detail)
    else:
        thumbnail = collection_detail.Thumbnail

    return Response({"title": collection_detail.Title, "thumbnail":thumbnail,
        "description": collection_detail.Description, "uuid": collection_detail.uuid,
        "role": user.Role.Title, "school": user.School.Name, 
        "docs": json.dumps(documents)
    })


@api_view(["POST"])
def collectionShare(request):
    collection_id = request.POST.get("collection_id")
    target_email = request.POST.get("target_email")
    try:
        shared_user = User.objects.get(Email=target_email)
    except User.DoesNotExist:
        return Response({"message": "This user is not signed in Coteacher."})
    
    shared_collection = Collection.objects.get(pk=collection_id)
    if shared_collection.Owner_User == shared_user:
        return Response({"message": "This email is yours."})
    
    try:
        sc = SharedCollection.objects.get(SharedUser=shared_user, SharedCollection=shared_collection)
        return Response({"message": "This collection was already shared with this user."})
    except SharedCollection.DoesNotExist:
        sc = SharedCollection(SharedUser=shared_user, SharedCollection=shared_collection)
        sc.save()

    return Response({"message": "Successfully shared!"})
    

@api_view(["POST"])
def getCollectionDetailFromUUID(request):
    collection_uuid = request.POST.get("uuid")
    google_id = request.POST.get("GmailID")
    collection_detail = Collection.objects.get(uuid=collection_uuid)
    user = collection_detail.Owner_User

    docs = Document.objects.filter(Collection__uuid=collection_uuid)
    documents = []
    for doc in docs:
        doc_json = {}
        doc_json["pk"] = doc.pk
        doc_json["Title"] = doc.Title
        doc_json["DocID"] = doc.DocID
        doc_json["DocType"] = doc.DocType.Type
        doc_json["DateShared"] = doc.DateShared.strftime("%b. %d %Y")
        doc_json["Subject"] = doc.Subject.Name
        doc_json["Grade"] = doc.Grade.Grade
        doc_json["FileType"] = doc.ServiceType if doc.ServiceType == "Website" else "Document" 
        doc_json["thumbnail"] = doc.thumbnail
        doc_json["iconUrl"] = doc.IconUrl
        doc_json["Standards"] = []
        for st in doc.Standard.all():
            doc_json["Standards"].append(st.Standard_Number)
        doc_json["General_Tags"] = []
        for tag in doc.General_Tags.all():
            doc_json["General_Tags"].append(tag.Tag)
        doc_json["Url"] = doc.Url
        documents.append(doc_json)

    if collection_detail.Thumbnail == "":
        thumbnail = getThumbnailFromCollection(collection_detail)
    else:
        thumbnail = collection_detail.Thumbnail

    if google_id != None:
        try:
            shared_user = User.objects.get(GmailID=google_id)
            if shared_user.pk != user.pk:
                try:
                    shared_collection = SharedCollection.objects.get(SharedUser=shared_user, SharedCollection=collection_detail)
                except SharedCollection.DoesNotExist:
                    shared_collection = SharedCollection(SharedUser=shared_user, SharedCollection=collection_detail)
                    shared_collection.save()
        except User.DoesNotExist:
            return Response({"title": collection_detail.Title, "thumbnail":thumbnail,
                    "description": collection_detail.Description, "uuid": collection_detail.uuid,
                    "role": user.Role.Title, "school": user.School.Name, 
                    "docs": json.dumps(documents)
                })
        
    return Response({"title": collection_detail.Title, "thumbnail":thumbnail,
        "description": collection_detail.Description, "uuid": collection_detail.uuid,
        "role": user.Role.Title, "school": user.School.Name, 
        "docs": json.dumps(documents)
    })


@api_view(["POST"])
def changeCollectionTitleDescription(request):
    collection_id = request.POST.get("col_id")
    collection_title = request.POST.get("col_title")
    collection_description = request.POST.get("col_description")

    obj = Collection.objects.get(pk=collection_id)
    obj.Title = collection_title
    obj.Description = collection_description
    obj.save()

    collection_detail = Collection.objects.get(pk=collection_id)
    user = collection_detail.Owner_User

    docs = Document.objects.filter(Collection__pk=collection_id)
    documents = []
    for doc in docs:
        doc_json = {}
        doc_json["pk"] = doc.pk
        doc_json["Title"] = doc.Title
        doc_json["DocID"] = doc.DocID
        doc_json["DocType"] = doc.DocType.Type
        doc_json["DateShared"] = doc.DateShared.strftime("%b. %d %Y")
        doc_json["Subject"] = doc.Subject.Name
        doc_json["Grade"] = doc.Grade.Grade
        doc_json["FileType"] = doc.ServiceType if doc.ServiceType == "Website" else "Document" 
        doc_json["thumbnail"] = doc.thumbnail
        doc_json["iconUrl"] = doc.IconUrl
        doc_json["Standards"] = []
        for st in doc.Standard.all():
            doc_json["Standards"].append(st.Standard_Number)
        doc_json["General_Tags"] = []
        for tag in doc.General_Tags.all():
            doc_json["General_Tags"].append(tag.Tag)
        doc_json["Url"] = doc.Url
        documents.append(doc_json)

    if collection_detail.Thumbnail == "":
        thumbnail = getThumbnailFromCollection(collection_detail)
    else:
        thumbnail = collection_detail.Thumbnail

    return Response({"title": collection_detail.Title, "thumbnail":thumbnail,
        "description": collection_detail.Description, "uuid": collection_detail.uuid,
        "role": user.Role.Title, "school": user.School.Name, 
        "docs": json.dumps(documents)
    })


@api_view(["POST"])
def createEmptyCollection(request):
    collection_uuid = request.POST.get("col_uuid")
    collection_title = request.POST.get("col_title")
    collection_description = request.POST.get("col_description")
    GmailID = request.POST.get("GmailID")
    user = User.objects.get(GmailID=GmailID)

    if collection_uuid == "":
        u = uuid.uuid4()
        col = Collection(
            Title=collection_title,
            Description=collection_description,
            Owner_User=user,
            DateShared = datetime.datetime.now(),
            Thumbnail="", # not saved
            AccessCount=1,
            uuid=u.hex
        )
        col.save()
    else:
        col = Collection.objects.get(uuid=collection_uuid)
        col.Title = collection_title
        col.Description = collection_description
        col.save()

    return Response({"uuid": col.uuid, "col_id": col.pk})


@api_view(["POST"])
def removeDocument(request):
    doc_id = request.POST.get("doc_id")
    doc = Document.objects.get(DocID=doc_id)
    doc.delete()

    return Response({"message": "delete document is succeeded"})


@api_view(["POST"])
def removeCollection(request):
    col_id = request.POST.get("col_id")
    col = Collection.objects.get(pk=col_id)
    col.delete()

    return Response({"message": "delete collection is succeeded"})


@api_view(["POST"])
def remove_shared_collection(request):
    col_id = request.POST.get("col_id")
    google_id = request.POST.get("GmailID")
    user = User.objects.get(GmailID=google_id)
    shared_collection = Collection.objects.get(pk=col_id)
    SharedCollection.objects.filter(SharedUser=user, SharedCollection=shared_collection).delete()

    return Response({"message": "delete shared collection is succeeded"})
    

@api_view(["POST"])
def getDocumentData(request):
    doc_id = request.POST.get("document_id")
    GmailID = request.POST.get("GmailID")
    user = User.objects.get(GmailID=GmailID)
    category = "Adult" if user.School.Have_standard > 1 else "K12"
    general_tags = General_Tag.objects.all()
    subject_triggerword = SubjectTrigger.objects.all()
    grade_triggerword = GradeTrigger.objects.all()
    doctype = DocType.objects.all()
    cols = Collection.objects.filter(Owner_User=user)
    
    collections = []
    for c in cols:
        json_data = {}
        json_data["title"] = c.Title
        json_data["pk"] = c.pk

        if c.Thumbnail == "":
            json_data["thumbnail"] = getThumbnailFromCollection(c)
        else:
            json_data["thumbnail"] = c.Thumbnail
        collections.append(json_data)

    doc = Document.objects.filter(pk=doc_id).first()

    doc_json = {}
    doc_json["pk"] = doc.pk
    doc_json["Title"] = doc.Title
    doc_json["DocID"] = doc.DocID
    doc_json["DocType"] = doc.DocType.Type
    doc_json["DateShared"] = doc.DateShared.strftime("%b. %d %Y")
    doc_json["subject_triggerword"] = doc.subject_triggerword.TriggerWord
    doc_json["grade_triggerword"] = doc.grade_triggerword.TriggerWord
    doc_json["FileType"] = doc.ServiceType if doc.ServiceType == "Website" else "Document" 
    doc_json["thumbnail"] = doc.thumbnail
    doc_json["iconUrl"] = doc.IconUrl
    doc_json["Standards"] = []
    doc_json["Strands"] =[]
    for st in doc.Standard.all():
        doc_json["Standards"].append(st.Standard_Number)
        doc_json["Strands"].append(st.Strand)
    
    if not doc_json["Standards"]:
        doc_json["standard"] = ""
    else:
        doc_json["standard"] = doc_json["Standards"][0]
    
    if not doc_json["Strands"]:
        doc_json["strand"] = ""
    else:    
        doc_json["strand"] = doc_json["Strands"][0]

    doc_json["General_Tags"] = []
    for tag in doc.General_Tags.all():
        doc_json["General_Tags"].append(tag.Tag)
    doc_json["Url"] = doc.Url
    doc_json["standard_set"] = ""
    try:
        selected_subject_triggerword = doc_json["subject_triggerword"]
        selected_grade_triggerword = doc_json["grade_triggerword"]
        state = User.objects.get(GmailID=GmailID).School.State
        subject = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword).Subject
        grade = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword).Grade
    
        standard_set = StateStandard.objects.get(State=state, Subject=subject, Category=category).StandardSet
        strand = Standard.objects.filter(StandardSet=standard_set, Grade=grade).values("Strand").distinct()
        json_strands = json.dumps( list(strand) )
        doc_json["standard_set"] = standard_set.SetLabel
    # except Standard.DoesNotExist or StateStandard.DoesNotExist:
    except:
        json_strands = json.dumps( list([]) )
        json_standard_set = ''
    
    state = User.objects.get(GmailID=GmailID).School.State
    subject = SubjectTrigger.objects.get(TriggerWord=selected_subject_triggerword).Subject
    grade = GradeTrigger.objects.get(TriggerWord=selected_grade_triggerword).Grade

    json_codes = json.dumps( list([]) )
    if doc_json["Strands"]:
        selected_strand = doc_json["Strands"][0]
        
        try:
            standard_set = StateStandard.objects.get(State=state, Subject=subject, Category=category).StandardSet
            code = Standard.objects.filter(StandardSet=standard_set, Grade=grade, Strand=selected_strand).values("id", "Standard_Number", "Description").distinct()
            json_codes = json.dumps( list(code) )
        except Standard.DoesNotExist or StateStandard.DoesNotExist:
            json_codes = json.dumps( list([]) )
    
    return Response({
        "general_tags": core_serializers.serialize("json", general_tags),
        "subject_triggerword": core_serializers.serialize("json", subject_triggerword),
        "grade_triggerword": core_serializers.serialize("json", grade_triggerword),
        "doctype": core_serializers.serialize("json", doctype),
        "collections": json.dumps(collections),
        "strand": json_strands,
        "code": json_codes,
        "standard_set": doc_json["standard_set"],
        "doc": doc_json
    })


@api_view(["POST"])
def get_community(request):
    GmailID = request.POST.get("GmailID")
    user = User.objects.get(GmailID=GmailID)
    communities = CommunityMember.objects.filter(user=user, role="user")
    coms = []
    for community in communities:
        json_data = {}
        json_data["community_name"] = community.community.community_name
        json_data["pk"] = community.community.pk
        coms.append(json_data)
    
    shared_communities = []
    for sc in user.shared_community.all():
        shared_communities.append(sc.pk)

    return Response({
        "communities": json.dumps(coms),
        "shared_communities": json.dumps(shared_communities)
    })


@api_view(["POST"])
def get_admin_communities(request):
    GmailID = request.POST.get("GmailID")
    user = User.objects.get(GmailID=GmailID)
    admin_communities = CommunityMember.objects.filter(user=user, role="admin").order_by("member_since_date")
    communities = []
    for ac in admin_communities:
        json_data = {}
        json_data["pk"] = ac.community.pk
        json_data["name"] = ac.community.community_name
        json_data["memberCount"] = CommunityMember.objects.filter(role="user", community=ac.community).count()
        communities.append(json_data)

    return Response({
        "communities": json.dumps(communities),
    })


@api_view(["POST"])
def get_community_name(request):
    community_id = request.POST.get("communityID")
    return Response({"communityName": Community.objects.get(pk=community_id).community_name})


@api_view(["POST"])
def save_sharings_setting(request):
    GmailID = request.POST.get("GmailID")
    SettingData = json.loads(request.POST.get("setting"))
    user = User.objects.get(GmailID=GmailID)
    user.shared_community.clear()
    for sd in SettingData:
        if sd["isChecked"] == True:
            user.shared_community.add(Community.objects.get(pk=sd["id"]))

    communities = CommunityMember.objects.filter(user=user, role="user")
    coms = []
    for community in communities:
        json_data = {}
        json_data["community_name"] = community.community.community_name
        json_data["pk"] = community.community.pk
        coms.append(json_data)
    
    shared_communities = []
    for sc in user.shared_community.all():
        shared_communities.append(sc.pk)

    return Response({
        "communities": json.dumps(coms),
        "shared_communities": json.dumps(shared_communities)
    })



@api_view(["POST"])
def is_admin(request):
    GmailID = request.POST.get("GmailID")
    try:
        user = User.objects.get(GmailID=GmailID)
    except User.DoesNotExist:
        return Response({"isAdmin": False})
    CountCommunity = CommunityMember.objects.filter(user=user, role="admin").count()
    return Response({"isAdmin": True if CountCommunity > 0 else False})


@api_view(["POST"])
def get_users_per_communities(request):
    CommunityID = request.POST.get("community_id")
    Cm = Community.objects.get(pk=CommunityID)
    CommunityResult = CommunityMember.objects.filter(community=Cm, role="user")
    ExistingUsers = []
    for cr in CommunityResult:
        ExistingUsers.append(cr.user.pk)
    
    return Response({"users": core_serializers.serialize('json', User.objects.all() ), 
        "existingUsers": json.dumps(ExistingUsers)})


@api_view(["POST"])
def save_community_setting(request):
    users = json.loads( request.POST.get("users") )
    CommunityID = request.POST.get("communityID")
    DeletedCommunity = Community.objects.get(pk=CommunityID)
    CommunityMember.objects.filter(community=DeletedCommunity, role="user").delete()
    for user in users:
        if user["isChecked"] == True:
            c = CommunityMember(role="user", member_since_date=datetime.datetime.now(), user=User.objects.get(pk=user["id"]), 
                community=DeletedCommunity)
            c.save()

    CommunityResult = CommunityMember.objects.filter(community=DeletedCommunity, role="user")
    ExistingUsers = []
    for cr in CommunityResult:
        ExistingUsers.append(cr.user.pk)
    
    return Response({"users": core_serializers.serialize('json', User.objects.all() ), 
        "existingUsers": json.dumps(ExistingUsers)})


@api_view(["POST"])
def add_email_to_community(request):
    community_id = request.POST.get("communityID")
    email = request.POST.get("email")
    community = Community.objects.get(pk=community_id)
    try:
        com_usr_email = CommunityUserEmail.objects.get(email=email)
    except CommunityUserEmail.DoesNotExist:
        com_usr_email = CommunityUserEmail(email=email, community=community)
        com_usr_email.save()

    return Response({"message": "success"})


@api_view(["POST"])
def add_email_from_csv(request):
    community_id = request.data['community_id']
    file_obj = request.data['file_object']
    community = Community.objects.get(pk=community_id)
    decoded_file = file_obj.read().decode('utf-8')
    io_string = io.StringIO(decoded_file)
    for line in csv.DictReader(io_string):
        try:
            com_usr_email = CommunityUserEmail.objects.get(email=line["Email"])
        except CommunityUserEmail.DoesNotExist:
            com_usr_email = CommunityUserEmail(first_name=line["Firstname"], last_name=line["Lastname"], email=line["Email"], community=community) 
            com_usr_email.save()
    
    return Response({"message": "success", "fileName": file_obj.name})


@api_view(["POST"])
def download_csv(request):
    community_id = request.POST.get("community_id")
    with open('data/download/MEMBERS LIST.csv', mode='w') as csv_file:
        fieldnames = ['Firstname', 'Lastname', 'Email']
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        com_usr_data = CommunityUserEmail.objects.all()
        for usr in com_usr_data:
            writer.writerow({'Firstname': usr.first_name, 'Lastname': usr.last_name, 'Email': usr.email})

    return Response({"message": "success"})