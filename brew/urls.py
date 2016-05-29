from django.conf.urls import url, include
from django.contrib import admin, auth
from django.contrib.auth.views import logout
from apps.log.views import *
from .views import *

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/recipe/', include('apps.log.urls')),
    url(r'^recipe/', include('apps.log.urls')),
    url(r'^api/inventory/', include('apps.inventory.urls')),
    url(r'^inventory/', include('apps.inventory.urls')),
    url(r'^logs$', logs, name='ferment'),
    url(r'^$', index, name='index'),
    url(
        r'^login/$',
        login,
        name='login',
    ),
    url(
        r'^logout/$',
        logout,
        name='logout',
        kwargs={'next_page': '/login'}
    ),
]
