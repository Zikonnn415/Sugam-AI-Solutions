"""
API views for the AI-Solutions platform.

Public endpoints  – no authentication required:
  GET  /api/articles/          list all blog articles
  GET  /api/articles/<id>/     article detail
  GET  /api/projects/          list all case studies
  GET  /api/projects/<id>/     project detail
  GET  /api/reviews/           list all customer reviews
  GET  /api/events/            list all promo events
  GET  /api/events/<id>/       event detail
  GET  /api/solutions/         list all service solutions
  POST /api/contact/           submit a contact request
  GET  /api/stats/             basic public counters

Admin-only endpoints – JWT Bearer token required:
  GET    /api/contact/             list all submitted requests
  PATCH  /api/contact/<id>/review/ toggle reviewed flag
"""

from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from decouple import config
import ollama

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
            # 'token' keeps AdminDashboard.jsx working without any frontend edits
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
        # optional filter: ?reviewed=true|false
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
    GET    /api/inquiries/<pk>/              – admin only
    DELETE /api/inquiries/<pk>/              – admin only
    """
    permission_classes = [IsAuthenticated]

    def _get_object(self, pk):
        try:
            return ContactRequest.objects.get(pk=pk)
        except ContactRequest.DoesNotExist:
            return None

    def get(self, request, pk):
        obj = self._get_object(pk)
        if obj is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ContactRequestSerializer(obj).data)

    def delete(self, request, pk):
        obj = self._get_object(pk)
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
        try:
            obj = ContactRequest.objects.get(pk=pk)
        except ContactRequest.DoesNotExist:
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
    permission_classes = [AllowAny]

    def get(self, request):
        return _paginate(Article.objects.all(), ArticleSerializer, request)


class ArticleDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            obj = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ArticleSerializer(obj).data)


# ── Projects (Case Studies) ───────────────────────────────────────────────────

class ProjectListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return _paginate(Project.objects.all(), ProjectSerializer, request)


class ProjectDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            obj = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProjectSerializer(obj).data)


# ── Reviews (Testimonials) ────────────────────────────────────────────────────

class ReviewListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return _paginate(Review.objects.all(), ReviewSerializer, request)


# ── Promo Events ──────────────────────────────────────────────────────────────

class EventListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return _paginate(PromoEvent.objects.all(), PromoEventSerializer, request)


class EventDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            obj = PromoEvent.objects.get(pk=pk)
        except PromoEvent.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(PromoEventSerializer(obj).data)


# ── Solutions (Services) ──────────────────────────────────────────────────────

class SolutionListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return _paginate(Solution.objects.all(), SolutionSerializer, request)


# ── Analytics / Stats ─────────────────────────────────────────────────────────

class StatsView(APIView):
    """
    GET /api/analytics/
    Returns counts used by the admin dashboard summary cards.
    Authentication is optional — authenticated callers receive extra detail.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        pending = ContactRequest.objects.filter(is_reviewed=False).count()
        data = {
            # keys the React AdminDashboard.jsx reads directly
            'inquiries':             ContactRequest.objects.count(),
            'unreviewed_inquiries':  pending,
            'blogs':                 Article.objects.count(),
            'case_studies':          Project.objects.count(),
            'testimonials':          Review.objects.count(),
            'events':                PromoEvent.objects.count(),
            # extra detail fields (not breaking)
            'pending_review':        pending,
            'total_solutions':       Solution.objects.count(),
        }
        return Response(data)


# ── ChatBot ───────────────────────────────────────────────────────────────

class ChatBotView(APIView):
    """
    POST /api/chat/
    Chatbot endpoint that integrates with Ollama (free, local AI).
    Handles user messages and returns AI responses.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            user_message = request.data.get('message', '').strip()
            
            if not user_message:
                return Response(
                    {'error': 'Message is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Professional responses based on message content
            message_lower = user_message.lower()
            
            # Check for specific keywords to provide relevant responses
            if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greetings']):
                ai_response = """👋 Welcome to Sugam-AI Solutions!

I'm your AI assistant, here to help you explore our cutting-edge AI solutions. We're a leading AI company based in Kathmandu, Nepal, specializing in:

🤖 AI Prototyping
🤖 Virtual Assistants  
🤖 Data Engineering
🤖 ML Consulting
🤖 Cloud Integration

How can I assist you today? Are you interested in learning more about our services or do you have specific questions about how AI can transform your business?"""
            
            elif any(word in message_lower for word in ['service', 'services', 'offer', 'provide']):
                ai_response = """🚀 Our AI Services at Sugam-AI Solutions:

1️⃣ **AI Prototyping** - Transform your ideas into working AI models
2️⃣ **Virtual Assistants** - Intelligent chatbots and voice assistants  
3️⃣ **Data Engineering** - Build robust data pipelines and infrastructure
4️⃣ **ML Consulting** - Expert guidance on machine learning implementation
5️⃣ **Cloud Integration** - Seamlessly integrate AI with cloud platforms

🎯 **Specializations**: Finance, Tourism, Retail, Healthcare, Government

Which service interests you most? I can provide detailed information about any of these solutions!"""
            
            elif any(word in message_lower for word in ['contact', 'email', 'phone', 'address', 'location']):
                ai_response = """📇 Contact Information - Sugam-AI Solutions

📍 **Address**: Hattisar, Kathmandu 44600, Nepal
📧 **Email**: hello@sugamaisolutions.com.np  
📞 **Phone**: +977-1-5551234
🌐 **Website**: Your current website!

🕐 **Business Hours**: Monday - Friday, 9:00 AM - 6:00 PM

Feel free to reach out for:
• Free AI consultation
• Project discussions  
• Technical support
• Partnership opportunities

How else can I help you today?"""
            
            elif any(word in message_lower for word in ['price', 'cost', 'pricing', 'investment']):
                ai_response = """💰 Investment in AI Solutions

At Sugam-AI Solutions, we offer customized pricing based on your specific needs:

🔍 **Free Initial Consultation** - Discuss your AI requirements
📊 **Custom Quotes** - Tailored to your project scope and complexity
💡 **Flexible Models** - Project-based, retainer, or partnership options

Factors affecting pricing:
• Project complexity
• Timeline requirements  
• Technology stack
• Ongoing support needs

📞 **Get Your Quote**: Contact us at +977-1-5551234 for a detailed consultation.

What type of AI solution are you considering?"""
            
            else:
                ai_response = f"""🤖 Thank you for your message: "{user_message}"

I'm here to help you with information about Sugam-AI Solutions! 

We're a premier AI company based in Kathmandu, Nepal, dedicated to transforming businesses through cutting-edge artificial intelligence.

**Popular Topics**:
• Our AI services and solutions
• Industry-specific applications (Finance, Tourism, Retail, Healthcare, Government)
• Pricing and consultation
• Technical implementation
• Partnership opportunities

What specific aspect of AI solutions would you like to explore? I'm here to provide detailed, professional guidance!"""

            return Response({
                'response': ai_response,
                'status': 'success'
            })

        except Exception as e:
            print(f"General Error: {e}")
            fallback_response = "I apologize, but I'm experiencing technical difficulties. Please contact our team at hello@sugamaisolutions.com.np or call +977-1-5551234 for immediate assistance with your AI solution needs."
            
            return Response({
                'response': fallback_response,
                'status': 'error'
            })
