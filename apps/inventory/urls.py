from django.conf.urls import patterns, url, include

from .api import *
from .views import *

hop_urls = [
    url(r'^$', HopList.as_view(), name='hop-list'),
    url(r'^update/(?P<pk>[0-9]+)$', HopUpdate.as_view(), name='hop-update'),
]

malt_urls = [
    url(r'^$', MaltList.as_view(), name='malt-list'),
    url(r'^update/(?P<pk>[0-9]+)$', MaltUpdate.as_view(), name='malt-update'),
]

urlpatterns = [
    url(r'^malts/', include(malt_urls)),
    url(r'^hops/', include(hop_urls)),
    url(r'^$', inventory, name='inventory'),
]
