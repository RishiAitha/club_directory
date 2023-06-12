from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("approved", views.approved_clubs, name="approved"),
    path("pending", views.pending_clubs, name="pending"),
    path("messages/<int:clubID>", views.messages, name="messages"),
    #path("create", views.create_club, name="create"),
    path("edit", views.edit_club, name="edit"),
]