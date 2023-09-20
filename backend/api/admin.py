from django.contrib import admin
from .models import Profile, Post, Comments
# Register your models here.


class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'first_name', 'place']


admin.site.register(Profile, ProfileAdmin)
admin.site.register(Post)
admin.site.register(Comments)