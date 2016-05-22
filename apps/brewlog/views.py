from django.shortcuts import render


def logs(request):
    return render(request, 'logs.html')
def log(request):
    return render(request, 'log.html')
