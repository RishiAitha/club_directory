# Generated by Django 4.2.1 on 2023-06-11 22:19

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('clubs', '0006_alter_club_messages'),
    ]

    operations = [
        migrations.AddField(
            model_name='club',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
