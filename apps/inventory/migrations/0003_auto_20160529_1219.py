# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-29 12:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0002_auto_20160529_1218'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hop',
            name='amount',
            field=models.DecimalField(decimal_places=1, default=0.0, max_digits=5),
        ),
        migrations.AlterField(
            model_name='malt',
            name='amount',
            field=models.IntegerField(),
        ),
    ]
