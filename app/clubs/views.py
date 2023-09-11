import json
from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError

from .models import User, Club, Message, Reply

# Create your views here.

def index(request): # links to main page
    return render(request, "clubs/index.html")

def login_view(request): # authenticates user
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password = password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "clubs/login.html", {
                "message": "Invalid username and/or password given."
            })
    else:
        return render(request, "clubs/login.html")

def logout_view(request): # logs user out
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request): # registers new account based on given info
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "clubs/register.html", {
                "message": "The password and confirmation must match."
            })
        
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError: # username must be unique
            return render(request, "clubs/register.html", {
                "message": "That username is already taken."
            })
        
        login(request, user) # logs user in after account creation
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "clubs/register.html")

def approved_clubs(request): # returns info of all approved clubs in alphabetical order
    if request.method == "GET":
        clubs = Club.objects.filter(isApproved=True).order_by("title").all()
        return JsonResponse([club.serialize() for club in clubs], safe=False)
    else:
        return JsonResponse({"error": "GET request required for approved url"}, status=400)

def pending_clubs(request): # returns info of all pending clubs in reverse chronological order
    if request.method == "GET":
        clubs = Club.objects.filter(isApproved=False).order_by("-timestamp").all()
        return JsonResponse([club.serialize() for club in clubs], safe=False)
    else:
        return JsonResponse({"error": "GET request required for pending url"}, status=400)

def get_club(request, clubID): # returns info of specified club, if it exists
    if request.method == "GET":
        club = None
        if Club.objects.filter(pk=clubID).exists():
            club = Club.objects.get(pk=clubID)
            return JsonResponse(club.serialize(), safe=False)
        else:
            return JsonResponse({"error": "Club does not exist"}, status=400)

def messages(request, clubID, page): # returns info of a specified page of messages on a specified club using Pagination
    if request.method == "GET":
        club = None
        if Club.objects.filter(pk=clubID).exists():
            club = Club.objects.get(pk=clubID)
        else:
            return JsonResponse({"error": "Club does not exist"}, status=400)
        
        messages = Message.objects.filter(clubs=club).order_by("-timestamp").all()
        paginator = Paginator(messages, 10) # separate messages into pages

        if (page < 1): # return amount of pages
            return JsonResponse({"pageCount": paginator.num_pages}, status=200)
        
        pageObj = paginator.get_page(page) # only return messages of specified page

        return JsonResponse([message.serialize() for message in pageObj], safe=False)
    else:
        return JsonResponse({"error": "GET request required for messages url"}, status=400)

@csrf_exempt
@login_required
def create_club(request): # creates new club request that is still pending based on info given
    if request.method == "POST":
        title = request.POST.get("title", "")
        description = request.POST.get("description", "")
        announcement = request.POST.get("announcement", "")
        formLink = request.POST.get("formLink", "")
        creator = request.user

        imageFile = request.FILES.get("image")
        
        club = Club(title=title, description=description, announcement=announcement, formLink=formLink, creator=creator)
        club.save()
        club.editors.add(creator)
        club.save()

        if imageFile:
            club.image = imageFile
            club.save()

        return JsonResponse(club.serialize(), safe=False)
    else:
        return JsonResponse({"error": "POST request required for create url"}, status=400)

@csrf_exempt
@login_required
def edit_content(request): # edit description, announcement, and image of a club
    # due to constraints with image uploads, FormData API is necessary for the request
    # when using FormData information is sent to Django differently than normal
    # this causes an incompatibility due to lack of support for PUT and PATCH requests
    # so a POST request is needed for this editing method
    if request.method == "POST":
        clubID = request.POST.get("clubID", "")
        description = request.POST.get("description", "")
        announcement = request.POST.get("announcement", "")
        formLink = request.POST.get("formLink", "")
        noImage = request.POST.get("noImage", "").lower()
        
        imageFile = request.FILES.get("image")

        club = None
        if Club.objects.filter(pk=clubID).exists():
            club = Club.objects.get(pk=clubID)
        else:
            return JsonResponse({"error": "Club does not exist"}, status=400)

        if club.editors.contains(request.user) or request.user.isAdmin: # checks if user is an editor or admin
            club.description = description
            club.announcement = announcement
            club.formLink = formLink
            club.save()

            if noImage == "true":
                # club page should have no image at all
                club.image = None
                club.save()
            else:
                # club page can have an image
                if imageFile:
                    club.image = imageFile
                    club.save()

            return JsonResponse(club.serialize(), safe=False)
        else:
            return JsonResponse({"error": "Current user is not authorized to change club content"})
    else:
        return JsonResponse({"error": "POST request required for edit/content url"}, status=400)

@csrf_exempt
@login_required
def edit_interest(request): # edit interest status of current user on a club
    if request.method == "PATCH":
        data = json.loads(request.body)
        clubID = data.get("clubID", "")
        user = request.user

        club = None
        if Club.objects.filter(pk=clubID).exists():
            club = Club.objects.get(pk=clubID)
        else:
            return JsonResponse({"error": "Club does not exist"}, status=400)
        
        if club.interestedUsers.contains(user):
            # already interested
            club.interestedUsers.remove(user)
            club.interestCount = club.interestedUsers.all().count()
            club.save()
        else:
            # not interested yet
            club.interestedUsers.add(user)
            club.interestCount = club.interestedUsers.all().count()
            club.save()
        
        return JsonResponse(club.serialize(), safe=False)
    else:
        return JsonResponse({"error": "PATCH request required for edit/interest url"}, status=400)

@csrf_exempt
@login_required
def edit_editors(request): # edit authorized editor accounts of a club
    if request.method == "PATCH":
        data = json.loads(request.body)
        clubID = data.get("clubID", "")
        editorEmail = data.get("editorEmail", "")

        club = None
        if Club.objects.filter(pk=clubID).exists():
            club = Club.objects.get(pk=clubID)
        else:
            return JsonResponse({"error": "Club does not exist"}, status=400)
        
        if club.editors.contains(request.user) or request.user.isAdmin: # checks if user is already an editor or an admin
            try:
                editor = User.objects.get(email=editorEmail)
            except User.DoesNotExist:
                return JsonResponse({"error": f"User with email {editorEmail} does not exist"}, status=400)

            if club.editors.contains(editor):
                # removing existing editor
                club.editors.remove(editor)
            else:
                # adding new editor
                club.editors.add(editor)

            return JsonResponse(club.serialize(), safe=False)
        else:
            return JsonResponse({"error": "Current user is not authorized to change editors"}, status=400)
    else:
        return JsonResponse({"error": "PATCH request required for edit/editors url"}, status=400)

@csrf_exempt
@login_required
def edit_approval(request): # add or remove approval of a club page
    if request.method == "PATCH":
        data = json.loads(request.body)
        clubID = data.get("clubID", "")
        approval = data.get("approval", "")

        club = None
        if Club.objects.filter(pk=clubID).exists():
            club = Club.objects.get(pk=clubID)
        else:
            return JsonResponse({"error": "Club does not exist"}, status=400)
        
        if request.user.isAdmin: # checks if user is allowed to approve clubs
            club.isApproved = approval
            club.save()

            return JsonResponse(club.serialize(), safe=False)
        else:
            return JsonResponse({"error": "Current user is not authorized to approve club"}, status=400)
    else:
        return JsonResponse({"error": "PATCH request required for edit/approval url"}, status=400)

@csrf_exempt
@login_required
def post_message(request): # create new message based on info given
    if request.method == "POST":
        data = json.loads(request.body)
        clubID = data.get("clubID", "")
        content = data.get("content", "")

        club = None
        if Club.objects.filter(pk=clubID).exists():
            club = Club.objects.get(pk=clubID)
        else:
            return JsonResponse({"error": "Club does not exist"}, status=400)

        message = Message(content=content, poster=request.user)
        message.save()
        club.messages.add(message)
        club.save()
        return JsonResponse(message.serialize(), safe=False)
    else:
        return JsonResponse({"error": "POST request required for post url"}, status=400)

@csrf_exempt
@login_required
def post_reply(request): # create new reply to specified message
    if request.method == "POST":
        data = json.loads(request.body)
        messageID = data.get("messageID", "")
        content = data.get("content", "")

        message = None
        if Message.objects.filter(pk=messageID).exists():
            message = Message.objects.get(pk=messageID)
        else:
            return JsonResponse({"error": "Message does not exist"}, status=400)
        
        reply = Reply(content=content, poster=request.user)
        reply.save()
        message.replies.add(reply)
        message.save()
        return JsonResponse(reply.serialize(), safe=False)
    else:
        return JsonResponse({"error": "POST request required for reply url"}, status=400)