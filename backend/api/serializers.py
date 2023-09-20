from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Post, PostLike, Comments

class CreateUserSerializer(serializers.ModelSerializer):
    date_joined = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'date_joined']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user


class userSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields =  '__all__'


class UpdateProfileSerializer(serializers.ModelSerializer):
    user = CreateUserSerializer(read_only=True)
    follow_status = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [ 'user', 'id', 'first_name', 'last_name', 'place', 'profile_img', 'follow_status']

    def get_follow_status(self, obj):
        if obj.follower.filter(user=self.context['request'].user):
            print(self.context['request'].user)
            return True
        return False

    # add number of followers and followees of a profile object in the serialized output
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['following'] = instance.following.count()
        representation['followers'] = instance.follower.count()
        return representation


class ProfileListSerializer(serializers.ModelSerializer):
    user = CreateUserSerializer(read_only=True)

    class  Meta:
        model = Profile
        fields = ['user', 'profile_img']


class PostSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    post_owner = ProfileListSerializer(read_only=True)
    post_date = serializers.DateTimeField(format="%d-%m-%Y %H:%M",  read_only=True)
    is_liked_by_current_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [ 'id', 'post_img', 'post_text', 'post_date', 'post_owner', 'is_liked_by_current_user']

    def get_is_liked_by_current_user(self, obj):
        user = self.context['request'].user
        profile = Profile.objects.get(user=user)
        if  obj.postlike_set.filter(liked_by=profile, like=True):
            return True
        return False
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['likes_count'] = instance.get_post_likes().count()
        representation['comments_count'] = instance.comments_set.count()
        return representation


class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        field = ['like', 'liked_post']


class CommentsSerializer(serializers.ModelSerializer):
    comment_by = ProfileListSerializer(read_only=True)
    
    class Meta:
        model = Comments
        fields = ['id', 'comment_by', 'text', 'post']
        extra_kwargs = {'id':{'read_only':True}, 'post':{'write_only': True}}