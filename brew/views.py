from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponse, HttpResponseBadRequest
from django.contrib.auth import login as auth_login
import json
from django.shortcuts import render


@sensitive_post_parameters()
@csrf_protect
@never_cache
def login(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if (form.is_valid()):
            auth_login(request, form.get_user())
            return HttpResponse(
                json.dumps({"redirect": "/"}),
                content_type="application/json"
            )
        else:
            return HttpResponseBadRequest(
                json.dumps(form.errors),
                content_type="application/json"
            )

    return render(request, 'login.html')
