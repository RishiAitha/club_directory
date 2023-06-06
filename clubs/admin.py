from django.contrib import admin
from .models import User, Club, Message

# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "username", "isAdmin")

class ClubAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "interestCount", "creator")
    filter_horizontal = ("editors", "messages")

class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "poster", "timestamp")

admin.site.register(User, UserAdmin)
admin.site.register(Club, ClubAdmin)
admin.site.register(Message, MessageAdmin)