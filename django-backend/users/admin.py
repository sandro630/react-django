from django.contrib import admin
from .models import *

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    pass

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    pass

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    pass

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    pass

@admin.register(Student_Need)
class Student_NeedAdmin(admin.ModelAdmin):
    pass

@admin.register(General_Tag)
class General_TagAdmin(admin.ModelAdmin):
    pass

@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    pass

@admin.register(DocType)
class DocTypeAdmin(admin.ModelAdmin):
    pass

@admin.register(SubjectTrigger)
class SubjectTriggerAdmin(admin.ModelAdmin):
    pass

@admin.register(GradeTrigger)
class GradeTriggerAdmin(admin.ModelAdmin):
    pass

@admin.register(StandardSet)
class StandardSetAdmin(admin.ModelAdmin):
    pass

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    pass

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass

@admin.register(StateStandard)
class StateStandardAdmin(admin.ModelAdmin):
    pass

@admin.register(Standard)
class StandardAdmin(admin.ModelAdmin):
    pass

@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    pass

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    pass

@admin.register(ExtResource)
class ExtResourceAdmin(admin.ModelAdmin):
    pass

@admin.register(SharedFile)
class SharedFileAdmin(admin.ModelAdmin):
    pass

@admin.register(SharedCollection)
class SharedCollectionAdmin(admin.ModelAdmin):
    pass

