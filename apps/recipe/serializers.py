from rest_framework import serializers, pagination

from .models import Recipe, Malt, Hop, Brew, Log, Comment, Equipment
from apps.inventory.models import Malt as InventoryMalt
from apps.inventory.models import Hop as InventoryHop

from pprint import pprint

class InventoryMaltSerializer(serializers.ModelSerializer):

    id = serializers.ModelField(model_field=InventoryMalt()._meta.get_field('id'))
    name = serializers.CharField(read_only=False)

    class Meta:
        model = InventoryMalt
        fields = ('id', 'name', 'amount')

class InventoryHopSerializer(serializers.ModelSerializer):

    id = serializers.ModelField(model_field=InventoryHop()._meta.get_field('id'))
    name = serializers.CharField(read_only=False)

    class Meta:
        model = InventoryHop
        fields = ('id', 'name', 'amount')

class MaltSerializer(serializers.ModelSerializer):

    inventory = InventoryMaltSerializer(
        many=False
    )

    class Meta:
        model = Malt
        fields = ('id', 'inventory', 'amount')

    # why do we need this, you might wonder....
    def to_internal_value(self, data):
        return super(MaltSerializer, self).to_internal_value(data)

    def create(self, validated_data):
        print(validated_data)
        # there must be a better way to set the foreign key...
        recipe_id = self.context['request'].parser_context['kwargs'].get('id')
        recipe = Recipe.objects.filter(id=recipe_id).first()
        inventory_id = validated_data.pop('inventory')['id']
        inventory = InventoryMalt.objects.filter(id=inventory_id).first()
        print("creating malt")
        malt = Malt.objects.create(recipe=recipe, inventory=inventory, **validated_data)
        return malt

class HopSerializer(serializers.ModelSerializer):

    inventory = InventoryHopSerializer(
        many=False
    )

    class Meta:
        model = Hop
        fields = ('id', 'inventory', 'amount', 'add')

    # why do we need this, you might wonder....
    def to_internal_value(self, data):
        return super(HopSerializer, self).to_internal_value(data)

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        recipe_id = self.context['request'].parser_context['kwargs'].get('id')
        recipe = Recipe.objects.filter(id=recipe_id).first()
        inventory_id = validated_data.pop('inventory')['id']
        inventory = InventoryHop.objects.filter(id=inventory_id).first()
        hop = Hop.objects.create(recipe=recipe, inventory=inventory, **validated_data)
        return hop

class LogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Log
        fields = ('id', 'start', 'end', 'description')

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        brew_id = self.context['request'].parser_context['kwargs'].get('id')
        brew = Brew.objects.filter(id=brew_id).first()
        log = Log.objects.create(brew=brew, **validated_data)
        return log

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('id', 'date', 'comment')

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        brew_id = self.context['request'].parser_context['kwargs'].get('id')
        brew = Brew.objects.filter(id=brew_id).first()
        comment = Comment.objects.create(brew=brew, **validated_data)
        return comment

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        field = (
            'id',
            'name',
            'trub_loss',
            'equipment_loss',
            'mash_thickness',
            'wort_shrinkage',
            'grain_absorption',
            'percent_boiloff',
            'evaporation_factor',
        )

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
            'rating',
            'completed',
            'logs',
            'comments',
        )

    def create(self, validated_data):
        # there must be a better way to set the foreign key...
        validated_data.pop('logs')
        validated_data.pop('comments')
        recipe_id = self.context['request'].parser_context['kwargs'].get('id')
        recipe = Recipe.objects.filter(id=recipe_id).first()
        brew = Brew.objects.create(recipe=recipe, **validated_data)
        return brew

    """
    def get_paginated_response(self, data):
        print(obj)
        brews = Brew.objects.all()[:2]
        serializer = BrewSerializer(
            brews,
            many=True,
            context={'request': self.context['request']}
        )
        return serializer.data
    """

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

    """
    brews = BrewSerializer(
        many=True,
    )
    """

    brews = serializers.SerializerMethodField('paginated_brews')

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
            'boil_time',
            'mash_temperature',
            'malts',
            'hops',
            'brews',
        )

    def paginated_brews(self, data):
        brews = Brew.objects.filter(recipe=data)
        paginator = pagination.PageNumberPagination()
        page = paginator.paginate_queryset(brews, self.context['request'])
        serializer = BrewSerializer(page, many=True, context={'request': self.context['request']})
        return serializer.data

    def create(self, validated_data):
        malts_data = validated_data.pop('malts')
        hops_data = validated_data.pop('hops')
        #brews_data = validated_data.pop('brews')
        recipe = Recipe.objects.create(**validated_data)
        return recipe

class RecipeUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Recipe

class BrewGenericSerializer(serializers.ModelSerializer):

    recipe = RecipeUpdateSerializer(
        many=False
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
            'rating',
            'completed',
            'logs',
            'comments',
            'recipe',
        )
