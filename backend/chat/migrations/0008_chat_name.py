# Generated by Django 5.0.6 on 2024-07-02 07:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0007_alter_message_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='name',
            field=models.CharField(blank=True, max_length=1000),
        ),
    ]
