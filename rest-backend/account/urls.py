from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "account"

# Create a default router and register the viewsets
router = DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls))
]
