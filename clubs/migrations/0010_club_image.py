# Generated by Django 4.2.1 on 2023-07-02 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubs', '0009_club_interestedusers_alter_club_editors'),
    ]

    operations = [
        migrations.AddField(
            model_name='club',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]
