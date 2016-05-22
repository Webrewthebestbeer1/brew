from rest_framework import generics, permissions
from rest_framework.response import Response

from .serializers import EntrySerializer, EntryUpdateSerializer, MaltSerializer, HopSerializer, LogSerializer, CommentSerializer
from .models import Entry, Malt, Hop, Log, Comment

class EntryList(generics.ListCreateAPIView):
    model = Entry
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [
        permissions.AllowAny
    ]

class EntryDetail(generics.RetrieveAPIView):
    model = Entry
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    lookup_field = 'id'

class EntryMaltList(generics.ListCreateAPIView):
    model = Malt
    serializer_class = MaltSerializer
    queryset = Malt.objects.all()

    def get_queryset(self):
        queryset = super(EntryMaltList, self).get_queryset()
        return queryset.filter(entry__id=self.kwargs.get('id'))


class EntryHopList(generics.ListCreateAPIView):
    model = Hop
    serializer_class = HopSerializer
    queryset = Hop.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        queryset = super(EntryHopList, self).get_queryset()
        return queryset.filter(entry__id=self.kwargs.get('id'))

class EntryLogList(generics.ListCreateAPIView):
    model = Log
    serializer_class = LogSerializer
    queryset = Log.objects.all()

    def get_queryset(self):
        queryset = super(EntryLogList, self).get_queryset()
        return queryset.filter(entry__id=self.kwargs.get('id'))

class EntryCommentList(generics.ListCreateAPIView):
    model = Comment
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def get_queryset(self):
        queryset = super(EntryCommentList, self).get_queryset()
        return queryset.filter(entry__id=self.kwargs.get('id'))

class EntryUpdate(generics.UpdateAPIView):
    model = Entry
    serializer_class = EntryUpdateSerializer
    queryset = Entry.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = EntryUpdateSerializer(
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

class HopDestroy(generics.DestroyAPIView):
    model = Hop
    serializer_class = HopSerializer
    queryset = Hop.objects.all()

class MaltDestroy(generics.DestroyAPIView):
    model = Malt
    serializer_class = MaltSerializer
    queryset = Malt.objects.all()

class LogDestroy(generics.DestroyAPIView):
    model = Log
    serializer_class = LogSerializer
    queryset = Log.objects.all()

class CommentDestroy(generics.DestroyAPIView):
    model = Comment
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
