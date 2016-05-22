from django.conf.urls import patterns, url, include

from .api import *

entry_urls = patterns('',
    url(r'^/(?P<id>[0-9]+)/comments$', EntryCommentList.as_view(), name='entrycomment-list'),
    url(r'^/(?P<id>[0-9]+)/logs$', EntryLogList.as_view(), name='entrylog-list'),
    url(r'^/(?P<id>[0-9]+)/hops$', EntryHopList.as_view(), name='entryhop-list'),
    url(r'^/(?P<id>[0-9]+)/malts$', EntryMaltList.as_view(), name='entrymalt-list'),
    url(r'^/update/(?P<pk>[0-9]+)$', EntryUpdate.as_view(), name='entry-update'),
    url(r'^/(?P<id>[0-9]+)$', EntryDetail.as_view(), name='entry-detail'),
    url(r'^$', EntryList.as_view(), name='entry-list')
)

hop_urls = patterns('',
    url(r'^/delete/(?P<pk>[0-9]+)$', HopDestroy.as_view(), name='hop-destroy'),
)

malt_urls = patterns('',
    url(r'^/delete/(?P<pk>[0-9]+)$', MaltDestroy.as_view(), name='malt-destroy'),
)

log_urls = patterns('',
    url(r'^/delete/(?P<pk>[0-9]+)$', LogDestroy.as_view(), name='log-destroy'),
)

comment_urls = patterns('',
    url(r'^/delete/(?P<pk>[0-9]+)$', CommentDestroy.as_view(), name='comment-destroy'),
    url(r'^/update/(?P<pk>[0-9]+)$', CommentUpdate.as_view(), name='comment-update'),
)

urlpatterns = patterns('',
    url(r'^entries', include(entry_urls)),
    url(r'^hops', include(hop_urls)),
    url(r'^malts', include(malt_urls)),
    url(r'^logs', include(log_urls)),
    url(r'^comments', include(comment_urls)),
)
