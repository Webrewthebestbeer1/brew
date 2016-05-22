from rest_framework import serializers

from .models import Entry, Malt, Hop, Log, Comment

from pprint import pprint

class MaltSerializer(serializers.ModelSerializer):

    class Meta:
        model = Malt
        fields = ('id', 'name', 'amount')

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        entry_id = self.context['request'].parser_context['kwargs'].get('id')
        entry = Entry.objects.filter(id=entry_id).first()
        malt = Malt.objects.create(**validated_data, entry=entry)
        return malt

class HopSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hop
        fields = ('id', 'name', 'amount', 'add')

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        entry_id = self.context['request'].parser_context['kwargs'].get('id')
        entry = Entry.objects.filter(id=entry_id).first()
        hop = Hop.objects.create(**validated_data, entry=entry)
        return hop

class LogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Log
        fields = ('id', 'start', 'end', 'description')

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        entry_id = self.context['request'].parser_context['kwargs'].get('id')
        entry = Entry.objects.filter(id=entry_id).first()
        log = Log.objects.create(**validated_data, entry=entry)
        return log

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('id', 'date', 'comment')

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        entry_id = self.context['request'].parser_context['kwargs'].get('id')
        entry = Entry.objects.filter(id=entry_id).first()
        comment = Comment.objects.create(**validated_data, entry=entry)
        return comment

class EntrySerializer(serializers.ModelSerializer):

    malts = MaltSerializer(
        many=True,
    )

    hops = HopSerializer(
        many=True,
    )

    logs = LogSerializer(
        many=True,
    )

    comments = CommentSerializer(
        many=True,
    )

    class Meta:
        model = Entry
        fields = (
            'id',
            'name',
            'yeast',
            'mash_time',
            'sparge_time',
            'fermentation_temperature',
            'fermentation_time',
            'og',
            'fg',
            #'date',
            'batch_size',
            'grain_bill',
            'boil_time',
            'mash_temperature',
            'trub_loss',
            'equipment_loss',
            'mash_thickness',
            'grain_temperature',
            'wort_shrinkage',
            'grain_absorption',
            'percent_boiloff',
            'evaporation_factor',
            'malts',
            'hops',
            'logs',
            'comments',
        )

    def create(self, validated_data):
        malts_data = validated_data.pop('malts')
        hops_data = validated_data.pop('hops')
        logs_data = validated_data.pop('logs')
        comments_data = validated_data.pop('comments')
        entry = Entry.objects.create(**validated_data)
        return entry

class EntryUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Entry
