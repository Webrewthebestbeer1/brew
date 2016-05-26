from django.contrib import admin

from .models import Recipe, Malt, Hop, Brew, Log, Comment, Equipment

admin.site.register(Recipe)
admin.site.register(Malt)
admin.site.register(Hop)
admin.site.register(Brew)
admin.site.register(Log)
admin.site.register(Comment)
admin.site.register(Equipment)
