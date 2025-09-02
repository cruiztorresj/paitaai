from django.shortcuts import redirect
from django.shortcuts import render

from .engine import Engine

def index(request):
    return render(request, "emosongi/index.html")

def recommend(request):
    emojid = None
    if request.method == 'POST':
        emojid = request.POST.get('my_emotion')
    else:
        return redirect("emosongi:index")
    if emojid is None:
        return redirect("emosongi:index")

    response = Engine.get_song(emojid)

    match response:
        case '401':
            return redirect("emosongi:unauthorized")
        case '429':
            return redirect("emosongi:exceeded")
        case '500':
            return render(request, "emosongi/500.html", status=500)
        case _:
            return render(request, "emosongi/recommendation.html", {"emojisong": response})

def unauthorized(request):
    return render(request, "emosongi/401_unauthorized.html", status=401)

def exceeded(request):
    return render(request, "emosongi/429_many_requests.html", status=429)