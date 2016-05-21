from django.conf.urls import patterns, url, include

from .api import *

entry_urls = patterns('',
    url(r'^/(?P<id>[0-9]+)/comments$', EntryCommentList.as_view(), name='entrycomment-list'),
    url(r'^/(?P<id>[0-9]+)/logs$', EntryLogList.as_view(), name='entrylog-list'),
    url(r'^/(?P<id>[0-9]+)/hops$', EntryHopList.as_view(), name='entryhop-list'),
    url(r'^/(?P<id>[0-9]+)/malts$', EntryMaltList.as_view(), name='entrymalt-list'),
    url(r'^/(?P<id>[0-9]+)$', EntryDetail.as_view(), name='entry-detail'),
    url(r'^$', EntryList.as_view(), name='entry-list')
)

urlpatterns = patterns('',
    url(r'^entries', include(entry_urls)),
)
