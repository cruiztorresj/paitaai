from django.urls import path

from . import views

app_name = "emosongi"
urlpatterns = [
    path("", views.index, name="index"),
    path("recommend/", views.recommend, name="recommend"),
    path("unauthorized/", views.unauthorized, name="unauthorized"),
    path("exceeded/", views.exceeded, name="exceeded"),
]