from django.conf.urls import patterns, url, include
from rest_framework_proxy.views import ProxyView

from .views import *


urlpatterns = [
    url(r'^get_sensor_readings', ProxyView.as_view(source='get_sensor_readings'), name='sensor-readings'),
    url(r'^get_target_temp', ProxyView.as_view(source='get_target_temp'), name='get-target-temperature'),
    url(r'^set_target_temp', ProxyView.as_view(source='set_target_temp'), name='set-target-temperature'),
    url(r'^$', ferment, name='ferment'),
]
