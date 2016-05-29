from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from .models import Recipe


@login_required
def recipes(request):
    return render(request, 'recipes.html')

@login_required
def recipe(request):
    recipe_id = request.GET.get('id', None)
    recipe = Recipe.objects.filter(id=recipe_id).first()
    if not recipe:
        return recipes(request)
    return render(request, 'recipe.html', {'title': recipe.name})
