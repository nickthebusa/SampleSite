# Generated by Django 5.0 on 2024-01-09 19:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apiService', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='sample',
            name='username',
            field=models.CharField(default='', max_length=100),
        ),
    ]