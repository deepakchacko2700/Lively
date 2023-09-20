from api.views import userviewsets, ProfieViewSet, PostViewSet, CommentsViewSet
from rest_framework import routers
 
router = routers.DefaultRouter()
router.register('user', userviewsets)
router.register('profile-viewset', ProfieViewSet, basename='profile')
router.register('post-viewset', PostViewSet, basename='post')
router.register('comments-viewset', CommentsViewSet, basename='comment')
