# Generated by Django 5.2.3 on 2025-06-28 19:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_remove_invitelink_is_used'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='has_access',
            field=models.BooleanField(default=False),
        ),
    ]
