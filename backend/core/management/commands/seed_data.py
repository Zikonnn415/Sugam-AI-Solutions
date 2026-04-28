"""
Management command: python manage.py seed_data

Clears existing data and re-populates every table with realistic
demo content suited for the AI-Solutions assignment demo video.

Usage:
    python manage.py seed_data           # seed with defaults
    python manage.py seed_data --clear   # wipe tables before seeding
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import ContactRequest, Article, Project, Review, PromoEvent, Solution


User = get_user_model()

ARTICLES = [
    {
        'title':     'How AI Is Reshaping Network Security in 2025',
        'excerpt':   'Modern enterprise networks face threats that traditional tools were never designed to handle.',
        'body':      'Artificial intelligence is now central to how organisations defend their perimeters. '
                     'From anomaly detection in real-time traffic to automated incident response, AI-driven '
                     'tools reduce mean time-to-detect from hours to seconds. At AI-Solutions, our NetGuard '
                     'platform uses a transformer-based model trained on 14 billion network flow records to '
                     'identify lateral movement, data exfiltration, and zero-day exploits before they escalate.',
        'cover_url': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    },
    {
        'title':     'VLSM Addressing Made Simple: A Field Guide',
        'excerpt':   'Variable Length Subnet Masking lets you allocate addresses efficiently across departments.',
        'body':      'When designing the IP addressing scheme for a multi-floor office building you must balance '
                     'current host counts with room for growth. VLSM solves this by assigning a /25 to a '
                     '100-user department while reserving only a /30 for a point-to-point WAN link — wasting '
                     'no addresses. This guide walks through the complete subnetting calculation for a '
                     'four-floor building with eight departments and a dedicated server room.',
        'cover_url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    },
    {
        'title':     'Hierarchical Network Design: Why Three Tiers Still Win',
        'excerpt':   'Core, distribution, and access — the classic model remains the gold standard.',
        'body':      'Despite the rise of spine-leaf topologies in data centres, the three-tier hierarchical '
                     'model remains the preferred choice for enterprise campus networks. The access layer '
                     'connects end devices, the distribution layer aggregates traffic and enforces policy, '
                     'and the core layer provides high-speed backbone switching. Redundancy at every tier '
                     'ensures that a single switch failure never isolates an entire floor.',
        'cover_url': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
    },
]

PROJECTS = [
    {
        'title':     'Secure Campus Network — University of Sunderland (Simulation)',
        'summary':   'Designed and simulated a redundant hierarchical network for a 710-device campus.',
        'description': 'Used Cisco Packet Tracer to implement a three-tier network across four floors. '
                       'VLSM addressing allocated a /25 per 100-user department, a /27 for the server room, '
                       'and a /30 for each inter-switch link. OSPF provided dynamic routing between VLANs; '
                       'DHCP pools were configured on dedicated servers; WPA2-Enterprise secured all wireless SSIDs.',
        'image_url': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
    },
    {
        'title':     'AI-Powered Virtual Assistant — Retail Chain',
        'summary':   'Deployed a conversational AI that handles 80% of tier-1 customer queries.',
        'description': 'Integrated a fine-tuned GPT-based model with the client\'s inventory and CRM systems. '
                       'The assistant handles stock enquiries, order tracking, and complaint logging. '
                       'Escalation to a human agent is triggered automatically when sentiment analysis '
                       'detects frustration or when the query falls outside the model\'s confidence threshold.',
        'image_url': 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600',
    },
    {
        'title':     'Cloud Migration — Financial Services Firm',
        'summary':   'Migrated on-premises infrastructure to AWS, cutting OpEx by 34%.',
        'description': 'A lift-and-shift migration followed by re-architecture of stateless services to '
                       'serverless Lambda functions. VPC design mirrored the existing network segmentation; '
                       'Transit Gateway replaced physical MPLS links. The project completed two weeks ahead '
                       'of schedule with zero data loss and 99.98% uptime during cutover.',
        'image_url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
    },
]

REVIEWS = [
    {
        'client_name':  'Sarah Thompson',
        'organisation': 'Nexora Logistics Ltd',
        'stars':        5,
        'feedback':     'AI-Solutions delivered exactly what they promised — on time and on budget. '
                        'The virtual assistant has transformed our customer support operations.',
    },
    {
        'client_name':  'James Okafor',
        'organisation': 'BlueSky Finance',
        'stars':        5,
        'feedback':     'Their network simulation documentation was thorough and made our compliance audit '
                        'straightforward. Highly recommend for any infrastructure project.',
    },
    {
        'client_name':  'Priya Mehta',
        'organisation': 'HealthFirst NHS Trust',
        'stars':        4,
        'feedback':     'Great technical expertise and responsive communication throughout. '
                        'Would definitely work with them again on our upcoming data warehouse project.',
    },
    {
        'client_name':  'David Llewellyn',
        'organisation': 'Cardiff City Council',
        'stars':        5,
        'feedback':     'Professional team with deep knowledge of public-sector compliance requirements. '
                        'The AI prototyping solution exceeded our expectations.',
    },
]

EVENTS = [
    {
        'title':       'AI & Network Innovation Summit 2025',
        'event_date':  '2025-11-14',
        'description': 'A full-day conference bringing together network engineers and AI practitioners '
                       'to explore the intersection of machine learning and enterprise networking. '
                       'Live demos of our NetGuard intrusion detection platform.',
        'image_url':   'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
    },
    {
        'title':       'Virtual Assistant Prototyping Workshop',
        'event_date':  '2025-12-05',
        'description': 'Hands-on half-day workshop where attendees build and test a simple '
                       'domain-specific chatbot using our rapid prototyping toolkit. '
                       'No prior AI experience required.',
        'image_url':   'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    },
    {
        'title':       'Sunderland Tech Meetup — Cloud & Security Edition',
        'event_date':  '2026-01-22',
        'description': 'Monthly community meetup hosted at AI-Solutions HQ. This edition focuses '
                       'on zero-trust architecture and cloud-native security tooling.',
        'image_url':   'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600',
    },
]

SOLUTIONS = [
    {
        'icon':          '🔒',
        'title':         'Secure Network Design',
        'description':   'End-to-end network architecture for enterprise campuses — from requirements '
                         'gathering through Packet Tracer simulation to live deployment support.',
        'feature_list':  ['VLSM IP addressing scheme', 'Hierarchical 3-tier topology',
                          'Redundancy at every layer', 'VLAN segmentation', 'DHCP & DNS configuration',
                          'Wireless WPA2 setup', 'Firewall & ACL policy'],
        'delivery_time': '4–6 weeks',
        'price_from':    '£3,500',
    },
    {
        'icon':          '🤖',
        'title':         'AI Virtual Assistant',
        'description':   'Custom conversational AI integrated with your existing systems — '
                         'CRM, ticketing, inventory — with automatic human escalation.',
        'feature_list':  ['Intent classification', 'Sentiment-based escalation',
                          'CRM / API integration', 'Multi-channel deployment',
                          'Analytics dashboard', 'Continuous model fine-tuning'],
        'delivery_time': '6–8 weeks',
        'price_from':    '£5,000',
    },
    {
        'icon':          '☁️',
        'title':         'Cloud Migration',
        'description':   'Structured migration of on-premises infrastructure to AWS, Azure, or GCP '
                         'with minimal downtime and full compliance documentation.',
        'feature_list':  ['Current-state assessment', 'Migration strategy report',
                          'IaC templates (Terraform)', 'VPC / VNET design',
                          'Zero-downtime cutover plan', 'Post-migration support'],
        'delivery_time': '8–12 weeks',
        'price_from':    '£8,000',
    },
    {
        'icon':          '📊',
        'title':         'Data Engineering & Analytics',
        'description':   'Build the data pipelines, warehouses, and dashboards your business '
                         'needs to make evidence-based decisions at scale.',
        'feature_list':  ['ETL pipeline design', 'Data warehouse setup',
                          'BI dashboard (Power BI / Tableau)', 'Automated reporting',
                          'Data quality monitoring'],
        'delivery_time': '4–8 weeks',
        'price_from':    '£4,200',
    },
]

CONTACTS = [
    {
        'name': 'Alice Greenwood', 'email': 'alice@greentech.co.uk',
        'phone': '+44 7700 900111', 'company': 'GreenTech Ltd',
        'country': 'United Kingdom', 'job_title': 'CTO',
        'job_details': 'Looking for a virtual assistant solution for our helpdesk team.',
        'is_reviewed': True,
    },
    {
        'name': 'Mohamed Hassan', 'email': 'm.hassan@delta-logistics.com',
        'phone': '+20 100 123 4567', 'company': 'Delta Logistics',
        'country': 'Egypt', 'job_title': 'IT Manager',
        'job_details': 'Need network design for new 3-floor warehouse facility — roughly 250 users.',
        'is_reviewed': False,
    },
    {
        'name': 'Chen Wei', 'email': 'cwei@innovate-sh.cn',
        'phone': '', 'company': 'Innovate Shanghai',
        'country': 'China', 'job_title': 'Head of Engineering',
        'job_details': 'Interested in AI prototyping for manufacturing quality-control pipeline.',
        'is_reviewed': False,
    },
    {
        'name': 'Laura Svensson', 'email': 'laura.s@nordic-bank.se',
        'phone': '+46 70 123 4567', 'company': 'Nordic Bank AB',
        'country': 'Sweden', 'job_title': 'Security Architect',
        'job_details': 'Evaluating vendors for a zero-trust network redesign across four European offices.',
        'is_reviewed': True,
    },
    {
        'name': 'Raj Patel', 'email': 'raj@startupnexus.in',
        'phone': '+91 98765 43210', 'company': 'Startup Nexus',
        'country': 'India', 'job_title': 'Founder',
        'job_details': 'We need a rapid AI chatbot prototype for a demo to investors next month.',
        'is_reviewed': False,
    },
]


class Command(BaseCommand):
    help = 'Seeds the database with demo data for the AI-Solutions assignment.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear', action='store_true',
            help='Delete all existing records before seeding.',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self._clear_tables()

        self._seed_admin()
        self._seed_articles()
        self._seed_projects()
        self._seed_reviews()
        self._seed_events()
        self._seed_solutions()
        self._seed_contacts()

        # NOTE: Keep this output ASCII-only for Windows terminals (cp1252).
        self.stdout.write(self.style.SUCCESS(
            '\nSeed complete.\n'
            '  Admin login: username=admin  password=admin123\n'
            '  API base:    http://127.0.0.1:8000/api/\n'
        ))

    # ── helpers ───────────────────────────────────────────────────────────────

    def _clear_tables(self):
        for Model in (ContactRequest, Article, Project, Review, PromoEvent, Solution):
            count = Model.objects.count()
            Model.objects.all().delete()
            self.stdout.write(f'  Cleared {count} rows from {Model.__name__}')

    def _seed_admin(self):
        """
        Ensure there's always a known local demo admin account.
        If it already exists, reset its password to the documented default.
        """
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@aisolutions.local', 'is_superuser': True, 'is_staff': True},
        )
        if created:
            user.set_password('admin123')
            user.save(update_fields=['password'])
            self.stdout.write('  Created superuser admin / admin123')
            return

        # Ensure correct privileges + password (safe for local demo)
        changed = False
        if not user.is_superuser:
            user.is_superuser = True
            changed = True
        if not user.is_staff:
            user.is_staff = True
            changed = True
        user.set_password('admin123')
        if changed:
            user.save()
            self.stdout.write('  Updated admin user and reset password to admin123')
        else:
            user.save(update_fields=['password'])
            self.stdout.write('  Reset admin password to admin123')

    def _seed_articles(self):
        for data in ARTICLES:
            Article.objects.get_or_create(title=data['title'], defaults=data)
        self.stdout.write(f'  Seeded {len(ARTICLES)} articles')

    def _seed_projects(self):
        for data in PROJECTS:
            Project.objects.get_or_create(title=data['title'], defaults=data)
        self.stdout.write(f'  Seeded {len(PROJECTS)} projects')

    def _seed_reviews(self):
        for data in REVIEWS:
            Review.objects.get_or_create(
                client_name=data['client_name'],
                organisation=data['organisation'],
                defaults=data,
            )
        self.stdout.write(f'  Seeded {len(REVIEWS)} reviews')

    def _seed_events(self):
        for data in EVENTS:
            PromoEvent.objects.get_or_create(title=data['title'], defaults=data)
        self.stdout.write(f'  Seeded {len(EVENTS)} events')

    def _seed_solutions(self):
        for data in SOLUTIONS:
            Solution.objects.get_or_create(title=data['title'], defaults=data)
        self.stdout.write(f'  Seeded {len(SOLUTIONS)} solutions')

    def _seed_contacts(self):
        if ContactRequest.objects.count() == 0:
            for data in CONTACTS:
                ContactRequest.objects.create(**data)
            self.stdout.write(f'  Seeded {len(CONTACTS)} contact requests')
        else:
            self.stdout.write('  Contact requests already exist - skipped')
