# Generated by Django 4.2.2 on 2023-06-27 13:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='appuser',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]