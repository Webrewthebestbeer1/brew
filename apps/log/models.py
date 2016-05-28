from django.db import models

import django.utils

class Recipe(models.Model):
    name = models.CharField(max_length=100)
    yeast = models.CharField(max_length=100, null=True)
    mash_time = models.IntegerField(null=True)
    sparge_time = models.IntegerField(null=True)
    date = models.DateTimeField(default=django.utils.timezone.now)
    batch_size = models.IntegerField(default=19, null=True)
    boil_time = models.IntegerField(default=60, null=True)
    mash_temperature = models.IntegerField(default=67, null=True)

    def __str__(self):
        return self.name + " #" + str(self.id)

class Equipment(models.Model):
    name = models.CharField(max_length=100)
    trub_loss = models.DecimalField(default=1.9, max_digits=3, decimal_places=1, null=True)
    equipment_loss = models.DecimalField(default=0.4, max_digits=3, decimal_places=1, null=True)
    mash_thickness = models.DecimalField(default=2.61, max_digits=3, decimal_places=2, null=True)
    wort_shrinkage = models.IntegerField(default=4, null=True)
    grain_absorption = models.DecimalField(default=1.08, max_digits=3, decimal_places=2, null=True)
    percent_boiloff = models.IntegerField(default=7, null=True)
    evaporation_factor = models.DecimalField(default=0.95, max_digits=3, decimal_places=2, null=True)

    def __str__(self):
        return self.name

class Malt(models.Model):
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    recipe = models.ForeignKey(Recipe, related_name='malts')
    #inventory = models.ForeignKey(apps.inventory.models.Malt, related_name='uses')

    def __str__(self):
        return str(self.entry) + ", " + self.name

class Hop(models.Model):
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=4, decimal_places=1)
    add = models.IntegerField()
    recipe = models.ForeignKey(Recipe, related_name='hops')

    def __str__(self):
        return self.entry + ", " + self.name + ", " + self.amount

class Brew(models.Model):
    date = models.DateTimeField(default=django.utils.timezone.now)
    recipe = models.ForeignKey(Recipe, related_name='brews')
    fermentation_temperature = models.IntegerField(null=True)
    fermentation_time = models.IntegerField(null=True)
    og = models.DecimalField(max_digits=4, decimal_places=3, null=True)
    fg = models.DecimalField(max_digits=4, decimal_places=3, null=True)
    rating = models.IntegerField(default=0)

    def __str__(self):
        return str(self.recipe)

class Log(models.Model):
    start = models.TimeField()
    end = models.TimeField()
    description = models.CharField(max_length=200)
    brew = models.ForeignKey(Brew, related_name='logs')

    def __str__(self):
        return self.description

class Comment(models.Model):
    date = models.DateTimeField()
    comment = models.CharField(max_length=1000)
    brew = models.ForeignKey(Brew, related_name='comments')

    def __str__(self):
        return self.comment
