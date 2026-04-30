"""
URL routing for the core app.

All paths are relative to /api/ (configured in config/urls.py).
"""

from django.urls import path
from .views import (
    ObtainTokenView,
    ContactListView, ContactDetailView, ToggleReviewView,
    ArticleListView, ArticleDetailView,
    ProjectListView, ProjectDetailView,
    ReviewListView, ReviewDetailView,
    EventListView, EventDetailView,
    SolutionListView,
    StatsView,
    ChatBotView,
)

urlpatterns = [
    # ── auth ──────────────────────────────────────────────────────────────────
    path('auth/login/', ObtainTokenView.as_view(), name='auth-login'),

    # ── contact / inquiries ───────────────────────────────────────────────────
    path('inquiries/',                          ContactListView.as_view(),   name='contact-list'),
    path('inquiries/<int:pk>/',                 ContactDetailView.as_view(), name='contact-detail'),
    path('inquiries/<int:pk>/toggle-review/',   ToggleReviewView.as_view(),  name='contact-toggle'),

    # ── blog articles (GET public, POST/PUT/DELETE admin) ─────────────────────
    path('blogs/',          ArticleListView.as_view(),   name='article-list'),
    path('blogs/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),

    # ── case studies / projects (GET public, POST/PUT/DELETE admin) ───────────
    path('case-studies/',          ProjectListView.as_view(),   name='project-list'),
    path('case-studies/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),

    # ── testimonials / reviews (GET public, POST/PUT/DELETE admin) ────────────
    path('testimonials/',          ReviewListView.as_view(),   name='review-list'),
    path('testimonials/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),

    # ── promotional events (GET public, POST/PUT/DELETE admin) ────────────────
    path('events/',          EventListView.as_view(),   name='event-list'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),

    # ── solutions / services ──────────────────────────────────────────────────
    path('services/', SolutionListView.as_view(), name='solution-list'),

    # ── admin analytics ───────────────────────────────────────────────────────
    path('analytics/', StatsView.as_view(), name='stats'),

    # ── chatbot ───────────────────────────────────────────────────────────────
    path('chat/', ChatBotView.as_view(), name='chat'),
]
