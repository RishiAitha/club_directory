# Generated by Django 4.2.1 on 2023-07-02 13:31

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubs', '0010_club_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='club',
            name='interestedUsers',
            field=models.ManyToManyField(blank=True, related_name='interestingClubs', to=settings.AUTH_USER_MODEL),
        ),
    ]
