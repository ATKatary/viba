# Generated by Django 5.0.6 on 2024-06-26 22:08

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_message_time_sent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='time_sent',
            field=models.DateTimeField(default=datetime.datetime(2024, 6, 26, 22, 8, 47, 114387, tzinfo=datetime.timezone.utc)),
        ),
    ]
