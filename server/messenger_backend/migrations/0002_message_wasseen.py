# Generated by Django 3.2.4 on 2022-03-22 04:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger_backend', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='wasSeen',
            field=models.BooleanField(default=False),
        ),
    ]
