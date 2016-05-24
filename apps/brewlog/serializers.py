from rest_framework import serializers

from .models import Recipe, Malt, Hop, Brew, Log, Comment

from pprint import pprint

class MaltSerializer(serializers.ModelSerializer):

    class Meta:
        model = Malt
        fields = ('id', 'name', 'amount')

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        recipe_id = self.context['request'].parser_context['kwargs'].get('id')
        recipe = Recipe.objects.filter(id=recipe_id).first()
        malt = Malt.objects.create(**validated_data, recipe=recipe)
        return malt

class HopSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hop
        fields = ('id', 'name', 'amount', 'add')

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        recipe_id = self.context['request'].parser_context['kwargs'].get('id')
        recipe = Recipe.objects.filter(id=recipe_id).first()
        hop = Hop.objects.create(**validated_data, recipe=recipe)
        return hop

class LogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Log
        fields = ('id', 'start', 'end', 'description')

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        brew_id = self.context['request'].parser_context['kwargs'].get('id')
        brew = Brew.objects.filter(id=brew_id).first()
        log = Log.objects.create(**validated_data, brew=brew)
        return log

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('id', 'date', 'comment')

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        brew_id = self.context['request'].parser_context['kwargs'].get('id')
        brew = Brew.objects.filter(id=brew_id).first()
        comment = Comment.objects.create(**validated_data, brew=brew)
        return comment

class BrewSerializer(serializers.ModelSerializer):

    logs = LogSerializer(
        many=True,
    )

    comments = CommentSerializer(
        many=True,
    )

    class Meta:
        model = Brew
        fields = (
            'id',
            'date',
            'fermentation_temperature',
            'fermentation_time',
            'og',
            'fg',
            'logs',
            'comments',
        )

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        validated_data.pop('logs')
        validated_data.pop('comments')
        recipe_id = self.context['request'].parser_context['kwargs'].get('id')
        recipe = Recipe.objects.filter(id=recipe_id).first()
        brew = Brew.objects.create(**validated_data, recipe=recipe)
        return brew

class BrewUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brew

class RecipeSerializer(serializers.ModelSerializer):

    malts = MaltSerializer(
        many=True,
    )

    hops = HopSerializer(
        many=True,
    )

    brews = BrewSerializer(
        many=True,
    )

    class Meta:
        model = Recipe
        fields = (
            'id',
            'name',
            'yeast',
            'mash_time',
            'sparge_time',
            'date',
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
            'brews',
        )

    def create(self, validated_data):
        malts_data = validated_data.pop('malts')
        hops_data = validated_data.pop('hops')
        brews_data = validated_data.pop('brews')
        recipe = Recipe.objects.create(**validated_data)
        return recipe

class RecipeUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Recipe
