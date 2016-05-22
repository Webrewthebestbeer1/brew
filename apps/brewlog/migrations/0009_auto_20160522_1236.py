# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-22 12:36
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('brewlog', '0008_auto_20160522_1230'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entry',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2016, 5, 22, 12, 36, 43, 818367, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='log',
            name='end',
            field=models.TimeField(),
        ),
        migrations.AlterField(
            model_name='log',
            name='start',
            field=models.TimeField(),
        ),
    ]