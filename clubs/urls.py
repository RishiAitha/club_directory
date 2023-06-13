from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("terms", views.terms, name="terms"),

    # API Routes
    path("approved", views.approved_clubs, name="approved"),
    path("pending", views.pending_clubs, name="pending"),
    path("club/<int:clubID>", views.get_club, name="club"),
    path("messages/<int:clubID>/<int:page>", views.messages, name="messages"),
    path("create", views.create_club, name="create"),
    path("edit/content", views.edit_content, name="editcontent"),
    path("edit/interest", views.edit_interest, name="editinterest"),
    path("edit/editors", views.edit_editors, name="editeditors"),
    path("edit/approval", views.edit_approval, name="editapproval"),
    path("post", views.post_message, name="post"),
]