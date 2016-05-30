from django.conf.urls import url, include
from django.contrib import admin, auth
from django.contrib.auth.views import logout
from .views import *

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/recipe/', include('apps.recipe.urls')),
    url(r'^recipe/', include('apps.recipe.urls')),
    url(r'^api/inventory/', include('apps.inventory.urls')),
    url(r'^inventory/', include('apps.inventory.urls')),
    url(r'^api/ferment/', include('apps.ferment.urls')),
    url(r'^ferment/', include('apps.ferment.urls')),
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
