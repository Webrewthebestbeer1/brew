from django.contrib import admin

from .models import Entry, Malt, Hop, Log, Comment

admin.site.register(Entry)
admin.site.register(Malt)
admin.site.register(Hop)
admin.site.register(Log)
admin.site.register(Comment)
