from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.viewsets import GenericViewSet
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes, action

from .serializers import CreateUserSerializer, UpdateProfileSerializer, CommentsSerializer
from .serializers import userSerializers, PostSerializer, ProfileListSerializer
from .models import Profile, Post, PostLike, Comments
from django.contrib.auth.models import User
from .permissons import ProfilePermissions, PostPermissions
# Create your views here.


class CreateUserView(APIView):
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]
    print('PING')
    def post(self, request):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            print(validated_data)
            newUser = serializer.save()
            Token.objects.create(user=newUser)
            newProfile = Profile(user=newUser)
            newProfile.save()
            newProfile.follower.add(newProfile)
            print(serializer.data)
            return Response(serializer.data)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomAuthToken(ObtainAuthToken):
    # permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print('reached')
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, create = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'user_id': user.id
        })


class LogOut(APIView):
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class userviewsets(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = userSerializers
    
            

class ProfieViewSet(GenericViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [ProfilePermissions]
    serializer_class = UpdateProfileSerializer
    parser_classes = [MultiPartParser, FormParser]

    queryset = Profile.objects.all()
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'

    def get_object(self):
        obj = self.queryset.get(user__username=self.kwargs.get('username'))
        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_class(self):
        if self.action in ['list',  'searchProfile', 'get_userProfile']:
            return  ProfileListSerializer
        return UpdateProfileSerializer
    
    def list(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        # return self.get_paginated_response(self.paginate_queryset(serializer.data))
        return Response(serializer.data)
    
    def retrieve(self, request, username):
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        # print(serializer.data)
        return Response(serializer.data)
    
    def update(self, request, username):
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data)
        # print(serializer)
        if serializer.is_valid():
            updated_profile = serializer.save()
            return Response(self.get_serializer(updated_profile).data)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['GET'])
    def searchProfile(self, request):
        username = request.query_params.get('username')
        qs = Profile.objects.filter(user__username__startswith=username)
        serializer = self.get_serializer(qs, many=True)
        # print(serializer.data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['GET'])
    def get_userProfile(self, request, username):
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        # print(serializer.data)
        return Response(serializer.data)


class PostViewSet(GenericViewSet):
    authentication_classes = [TokenAuthentication]
    serializer_class = PostSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [PostPermissions]

    def get_queryset(self):
        user = self.request.user
        profile = Profile.objects.get(user=user)
        following_qs = profile.following.all()
        return Post.objects.filter(post_owner__in=following_qs).order_by('-post_date')

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = Profile.objects.get(user=request.user)
        serializer.save(post_owner=profile)
        return Response( {'message':"success"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        # print(serializer.data)
        return Response(serializer.data)
    
    def retrieve(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = self.get_serializer(post)
        # print(serializer.data)
        return Response(serializer.data)

    def destroy(self, request, pk):
        post = self.get_object()
        # print(post)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
  
    @action(detail=False, methods=['GET'])
    def get_profilePosts(self, request):
        profile_id = request.query_params.get('profile_id')
        posts = Post.objects.filter(post_owner=profile_id)
        # print(posts)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)     
    

class PostLikeView(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = PostLike.objects.all()

    def post(self, request):
        # print(request.data)
        post = get_object_or_404(Post, pk = request.data['liked_post_id'])
        profile = get_object_or_404(Profile, user=request.user)
        user_liked = request.data['like'] 
        postLike = PostLike.objects.filter(liked_post=post, liked_by=profile).first()
        
        #if postLike instance does not exist, create one
        if not postLike:
            postLike = PostLike.objects.create(like=user_liked, liked_by=profile, liked_post=post)
        else:  # update the existing postLike object
            postLike.like = user_liked
            postLike.save()
            # print(postLike.like)
            # print(PostLike.objects.filter(liked_post=post, like=True).count())
        likes_count = post.postlike_set.filter(like=True).count()
        return JsonResponse({'likes_count' : likes_count })


@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def follow(request, pk):
    user_profile = get_object_or_404(Profile, user=request.user)
    profile = get_object_or_404(Profile, pk=pk)
    follow = request.data['followStatus']
    qs = profile.follower.filter(user=request.user)
    if qs and follow  :
        pass
    elif follow and not qs:
        profile.follower.add(user_profile)
    elif not follow and not qs:
        pass
    else:
        profile.follower.remove(user_profile)
    followers = profile.follower.all().count()
    return Response( {"followers":followers})

    
class CommentsViewSet(GenericViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CommentsSerializer
    # parser_classes = [JSONParser]

    def get_queryset(self):
        post_id = self.request.query_params.get('post_id')
        post = Post.objects.get(pk=post_id)
        qs = Comments.objects.filter(post=post)
        return qs

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = Profile.objects.get(user=request.user)
        comment = serializer.save(comment_by=profile)
        return Response(self.get_serializer(comment).data)

    def list(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)


