from django.contrib import admin
from .models import ContactRequest, Article, Project, Review, PromoEvent, Solution


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display  = ('name', 'email', 'company', 'country', 'is_reviewed', 'submitted_at')
    list_filter   = ('is_reviewed', 'country')
    search_fields = ('name', 'email', 'company')
    ordering      = ('-submitted_at',)
    readonly_fields = ('submitted_at',)


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display  = ('title', 'published_at')
    search_fields = ('title', 'excerpt')
    ordering      = ('-published_at',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display  = ('title', 'summary', 'created_at')
    search_fields = ('title',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ('client_name', 'organisation', 'stars', 'created_at')
    list_filter   = ('stars',)


@admin.register(PromoEvent)
class PromoEventAdmin(admin.ModelAdmin):
    list_display  = ('title', 'event_date')
    ordering      = ('-event_date',)


@admin.register(Solution)
class SolutionAdmin(admin.ModelAdmin):
    list_display  = ('title', 'price_from', 'delivery_time')
