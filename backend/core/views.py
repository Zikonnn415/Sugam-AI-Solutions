"""
API views for the AI-Solutions platform.

Public endpoints  – no authentication required:
  GET  /api/blogs/             list all blog articles
  GET  /api/blogs/<id>/        article detail
  GET  /api/case-studies/      list all case studies
  GET  /api/case-studies/<id>/ project detail
  GET  /api/testimonials/      list all customer reviews
  GET  /api/testimonials/<id>/ review detail
  GET  /api/events/            list all promo events
  GET  /api/events/<id>/       event detail
  GET  /api/services/          list all service solutions
  POST /api/inquiries/         submit a contact request
  GET  /api/analytics/         basic public counters

Admin-only endpoints – JWT Bearer token required:
  GET    /api/inquiries/                  list all submitted requests
  DELETE /api/inquiries/<id>/             delete a contact request
  PATCH  /api/inquiries/<id>/toggle-review/ toggle reviewed flag
  POST   /api/blogs/                      create blog article
  PUT    /api/blogs/<id>/                 update blog article
  DELETE /api/blogs/<id>/                 delete blog article
  POST   /api/case-studies/              create case study
  PUT    /api/case-studies/<id>/          update case study
  DELETE /api/case-studies/<id>/          delete case study
  POST   /api/testimonials/              create testimonial
  PUT    /api/testimonials/<id>/          update testimonial
  DELETE /api/testimonials/<id>/          delete testimonial
  POST   /api/events/                     create event
  PUT    /api/events/<id>/                update event
  DELETE /api/events/<id>/                delete event
"""

from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import ContactRequest, Article, Project, Review, PromoEvent, Solution
from .serializers import (
    ContactRequestSerializer,
    ArticleSerializer,
    ProjectSerializer,
    ReviewSerializer,
    PromoEventSerializer,
    SolutionSerializer,
)


# ── Helper ────────────────────────────────────────────────────────────────────

def _paginate(queryset, serializer_cls, request):
    """
    Simple limit/offset pagination used by list views.
    Query params: ?limit=20&offset=0
    Returns: { count, results }
    """
    try:
        limit  = max(1, int(request.query_params.get('limit',  20)))
        offset = max(0, int(request.query_params.get('offset', 0)))
    except ValueError:
        limit, offset = 20, 0

    total   = queryset.count()
    records = queryset[offset: offset + limit]
    data    = serializer_cls(records, many=True).data
    return Response({'count': total, 'results': data})


def _get_or_404(model, pk):
    try:
        return model.objects.get(pk=pk)
    except model.DoesNotExist:
        return None


# ── Authentication ────────────────────────────────────────────────────────────

class ObtainTokenView(APIView):
    """
    POST /api/auth/login/
    Body: { "username": "...", "password": "..." }
    Returns JWT access + refresh tokens on success.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response(
                {'detail': 'Both username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {'detail': 'Invalid credentials. Please try again.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        tokens = RefreshToken.for_user(user)
        access_str = str(tokens.access_token)
        return Response({
            'token':   access_str,
            'access':  access_str,
            'refresh': str(tokens),
        })


# ── Contact / Inquiry ─────────────────────────────────────────────────────────

class ContactListView(APIView):
    """
    GET  /api/inquiries/  – admin only: paginated list of all contact requests
    POST /api/inquiries/  – public: submit a new contact request
    """

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        qs = ContactRequest.objects.all()
        reviewed_param = request.query_params.get('reviewed')
        if reviewed_param is not None:
            flag = reviewed_param.lower() == 'true'
            qs   = qs.filter(is_reviewed=flag)
        return _paginate(qs, ContactRequestSerializer, request)

    def post(self, request):
        serializer = ContactRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactDetailView(APIView):
    """
    GET    /api/inquiries/<pk>/  – admin only
    DELETE /api/inquiries/<pk>/  – admin only
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        obj = _get_or_404(ContactRequest, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ContactRequestSerializer(obj).data)

    def delete(self, request, pk):
        obj = _get_or_404(ContactRequest, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ToggleReviewView(APIView):
    """
    PATCH /api/inquiries/<pk>/toggle-review/
    Flips the is_reviewed flag on a contact request.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        obj = _get_or_404(ContactRequest, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        obj.is_reviewed = not obj.is_reviewed
        obj.save(update_fields=['is_reviewed'])
        return Response({
            'id':          obj.pk,
            'is_reviewed': obj.is_reviewed,
            'message':     f"Marked as {'reviewed' if obj.is_reviewed else 'unreviewed'}.",
        })


# ── Articles (Blog) ───────────────────────────────────────────────────────────

class ArticleListView(APIView):
    """
    GET  /api/blogs/  – public: list all articles
    POST /api/blogs/  – admin only: create a new article
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        return _paginate(Article.objects.all(), ArticleSerializer, request)

    def post(self, request):
        # Accept frontend field names: title, excerpt, content (→body), cover_image_url (→cover_url)
        data = {
            'title':    request.data.get('title', ''),
            'excerpt':  request.data.get('excerpt', ''),
            'body':     request.data.get('content', request.data.get('body', '')),
            'cover_url': request.data.get('cover_image_url', request.data.get('cover_url', '')),
        }
        obj = Article(**{k: v for k, v in data.items() if v != ''})
        if not obj.title:
            return Response({'title': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        obj.save()
        return Response(ArticleSerializer(obj).data, status=status.HTTP_201_CREATED)


class ArticleDetailView(APIView):
    """
    GET    /api/blogs/<pk>/  – public
    PUT    /api/blogs/<pk>/  – admin only: update article
    DELETE /api/blogs/<pk>/  – admin only: delete article
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, pk):
        obj = _get_or_404(Article, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ArticleSerializer(obj).data)

    def put(self, request, pk):
        obj = _get_or_404(Article, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        obj.title    = request.data.get('title',   obj.title)
        obj.excerpt  = request.data.get('excerpt', obj.excerpt)
        obj.body     = request.data.get('content', request.data.get('body', obj.body))
        obj.cover_url = request.data.get('cover_image_url', request.data.get('cover_url', obj.cover_url))
        obj.save()
        return Response(ArticleSerializer(obj).data)

    def delete(self, request, pk):
        obj = _get_or_404(Article, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── Projects (Case Studies) ───────────────────────────────────────────────────

class ProjectListView(APIView):
    """
    GET  /api/case-studies/  – public: list all projects
    POST /api/case-studies/  – admin only: create a new project
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        return _paginate(Project.objects.all(), ProjectSerializer, request)

    def post(self, request):
        # Accept frontend field names: name (→title), summary, details (→description), image_url
        title       = request.data.get('name',    request.data.get('title', ''))
        summary     = request.data.get('summary', '')
        description = request.data.get('details', request.data.get('description', ''))
        image_url   = request.data.get('image_url', '')

        if not title:
            return Response({'name': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

        obj = Project(title=title, summary=summary, description=description, image_url=image_url)
        obj.save()
        return Response(ProjectSerializer(obj).data, status=status.HTTP_201_CREATED)


class ProjectDetailView(APIView):
    """
    GET    /api/case-studies/<pk>/  – public
    PUT    /api/case-studies/<pk>/  – admin only: update project
    DELETE /api/case-studies/<pk>/  – admin only: delete project
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, pk):
        obj = _get_or_404(Project, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProjectSerializer(obj).data)

    def put(self, request, pk):
        obj = _get_or_404(Project, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        obj.title       = request.data.get('name',    request.data.get('title',   obj.title))
        obj.summary     = request.data.get('summary',  obj.summary)
        obj.description = request.data.get('details',  request.data.get('description', obj.description))
        obj.image_url   = request.data.get('image_url', obj.image_url)
        obj.save()
        return Response(ProjectSerializer(obj).data)

    def delete(self, request, pk):
        obj = _get_or_404(Project, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── Reviews (Testimonials) ────────────────────────────────────────────────────

class ReviewListView(APIView):
    """
    GET  /api/testimonials/  – public: list all reviews
    POST /api/testimonials/  – admin only: create a new review
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        return _paginate(Review.objects.all(), ReviewSerializer, request)

    def post(self, request):
        # Accept frontend field names: author (→client_name), company (→organisation), rating (→stars), text (→feedback)
        client_name  = request.data.get('author',  request.data.get('client_name', ''))
        organisation = request.data.get('company', request.data.get('organisation', ''))
        stars        = request.data.get('rating',  request.data.get('stars', 5))
        feedback     = request.data.get('text',    request.data.get('feedback', ''))

        if not client_name:
            return Response({'author': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        if not feedback:
            return Response({'text': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

        try:
            stars = max(1, min(5, int(stars)))
        except (ValueError, TypeError):
            stars = 5

        obj = Review(client_name=client_name, organisation=organisation, stars=stars, feedback=feedback)
        obj.save()
        return Response(ReviewSerializer(obj).data, status=status.HTTP_201_CREATED)


class ReviewDetailView(APIView):
    """
    GET    /api/testimonials/<pk>/  – public
    PUT    /api/testimonials/<pk>/  – admin only: update review
    DELETE /api/testimonials/<pk>/  – admin only: delete review
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, pk):
        obj = _get_or_404(Review, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ReviewSerializer(obj).data)

    def put(self, request, pk):
        obj = _get_or_404(Review, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        obj.client_name  = request.data.get('author',  request.data.get('client_name',  obj.client_name))
        obj.organisation = request.data.get('company', request.data.get('organisation', obj.organisation))
        obj.feedback     = request.data.get('text',    request.data.get('feedback',     obj.feedback))
        try:
            stars = int(request.data.get('rating', request.data.get('stars', obj.stars)))
            obj.stars = max(1, min(5, stars))
        except (ValueError, TypeError):
            pass
        obj.save()
        return Response(ReviewSerializer(obj).data)

    def delete(self, request, pk):
        obj = _get_or_404(Review, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── Promo Events ──────────────────────────────────────────────────────────────

class EventListView(APIView):
    """
    GET  /api/events/  – public: list all events
    POST /api/events/  – admin only: create a new event
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        return _paginate(PromoEvent.objects.all(), PromoEventSerializer, request)

    def post(self, request):
        # Accept frontend field names: title, date (→event_date), description, image_url
        title      = request.data.get('title', '')
        event_date = request.data.get('date', request.data.get('event_date', ''))
        description = request.data.get('description', '')
        image_url   = request.data.get('image_url', '')

        if not title:
            return Response({'title': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        if not event_date:
            return Response({'date': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

        obj = PromoEvent(title=title, event_date=event_date, description=description, image_url=image_url)
        obj.save()
        return Response(PromoEventSerializer(obj).data, status=status.HTTP_201_CREATED)


class EventDetailView(APIView):
    """
    GET    /api/events/<pk>/  – public
    PUT    /api/events/<pk>/  – admin only: update event
    DELETE /api/events/<pk>/  – admin only: delete event
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, pk):
        obj = _get_or_404(PromoEvent, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(PromoEventSerializer(obj).data)

    def put(self, request, pk):
        obj = _get_or_404(PromoEvent, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        obj.title       = request.data.get('title',       obj.title)
        obj.event_date  = request.data.get('date', request.data.get('event_date', obj.event_date))
        obj.description = request.data.get('description', obj.description)
        obj.image_url   = request.data.get('image_url',   obj.image_url)
        obj.save()
        return Response(PromoEventSerializer(obj).data)

    def delete(self, request, pk):
        obj = _get_or_404(PromoEvent, pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── Solutions (Services) ──────────────────────────────────────────────────────

class SolutionListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return _paginate(Solution.objects.all(), SolutionSerializer, request)


# ── Analytics / Stats ─────────────────────────────────────────────────────────

class StatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        pending = ContactRequest.objects.filter(is_reviewed=False).count()
        data = {
            'inquiries':             ContactRequest.objects.count(),
            'unreviewed_inquiries':  pending,
            'blogs':                 Article.objects.count(),
            'case_studies':          Project.objects.count(),
            'testimonials':          Review.objects.count(),
            'events':                PromoEvent.objects.count(),
            'pending_review':        pending,
            'total_solutions':       Solution.objects.count(),
        }
        return Response(data)


# ── ChatBot ───────────────────────────────────────────────────────────────────

class ChatBotView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            user_message = request.data.get('message', '').strip()
            if not user_message:
                return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

            message_lower = user_message.lower()

            if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greetings']):
                response = "Hello! Welcome to Sugam-AI Solutions. I'm here to help you with our AI services. How can I assist you today?"
            elif any(word in message_lower for word in ['service', 'services', 'offer', 'provide']):
                response = "We offer AI Prototyping, Virtual Assistants, Data Engineering, ML Consulting, and Cloud Integration. Which service interests you?"
            elif any(word in message_lower for word in ['contact', 'email', 'phone', 'address']):
                response = "Contact us at: Email: hello@sugamaisolutions.com.np, Phone: +977-1-5551234, Address: Hattisar, Kathmandu 44600, Nepal"
            elif any(word in message_lower for word in ['price', 'cost', 'pricing']):
                response = "We offer customized pricing based on your project needs. Contact us for a free consultation and quote."
            else:
                response = "Thank you for your message! I'm here to help with information about Sugam-AI Solutions. What would you like to know?"

            return Response({'response': response, 'status': 'success'})

        except Exception as e:
            return Response({
                'response': "I apologize, but I'm having technical difficulties. Please contact us at hello@sugamaisolutions.com.np",
                'status': 'error'
            })
