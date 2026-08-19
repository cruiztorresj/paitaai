from django.http import JsonResponse
from django.shortcuts import redirect
from django.shortcuts import render

from .engine import Engine

import httpx

def index(request):
    return render(request, "emosongi/index.html")

def recommend(request):
    emojid = None
    if request.method == 'POST':
        emojid = request.POST.get('my-emotion')
    else:
        return redirect("emosongi:index")
    if emojid is None:
        return redirect("emosongi:index")

    feeling = Engine.get_associated_feeling(emojid)

    response = JsonResponse({})

    try:
        response = JsonResponse(Engine.get_song(feeling))
        return response

    except httpx.HTTPStatusError as e:
        match e.response.status_code:
            case 401:
                response.status_code = 401
            case 429:
                response.status_code = 429
            case _:
                response.status_code = 500
        return response
