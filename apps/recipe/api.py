from rest_framework import generics, permissions
from rest_framework.response import Response

from .serializers import *
from .models import *

class RecipeList(generics.ListCreateAPIView):
    model = Recipe
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class RecipeDetail(generics.RetrieveAPIView):
    model = Recipe
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    lookup_field = 'id'

class RecipeMaltList(generics.ListCreateAPIView):
    model = Malt
    serializer_class = MaltSerializer
    queryset = Malt.objects.all()

    def get_queryset(self):
        queryset = super(RecipeMaltList, self).get_queryset()
        return queryset.filter(recipe__id=self.kwargs.get('id'))

class RecipeHopList(generics.ListCreateAPIView):
    model = Hop
    serializer_class = HopSerializer
    queryset = Hop.objects.all()

    def get_queryset(self):
        queryset = super(RecipeHopList, self).get_queryset()
        return queryset.filter(recipe__id=self.kwargs.get('id'))

class RecipeBrewList(generics.ListCreateAPIView):
    model = Brew
    serializer_class = BrewSerializer
    queryset = Brew.objects.all()

    def get_queryset(self):
        queryset = super(RecipeBrewList, self).get_queryset()
        return queryset.filter(recipe__id=self.kwargs.get('id'))

class OngoingBrewList(generics.ListAPIView):
    model = Brew
    serializer_class = BrewGenericSerializer
    queryset = Brew.objects.filter(completed=False)

class LatestBrewList(generics.ListAPIView):
    model = Brew
    serializer_class = BrewGenericSerializer
    queryset = Brew.objects.filter(completed=True).order_by('-date')[:5]

class BrewLogList(generics.ListCreateAPIView):
    model = Log
    serializer_class = LogSerializer
    queryset = Log.objects.all()

    def get_queryset(self):
        queryset = super(BrewLogList, self).get_queryset()
        return queryset.filter(brew__id=self.kwargs.get('id'))

class BrewCommentList(generics.ListCreateAPIView):
    model = Comment
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def get_queryset(self):
        queryset = super(BrewCommentList, self).get_queryset()
        return queryset.filter(brew__id=self.kwargs.get('id'))

class RecipeUpdate(generics.UpdateAPIView):
    model = Recipe
    serializer_class = RecipeUpdateSerializer
    queryset = Recipe.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = RecipeUpdateSerializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class BrewUpdate(generics.UpdateAPIView):
    model = Brew
    serializer_class = BrewUpdateSerializer
    queryset = Brew.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = BrewUpdateSerializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class CommentUpdate(generics.UpdateAPIView):
    model = Comment
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = CommentSerializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class EquipmentUpdate(generics.UpdateAPIView):
    model = Equipment
    serializer_class = EquipmentSerializer
    queryset = Equipment.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = EquipmentSerializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class HopDestroy(generics.DestroyAPIView):
    model = Hop
    serializer_class = HopSerializer
    queryset = Hop.objects.all()

class MaltDestroy(generics.DestroyAPIView):
    model = Malt
    serializer_class = MaltSerializer
    queryset = Malt.objects.all()

class BrewDestroy(generics.DestroyAPIView):
    model = Brew
    serializer_class = BrewSerializer
    queryset = Brew.objects.all()

class LogDestroy(generics.DestroyAPIView):
    model = Log
    serializer_class = LogSerializer
    queryset = Log.objects.all()

class CommentDestroy(generics.DestroyAPIView):
    model = Comment
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

class EquipmentList(generics.ListCreateAPIView):
    model = Equipment
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
