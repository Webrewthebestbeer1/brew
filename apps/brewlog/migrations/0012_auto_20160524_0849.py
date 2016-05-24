# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-24 08:49
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('brewlog', '0011_auto_20160522_2235'),
    ]

    operations = [
        migrations.CreateModel(
            name='Brew',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(default=datetime.datetime(2016, 5, 24, 8, 49, 16, 160151, tzinfo=utc))),
                ('fermentation_temperature', models.IntegerField(null=True)),
                ('fermentation_time', models.IntegerField(null=True)),
                ('og', models.DecimalField(decimal_places=3, max_digits=4, null=True)),
                ('fg', models.DecimalField(decimal_places=3, max_digits=4, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('yeast', models.CharField(max_length=100, null=True)),
                ('mash_time', models.IntegerField(null=True)),
                ('sparge_time', models.IntegerField(null=True)),
                ('date', models.DateTimeField(default=datetime.datetime(2016, 5, 24, 8, 49, 16, 158544, tzinfo=utc))),
                ('batch_size', models.IntegerField(default=19, null=True)),
                ('grain_bill', models.IntegerField(default=6, null=True)),
                ('boil_time', models.IntegerField(default=60, null=True)),
                ('mash_temperature', models.IntegerField(default=67, null=True)),
                ('trub_loss', models.DecimalField(decimal_places=1, default=1.9, max_digits=3, null=True)),
                ('equipment_loss', models.DecimalField(decimal_places=1, default=0.4, max_digits=3, null=True)),
                ('mash_thickness', models.DecimalField(decimal_places=2, default=2.61, max_digits=3, null=True)),
                ('grain_temperature', models.IntegerField(default=20, null=True)),
                ('wort_shrinkage', models.IntegerField(default=4, null=True)),
                ('grain_absorption', models.DecimalField(decimal_places=2, default=1.08, max_digits=3, null=True)),
                ('percent_boiloff', models.IntegerField(default=7, null=True)),
                ('evaporation_factor', models.DecimalField(decimal_places=2, default=0.95, max_digits=3, null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='comment',
            name='entry',
        ),
        migrations.RemoveField(
            model_name='hop',
            name='entry',
        ),
        migrations.RemoveField(
            model_name='log',
            name='entry',
        ),
        migrations.RemoveField(
            model_name='malt',
            name='entry',
        ),
        migrations.DeleteModel(
            name='Entry',
        ),
        migrations.AddField(
            model_name='brew',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recipes', to='brewlog.Recipe'),
        ),
        migrations.AddField(
            model_name='comment',
            name='brew',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='brewlog.Brew'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='hop',
            name='recipe',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='hops', to='brewlog.Recipe'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='log',
            name='brew',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='brewlog.Brew'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='malt',
            name='recipe',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='malts', to='brewlog.Recipe'),
            preserve_default=False,
        ),
    ]