from rest_framework import generics
from rest_framework.response import Response

from .serializers import *
from .models import *

class MaltList(generics.ListCreateAPIView):
    model = Malt
    queryset = Malt.objects.all()
    serializer_class = MaltSerializer

class HopList(generics.ListCreateAPIView):
    model = Hop
    queryset = Hop.objects.all()
    serializer_class = HopSerializer

class MaltUpdate(generics.UpdateAPIView):
    model = Malt
    serializer_class = MaltSerializer
    queryset = Malt.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = MaltSerializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class HopUpdate(generics.UpdateAPIView):
    model = Hop
    serializer_class = HopSerializer
    queryset = Hop.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = HopSerializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
