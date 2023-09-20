from django.urls import path, include
from .views import CreateUserView, PostLikeView, follow
from .router import router

urlpatterns = [
    path('create-user/', CreateUserView.as_view(), name='createUser' ),
    path('post-like/', PostLikeView.as_view(), name='postlike' ),
    path('follow/<int:pk>/', follow, name='follow'),
    path('', include(router.urls)),

]
