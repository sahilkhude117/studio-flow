# Generated by Django 5.2 on 2025-04-09 00:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('database', '0005_flowrun_completed_at_flowrun_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flow',
            name='userId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='flows', to='database.user'),
        ),
    ]
