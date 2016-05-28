from rest_framework import serializers

from .models import *

class MaltSerializer(serializers.ModelSerializer):

    class Meta:
        model = Malt
        fields = ('id', 'name', 'amount')

class HopSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hop
        fields = ('id', 'name', 'amount')
