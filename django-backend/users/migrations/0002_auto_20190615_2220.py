# Generated by Django 2.0.3 on 2019-06-15 19:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='DocID',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='document',
            name='IconUrl',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='document',
            name='Title',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='document',
            name='Url',
            field=models.TextField(null=True),
        ),
    ]
