# Generated by Django 4.2.1 on 2023-06-06 20:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('clubs', '0002_user_is_admin'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='is_admin',
            new_name='isAdmin',
        ),
    ]
