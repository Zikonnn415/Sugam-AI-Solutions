from rest_framework import serializers
from .models import ContactRequest, Article, Project, Review, PromoEvent, Solution


class ContactRequestSerializer(serializers.ModelSerializer):
    """
    Exposes 'reviewed' and 'created_at' aliases so the existing React
    AdminDashboard.jsx (which reads those exact field names) works without
    any frontend changes.
    """
    # alias: frontend reads 'reviewed', model stores 'is_reviewed'
    reviewed   = serializers.BooleanField(source='is_reviewed', read_only=True)
    # alias: frontend reads 'created_at', model stores 'submitted_at'
    created_at = serializers.DateTimeField(source='submitted_at', read_only=True)

    class Meta:
        model  = ContactRequest
        fields = (
            'id', 'name', 'email', 'phone', 'company', 'country',
            'job_title', 'job_details',
            'reviewed', 'created_at',   # aliased fields
            'is_reviewed', 'submitted_at',  # native field names (for admin)
        )
        read_only_fields = ('id', 'is_reviewed', 'submitted_at', 'reviewed', 'created_at')


class ArticleSerializer(serializers.ModelSerializer):
    """
    Exposes 'content' alias (frontend reads 'content', model stores 'body')
    and 'cover_image_url' alias (frontend reads that, model stores 'cover_url').
    """
    content         = serializers.CharField(source='body', read_only=True)
    cover_image_url = serializers.URLField(source='cover_url', read_only=True)
    # alias: frontend reads 'created_at', model stores 'published_at'
    created_at      = serializers.DateTimeField(source='published_at', read_only=True)

    class Meta:
        model  = Article
        fields = (
            'id', 'title', 'excerpt',
            'content', 'cover_image_url',   # aliased
            'created_at',                   # aliased
            'body', 'cover_url',            # native
            'published_at',
        )
        read_only_fields = ('id', 'published_at')


class ProjectSerializer(serializers.ModelSerializer):
    """
    Exposes 'name' and 'details' aliases to match the frontend CaseStudy shape.
    """
    name    = serializers.CharField(source='title',       read_only=True)
    details = serializers.CharField(source='description', read_only=True)

    class Meta:
        model  = Project
        fields = (
            'id',
            'name', 'details',   # aliased (frontend keys)
            'title', 'summary', 'description', 'image_url', 'created_at',
        )
        read_only_fields = ('id', 'created_at')


class ReviewSerializer(serializers.ModelSerializer):
    """
    Exposes 'author', 'company', 'rating', 'text' aliases matching
    the frontend Testimonials shape.
    """
    author  = serializers.CharField(source='client_name',  read_only=True)
    company = serializers.CharField(source='organisation',  read_only=True)
    rating  = serializers.IntegerField(source='stars',      read_only=True)
    text    = serializers.CharField(source='feedback',      read_only=True)

    class Meta:
        model  = Review
        fields = (
            'id',
            'author', 'company', 'rating', 'text',     # aliased
            'client_name', 'organisation', 'stars', 'feedback', 'created_at',
        )
        read_only_fields = ('id', 'created_at')


class PromoEventSerializer(serializers.ModelSerializer):
    """
    Exposes 'date' alias (frontend reads 'date', model stores 'event_date').
    """
    date = serializers.DateField(source='event_date', read_only=True)

    class Meta:
        model  = PromoEvent
        fields = (
            'id', 'title',
            'date',        # aliased
            'event_date',  # native
            'description', 'image_url', 'created_at',
        )
        read_only_fields = ('id', 'created_at')


class SolutionSerializer(serializers.ModelSerializer):
    """
    Exposes 'features', 'timeline', 'starting_price' aliases matching
    the frontend Services shape.
    """
    features       = serializers.JSONField(source='feature_list',   read_only=True)
    timeline       = serializers.CharField(source='delivery_time',  read_only=True)
    starting_price = serializers.CharField(source='price_from',     read_only=True)

    class Meta:
        model  = Solution
        fields = (
            'id', 'icon', 'title', 'description',
            'features', 'timeline', 'starting_price',   # aliased
            'feature_list', 'delivery_time', 'price_from', 'created_at',
        )
        read_only_fields = ('id', 'created_at')
