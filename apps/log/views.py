from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from .models import Recipe


@login_required
def logs(request):
    return render(request, 'logs.html')

@login_required
def log(request):
    recipe_id = request.GET.get('id', None)
    recipe = Recipe.objects.filter(id=recipe_id).first()
    if not recipe:
        return render(request, 'logs.html')
    return render(request, 'log.html', {'title': recipe.name})
