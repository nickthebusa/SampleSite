# Generated by Django 5.0.3 on 2024-04-05 18:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apiService', '0004_alter_tag_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sample',
            name='date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]