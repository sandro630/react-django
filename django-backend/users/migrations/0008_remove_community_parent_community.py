# Generated by Django 2.0.3 on 2019-06-29 07:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_auto_20190628_1820'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='community',
            name='parent_community',
        ),
    ]