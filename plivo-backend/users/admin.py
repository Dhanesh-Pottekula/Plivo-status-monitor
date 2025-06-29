from django.contrib import admin
from .models import User, InviteLink, Organization
from timeline.models import Timeline

# Register your models here.
admin.site.register(User)
admin.site.register(InviteLink)
admin.site.register(Organization)
admin.site.register(Timeline)
