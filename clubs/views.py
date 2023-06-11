from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, "clubs/index.html")

def login_view(request):
    return render(request, "clubs/login.html")

def logout_view(request):
    return render(request, "clubs/login.html")

def register(request):
    return render(request, "clubs/register.html")