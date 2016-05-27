# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-26 16:50
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('brewlog', '0018_auto_20160526_1031'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipe',
            name='grain_temperature',
        ),
        migrations.AlterField(
            model_name='brew',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2016, 5, 26, 16, 50, 31, 311758, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2016, 5, 26, 16, 50, 31, 309933, tzinfo=utc)),
        ),
    ]