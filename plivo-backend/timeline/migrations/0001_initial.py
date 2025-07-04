# Generated by Django 5.2.3 on 2025-06-29 07:56

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('users', '0007_user_has_access'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Timeline',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_type', models.CharField(choices=[('incident_created', 'Incident Created'), ('incident_updated', 'Incident Updated'), ('incident_deleted', 'Incident Deleted'), ('service_status_changed', 'Service Status Changed')], max_length=30, verbose_name='Event Type')),
                ('object_id', models.PositiveIntegerField()),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True, null=True)),
                ('old_value', models.CharField(blank=True, max_length=100, null=True)),
                ('new_value', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='timeline_events', to='users.organization', verbose_name='Organization')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='timeline_actions', to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
            options={
                'db_table': 'timeline',
                'ordering': ['-created_at'],
                'indexes': [models.Index(fields=['organization'], name='timeline_organiz_3cb87b_idx'), models.Index(fields=['event_type'], name='timeline_event_t_aef8f5_idx'), models.Index(fields=['content_type', 'object_id'], name='timeline_content_debaf3_idx'), models.Index(fields=['user'], name='timeline_user_id_2a5171_idx'), models.Index(fields=['created_at'], name='timeline_created_531a15_idx')],
            },
        ),
    ]
