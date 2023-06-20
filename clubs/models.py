from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    isAdmin = models.BooleanField(default=False)
    
    def __str__(self):
        return f"USER{self.id} - {self.email} - {self.username}"
    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "isAdmin": self.isAdmin
        }

class Club(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField(blank=True)
    announcement = models.TextField(blank=True)
    # Image Field
    interestCount = models.IntegerField(default=0)
    editors = models.ManyToManyField("User", related_name="clubsEditing")
    creator = models.ForeignKey("User", on_delete=models.PROTECT, related_name="clubsCreated")
    messages = models.ManyToManyField("Message", related_name="clubs", blank=True)
    isApproved = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CLUB{self.id} - {self.title}"
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "announcement": self.announcement,
            # Image Field
            "interestCount": self.interestCount,
            "editors": [user.serialize() for user in self.editors.all()],
            "creator": self.creator.serialize(),
            "messages": [message.serialize() for message in self.messages.all()], # order by is not needed because of pagination API route
            "timestamp": self.timestamp.strftime("%b %d %Y, %I: %M %p"),
            "isApproved": self.isApproved
        }

class Message(models.Model):
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    poster = models.ForeignKey("User", on_delete=models.CASCADE, related_name="messagesPosted")
    replies = models.ManyToManyField("Reply", related_name="messages", blank=True)

    def __str__(self):
        return f"MESSAGE{self.id} - By: {self.poster}"
    
    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I: %M %p"),
            "poster": self.poster.serialize(),
            "replies": [reply.serialize() for reply in self.replies.order_by("-timestamp").all()] # order by is needed to avoid extra API route
        }
    
class Reply(models.Model):
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    poster = models.ForeignKey("User", on_delete=models.CASCADE, related_name="repliesPosted")

    def __str__(self):
        return f"REPLY{self.id} - By: {self.poster}"
    
    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I: %M %p"),
            "poster": self.poster.serialize()
        }