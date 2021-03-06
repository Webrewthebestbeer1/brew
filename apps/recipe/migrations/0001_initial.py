# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-29 17:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('inventory', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Brew',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(default=django.utils.timezone.now)),
                ('fermentation_temperature', models.IntegerField(null=True)),
                ('fermentation_time', models.IntegerField(null=True)),
                ('og', models.DecimalField(decimal_places=3, max_digits=4, null=True)),
                ('fg', models.DecimalField(decimal_places=3, max_digits=4, null=True)),
                ('rating', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField()),
                ('comment', models.CharField(max_length=1000)),
                ('brew', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='recipe.Brew')),
            ],
        ),
        migrations.CreateModel(
            name='Equipment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('trub_loss', models.DecimalField(decimal_places=1, default=1.9, max_digits=3, null=True)),
                ('equipment_loss', models.DecimalField(decimal_places=1, default=0.4, max_digits=3, null=True)),
                ('mash_thickness', models.DecimalField(decimal_places=2, default=2.61, max_digits=3, null=True)),
                ('wort_shrinkage', models.IntegerField(default=4, null=True)),
                ('grain_absorption', models.DecimalField(decimal_places=2, default=1.08, max_digits=3, null=True)),
                ('percent_boiloff', models.IntegerField(default=7, null=True)),
                ('evaporation_factor', models.DecimalField(decimal_places=2, default=0.95, max_digits=3, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Hop',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=1, max_digits=4)),
                ('add', models.IntegerField()),
                ('inventory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='uses', to='inventory.Hop')),
            ],
        ),
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.TimeField()),
                ('end', models.TimeField()),
                ('description', models.CharField(max_length=200)),
                ('brew', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='recipe.Brew')),
            ],
        ),
        migrations.CreateModel(
            name='Malt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=5)),
                ('inventory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='uses', to='inventory.Malt')),
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
                ('date', models.DateTimeField(default=django.utils.timezone.now)),
                ('batch_size', models.IntegerField(default=19, null=True)),
                ('boil_time', models.IntegerField(default=60, null=True)),
                ('mash_temperature', models.IntegerField(default=67, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='malt',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='malts', to='recipe.Recipe'),
        ),
        migrations.AddField(
            model_name='hop',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hops', to='recipe.Recipe'),
        ),
        migrations.AddField(
            model_name='brew',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='brews', to='recipe.Recipe'),
        ),
    ]
