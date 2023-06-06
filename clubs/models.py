from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser): # Username is used for login and message board, email is used for managing club editing
    isAdmin = models.BooleanField(default=False)
    
    def __str__(self):
        return f"USER{self.id} - {self.email} - {self.username}"
    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "isAdmin": self.isAdmin,
        }

class Club(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField(blank=True)
    # Image Field
    announcement = models.TextField(blank=True)
    interestCount = models.IntegerField(default=0)
    editors = models.ManyToManyField("User", related_name="clubsEditing")
    creator = models.ForeignKey("User", on_delete=models.PROTECT, related_name="clubsCreated")
    messages = models.ManyToManyField("Message", related_name="clubs")

    def __str__(self):
        return f"CLUB{self.id} - {self.title}"
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            # Image Field
            "announcement": self.announcement,
            "interestCount": self.interestCount,
            "editors": [user.email for user in self.editors.all()],
            "creator": self.creator.email,
            "messages": [message.id for message in self.messages.all()],
        }

class Message(models.Model):
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    poster = models.ForeignKey("User", on_delete=models.CASCADE, related_name="messagesPosted")

    def __str__(self):
        return f"MESSAGE{self.id} - By: {self.poster}"
    
    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I: %M %p"),
            "poster": self.poster.username,
        }