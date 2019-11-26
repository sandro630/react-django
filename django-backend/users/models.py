from django.db import models

class Role(models.Model):
    Title = models.CharField(max_length=30)


class State(models.Model):
    StateName = models.CharField(max_length=30)
    StateAbbr = models.CharField(max_length=10, null=True)


class School(models.Model):
    Name = models.CharField(max_length=50)
    District = models.CharField(max_length=50)
    City = models.CharField(max_length=50, null=True)
    State = models.ForeignKey(State, on_delete=models.CASCADE, null=True)
    Have_standard = models.IntegerField()

    @property
    def state_name(self):
        return self.State.StateName


class Subject(models.Model):
    Name = models.CharField(max_length=30)


class Grade(models.Model):
    Grade = models.CharField(max_length=30)


class Student_Need(models.Model):
    Population = models.CharField(max_length=30)


class General_Tag(models.Model):
    Tag = models.CharField(max_length=30)


class Community(models.Model):
    community_name = models.CharField(max_length=50)
    # parent_community = models.ForeignKey('self', on_delete=models.CASCADE)

class GradeTrigger(models.Model):
    TriggerWord = models.CharField(max_length=30)
    Grade = models.ForeignKey(Grade, on_delete=models.CASCADE, null=True)


class User(models.Model):
    Firstname = models.CharField(max_length=30, null=True)
    Lastname = models.CharField(max_length=30, null=True)
    Email = models.CharField(max_length=50, null=True)
    GmailID = models.CharField(max_length=50)
    School = models.ForeignKey(School, on_delete=models.CASCADE)
    Role = models.ForeignKey(Role, on_delete=models.CASCADE)
    Subjects = models.ManyToManyField(Subject)
    Grades = models.ManyToManyField(Grade)
    GradeTrigger = models.ManyToManyField(GradeTrigger)
    Student_needs = models.ManyToManyField(Student_Need)
    General_Tags = models.ManyToManyField(General_Tag)
    shared_community = models.ManyToManyField(Community)


class CommunityMember(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=30)
    member_since_date = models.DateTimeField()

class DocType(models.Model):
    Type = models.CharField(max_length=30)


class SubjectTrigger(models.Model):
    TriggerWord = models.CharField(max_length=30)
    Subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True)





class StandardSet(models.Model):
    SetLabel = models.CharField(max_length=100)


class StateStandard(models.Model):
    State = models.ForeignKey(State, on_delete=models.CASCADE)
    StandardSet = models.ForeignKey(StandardSet, on_delete=models.CASCADE)
    Subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    Category = models.CharField(max_length=30, null=True) # will be adult or K12. adult means 2 in Have_Strandard field in schoool, K12 means 0 or 1.


class Standard(models.Model):
    StandardSet = models.ForeignKey(StandardSet, on_delete=models.CASCADE)
    Grade = models.ForeignKey(Grade, on_delete=models.CASCADE, null=True)
    Standard_Number = models.CharField(max_length=50)
    Strand = models.CharField(max_length=50)
    Description = models.TextField()


class Collection(models.Model):
    Title = models.CharField(max_length=50)
    Owner_User = models.ForeignKey(User, on_delete=models.CASCADE)
    DateShared = models.DateTimeField()
    Thumbnail = models.CharField(max_length=50)
    AccessCount = models.IntegerField()
    Description = models.TextField(null=True)
    uuid = models.CharField(max_length=50, null=True)


class Document(models.Model):
    Title = models.CharField(max_length=200)
    Owner_User = models.ForeignKey(User, on_delete=models.CASCADE)
    DocID = models.CharField(max_length=200)
    DocType = models.ForeignKey(DocType, on_delete=models.CASCADE)
    Collection = models.ManyToManyField(Collection) # should be not null
    DateShared = models.DateTimeField()
    OpenNumber = models.IntegerField()
    General_Tags = models.ManyToManyField(General_Tag)
    ServiceType = models.CharField(max_length=30, null=True)
    IconUrl = models.TextField(null=True)
    Url = models.TextField(null=True)
    thumbnail = models.TextField(null=True)
    Standard = models.ManyToManyField(Standard)
    Subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    Grade = models.ForeignKey(Grade, on_delete=models.CASCADE)
    subject_triggerword = models.ForeignKey(SubjectTrigger, on_delete=models.CASCADE, null=True)
    grade_triggerword = models.ForeignKey(GradeTrigger, on_delete=models.CASCADE, null=True)


class ExtResource(models.Model):
    Title = models.CharField(max_length=50)
    Owner_User = models.ForeignKey(User, on_delete=models.CASCADE)
    WebAddress = models.CharField(max_length=100)
    DocType = models.ForeignKey(DocType, on_delete=models.CASCADE)
    Collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    DateShared = models.DateTimeField()
    AccessCount = models.IntegerField()
    General_Tags = models.ManyToManyField(General_Tag)
    Subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    Grade = models.ForeignKey(Grade, on_delete=models.CASCADE)


class SharedFile(models.Model):
    SharedUser = models.ForeignKey(User, on_delete=models.CASCADE)
    SharedDoc = models.ForeignKey(Document, on_delete=models.CASCADE)


class SharedCollection(models.Model):
    SharedUser = models.ForeignKey(User, on_delete=models.CASCADE)
    SharedCollection = models.ForeignKey(Collection, on_delete=models.CASCADE)


class CommunityUserEmail(models.Model):
    first_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50, null=True)
    email = models.CharField(max_length=100)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)


