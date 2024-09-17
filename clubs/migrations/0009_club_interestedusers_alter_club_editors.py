# Generated by Django 4.2.1 on 2023-06-22 15:25

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubs', '0008_reply_message_replies'),
    ]

    operations = [
        migrations.AddField(
            model_name='club',
            name='interestedUsers',
            field=models.ManyToManyField(related_name='interestingClubs', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='club',
            name='editors',
            field=models.ManyToManyField(blank=True, related_name='clubsEditing', to=settings.AUTH_USER_MODEL),
        ),
    ]