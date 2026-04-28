"""
URL routing for the core app.

All paths are relative to /api/ (configured in config/urls.py).

The frontend uses these base URLs (see Contact.jsx, AdminDashboard.jsx, etc.):
  /api/inquiries/            ContactListView
  /api/inquiries/<pk>/       ContactDetailView
  /api/inquiries/<pk>/toggle-review/  ToggleReviewView
  /api/blogs/                ArticleListView        (frontend key: blogs)
  /api/blogs/<pk>/           ArticleDetailView
  /api/case-studies/         ProjectListView        (frontend key: case-studies)
  /api/case-studies/<pk>/    ProjectDetailView
  /api/testimonials/         ReviewListView         (frontend key: testimonials)
  /api/events/               EventListView
  /api/events/<pk>/          EventDetailView
  /api/services/             SolutionListView       (frontend key: services)
  /api/analytics/            StatsView
  /api/auth/login/           ObtainTokenView
"""

from django.urls import path
from .views import (
    ObtainTokenView,
    ContactListView, ContactDetailView, ToggleReviewView,
    ArticleListView, ArticleDetailView,
    ProjectListView, ProjectDetailView,
    ReviewListView,
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

    # ── blog articles ─────────────────────────────────────────────────────────
    path('blogs/',          ArticleListView.as_view(),   name='article-list'),
    path('blogs/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),

    # ── case studies / projects ───────────────────────────────────────────────
    path('case-studies/',          ProjectListView.as_view(),   name='project-list'),
    path('case-studies/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),

    # ── customer reviews / testimonials ───────────────────────────────────────
    path('testimonials/', ReviewListView.as_view(), name='review-list'),

    # ── promotional events ────────────────────────────────────────────────────
    path('events/',          EventListView.as_view(),   name='event-list'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),

    # ── solutions / services ──────────────────────────────────────────────────
    path('services/', SolutionListView.as_view(), name='solution-list'),

    # ── admin analytics ───────────────────────────────────────────────────────
    path('analytics/', StatsView.as_view(), name='stats'),

    # ── chatbot ───────────────────────────────────────────────────────────────
    path('chat/', ChatBotView.as_view(), name='chat'),
]
