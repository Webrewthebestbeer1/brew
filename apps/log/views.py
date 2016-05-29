from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def logs(request):
    return render(request, 'logs.html')

@login_required
def log(request):
    return render(request, 'log.html')

@login_required
def index(request):
    return render(request, 'index.html')
