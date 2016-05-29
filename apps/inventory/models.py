from django.db import models

class Hop(models.Model):
    name = models.CharField(max_length=200)
    amount = models.DecimalField(default=0.0, max_digits=5, decimal_places=1)

    def __str__(self):
        return self.name

class Malt(models.Model):
    name = models.CharField(max_length=200)
    amount = models.IntegerField()

    def __str__(self):
        return self.name
