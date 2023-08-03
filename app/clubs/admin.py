from django.contrib import admin
from .models import User, Club, Message, Reply

# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "username", "isAdmin")

class ClubAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "interestCount", "creator", "image")
    filter_horizontal = ("interestedUsers", "editors", "messages")

class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "poster", "timestamp")
    filter_horizontal = ("replies",)

class ReplyAdmin(admin.ModelAdmin):
    list_display = ("id", "poster", "timestamp")

admin.site.register(User, UserAdmin)
admin.site.register(Club, ClubAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(Reply, ReplyAdmin)