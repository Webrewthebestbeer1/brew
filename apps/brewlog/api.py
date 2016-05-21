from rest_framework import generics, permissions

from .serializers import EntrySerializer, MaltSerializer, HopSerializer, LogSerializer, CommentSerializer
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
