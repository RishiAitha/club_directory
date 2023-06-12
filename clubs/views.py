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

from .models import User, Club, Message

# Create your views here.

def index(request):
    return render(request, "clubs/index.html")

def login_view(request):
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

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
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
        except IntegrityError:
            return render(request, "clubs/register.html", {
                "message": "That username is already taken."
            })
        
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "clubs/register.html")
    
def approved_clubs(request):
    if request.method == "GET":
        clubs = Club.objects.filter(isApproved=True).order_by("title").all()
        return JsonResponse([club.serialize() for club in clubs], safe=False)
    else:
        return JsonResponse({"error": "GET request required for approved url"}, status=400)

def pending_clubs(request):
    if request.method == "GET":
        clubs = Club.objects.filter(isApproved=False).order_by("-timestamp").all()
        return JsonResponse([club.serialize() for club in clubs], safe=False)
    else:
        return JsonResponse({"error": "GET request required for pending url"}, status=400)

def messages(request, clubID):
    if request.method == "GET":
        club = None
        if Club.objects.filter(pk=clubID).exists():
            club = Club.objects.get(pk=clubID)
        else:
            return JsonResponse({"error": "Club does not exist"}, status=400)
        messages = Message.objects.filter(clubs=club)
        return JsonResponse([message.serialize() for message in messages], safe=False)
    else:
        return JsonResponse({"error": "GET request required for messages url"}, status=400)

@csrf_exempt
@login_required
def edit_club(request): # universal edit view
    if request.method == "PUT":
        data = json.loads(request.body)
        clubID = data.get("clubID", "")
        description = data.get("description", "")
        announcement = data.get("announcement", "")
        interestChange = data.get("interestChange", "")
        editorEmails = [email.strip() for email in data.get("editors").split(",")] # format in javascript
        isApproved = data.get("isApproved", "")

        club = None
        if Club.objects.filter(pk=clubID).exists():
            club = Club.objects.get(pk=clubID)
        else:
            return JsonResponse({"error": "Club does not exist"}, status=400)

        club.interestCount += interestChange
        club.save()
        if club.editors.contains(request.user) or request.user.isAdmin:
            club.description = description
            club.announcement = announcement
            newEditors = []
            for editorEmail in editorEmails:
                try:
                    user = User.objects.get(email=editorEmail)
                    newEditors.append(user)
                except User.DoesNotExist:
                    return JsonResponse({"error": f"User with email {editorEmail} does not exist"}, status=400)
            club.editors.clear()
            for editor in newEditors:
                club.editors.add(editor)
            club.save()
            
        
        if request.user.isAdmin:
            club.isApproved = isApproved
            club.save()
        
        club.save()
        return JsonResponse(club.serialize(), safe=False)
    else:
        return JsonResponse({"error": "PUT request required for edit url"}, status=400)