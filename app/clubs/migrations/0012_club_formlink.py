# Generated by Django 4.2.1 on 2023-09-11 02:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubs', '0011_alter_club_interestedusers'),
    ]

    operations = [
        migrations.AddField(
            model_name='club',
            name='formLink',
            field=models.URLField(blank=True, max_length=256),
        ),
    ]
