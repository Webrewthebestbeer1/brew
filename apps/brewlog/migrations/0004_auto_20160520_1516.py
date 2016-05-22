# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-20 15:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('brewlog', '0003_auto_20160520_1436'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='volume',
            name='entry',
        ),
        migrations.AddField(
            model_name='entry',
            name='batch_size',
            field=models.IntegerField(default=19),
        ),
        migrations.AddField(
            model_name='entry',
            name='boil_time',
            field=models.IntegerField(default=60),
        ),
        migrations.AddField(
            model_name='entry',
            name='equipment_loss',
            field=models.DecimalField(decimal_places=1, default=0.4, max_digits=3),
        ),
        migrations.AddField(
            model_name='entry',
            name='evaporation_factor',
            field=models.DecimalField(decimal_places=2, default=0.95, max_digits=3),
        ),
        migrations.AddField(
            model_name='entry',
            name='grain_absorption',
            field=models.DecimalField(decimal_places=2, default=1.08, max_digits=3),
        ),
        migrations.AddField(
            model_name='entry',
            name='grain_bill',
            field=models.IntegerField(default=6),
        ),
        migrations.AddField(
            model_name='entry',
            name='grain_temperature',
            field=models.IntegerField(default=20),
        ),
        migrations.AddField(
            model_name='entry',
            name='mash_temperature',
            field=models.IntegerField(default=67),
        ),
        migrations.AddField(
            model_name='entry',
            name='mash_thickness',
            field=models.DecimalField(decimal_places=2, default=2.61, max_digits=3),
        ),
        migrations.AddField(
            model_name='entry',
            name='percent_boiloff',
            field=models.IntegerField(default=7),
        ),
        migrations.AddField(
            model_name='entry',
            name='trub_loss',
            field=models.DecimalField(decimal_places=1, default=1.9, max_digits=3),
        ),
        migrations.AddField(
            model_name='entry',
            name='wort_shrinkage',
            field=models.IntegerField(default=4),
        ),
        migrations.DeleteModel(
            name='Volume',
        ),
    ]