from django.conf.urls import patterns, url, include

from .api import *

recipe_urls = patterns('',
    url(r'^/(?P<id>[0-9]+)/hops$', RecipeHopList.as_view(), name='recipehop-list'),
    url(r'^/(?P<id>[0-9]+)/malts$', RecipeMaltList.as_view(), name='recipemalt-list'),
    url(r'^/(?P<id>[0-9]+)/brews$', RecipeBrewList.as_view(), name='recipebrew-list'),
    url(r'^/update/(?P<pk>[0-9]+)$', RecipeUpdate.as_view(), name='recipe-update'),
    url(r'^/(?P<id>[0-9]+)$', RecipeDetail.as_view(), name='recipe-detail'),
    url(r'^$', RecipeList.as_view(), name='recipe-list')
)

hop_urls = patterns('',
    url(r'^/delete/(?P<pk>[0-9]+)$', HopDestroy.as_view(), name='hop-destroy'),
)

malt_urls = patterns('',
    url(r'^/delete/(?P<pk>[0-9]+)$', MaltDestroy.as_view(), name='malt-destroy'),
)

brew_urls = patterns('',
    url(r'^/update/(?P<pk>[0-9]+)$', BrewUpdate.as_view(), name='brew-update'),
    url(r'^/delete/(?P<pk>[0-9]+)$', BrewDestroy.as_view(), name='brew-destroy'),
    url(r'^/(?P<id>[0-9]+)/logs$', BrewLogList.as_view(), name='brewlog-list'),
    url(r'^/(?P<id>[0-9]+)/comments$', BrewCommentList.as_view(), name='brewcomment-list'),
)

log_urls = patterns('',
    url(r'^/delete/(?P<pk>[0-9]+)$', LogDestroy.as_view(), name='log-destroy'),
)

comment_urls = patterns('',
    url(r'^/delete/(?P<pk>[0-9]+)$', CommentDestroy.as_view(), name='comment-destroy'),
    url(r'^/update/(?P<pk>[0-9]+)$', CommentUpdate.as_view(), name='comment-update'),
)

equipment_urls = patterns('',
    url(r'^$', EquipmentList.as_view(), name='equipment-list'),
)

urlpatterns = patterns('',
    url(r'^recipes', include(recipe_urls)),
    url(r'^hops', include(hop_urls)),
    url(r'^malts', include(malt_urls)),
    url(r'^brews', include(brew_urls)),
    url(r'^logs', include(log_urls)),
    url(r'^comments', include(comment_urls)),
    url(r'^equipment', include(equipment_urls)),
)
