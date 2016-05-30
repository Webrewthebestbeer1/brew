from django.conf.urls import patterns, url, include
from rest_framework_proxy.views import ProxyView

from .views import *


urlpatterns = [
    url(r'^get_sensor_readings', ProxyView.as_view(source='get_sensor_readings'), name='sensor-readings'),
    url(r'^$', ferment, name='ferment'),
]
