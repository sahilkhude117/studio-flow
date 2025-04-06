
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/user/', include('user_api.urls')),
    path('api/v1/flow/', include('flow_api.urls')),
]
