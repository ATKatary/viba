# Generated by Django 5.0.6 on 2024-06-26 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='verification_code',
        ),
        migrations.AlterField(
            model_name='customuser',
            name='id',
            field=models.CharField(editable=False, max_length=26, primary_key=True, serialize=False, unique=True),
        ),
    ]
