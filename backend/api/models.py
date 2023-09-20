from django.db import models
from django.contrib.auth.models import User
from PIL import Image
# Create your models here.


# set upload path and filename
def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    place = models.CharField(max_length=100)
    profile_img = models.ImageField(upload_to=upload_to, blank=True, null=True)
    following = models.ManyToManyField('self', related_name='follower',
                                       symmetrical=False, blank=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.profile_img:
            do_resize(self.profile_img)


class Post(models.Model):
    post_img = models.ImageField(upload_to=upload_to, blank=True, null=True)
    post_text = models.TextField(blank=True, null=True)
    post_date = models.DateTimeField('Publication date', auto_now=True)
    post_owner = models.ForeignKey(Profile, on_delete=models.CASCADE)

    def get_post_likes(self):
        # return PostLike.objects.filter(liked_post=self, like=True)
        return self.postlike_set.filter(like=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.profile_img:
            do_resize(self.profile_img)
    
    

class PostLike(models.Model):
    like = models.BooleanField(default=False, null=True)
    liked_by = models.ForeignKey(Profile, on_delete=models.CASCADE)
    liked_post = models.ForeignKey(Post, on_delete=models.CASCADE)


class Comments(models.Model):
    text = models.TextField()
    date = models.DateTimeField(auto_now=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment_by = models.ForeignKey(Profile, on_delete=models.CASCADE)


# resize the uploaded images 
def do_resize(image):
    pil_img = Image.open(image)
    pil_img.thumbnail((400,400))
    pil_img.save(image.path)
    pil_img.close()