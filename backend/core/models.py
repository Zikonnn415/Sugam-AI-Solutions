from django.db import models


class ContactRequest(models.Model):
    """
    Submitted via the public Contact Us form.
    Stores a potential customer's details and their job requirements.
    """
    name         = models.CharField(max_length=120)
    email        = models.EmailField()
    phone        = models.CharField(max_length=50, blank=True)
    company      = models.CharField(max_length=150, blank=True)
    country      = models.CharField(max_length=100, blank=True)
    job_title    = models.CharField(max_length=150, blank=True)
    job_details  = models.TextField()
    is_reviewed  = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.name} <{self.email}>"


class Article(models.Model):
    """
    Blog / news article promoting the company and its expertise.
    """
    title         = models.CharField(max_length=200)
    excerpt       = models.CharField(max_length=300, blank=True)
    body          = models.TextField()
    cover_url     = models.URLField(blank=True)
    published_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title


class Project(models.Model):
    """
    Past case study / highlight of a solution delivered to a client.
    """
    title       = models.CharField(max_length=200)
    summary     = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    image_url   = models.URLField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Review(models.Model):
    """
    Customer feedback with a star rating.
    """
    client_name  = models.CharField(max_length=150)
    organisation = models.CharField(max_length=150, blank=True)
    stars        = models.PositiveSmallIntegerField(default=5)  # 1-5
    feedback     = models.TextField()
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.client_name} – {self.stars}★"


class PromoEvent(models.Model):
    """
    Promotional event where the company showcases its solutions.
    """
    title       = models.CharField(max_length=200)
    event_date  = models.DateField()
    description = models.TextField(blank=True)
    image_url   = models.URLField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-event_date']

    def __str__(self):
        return f"{self.title} ({self.event_date})"


class Solution(models.Model):
    """
    A software solution / service package offered by AI-Solutions.
    """
    icon           = models.CharField(max_length=8, help_text="Emoji icon")
    title          = models.CharField(max_length=200)
    description    = models.TextField()
    feature_list   = models.JSONField(default=list)
    delivery_time  = models.CharField(max_length=50)
    price_from     = models.CharField(max_length=50)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title
