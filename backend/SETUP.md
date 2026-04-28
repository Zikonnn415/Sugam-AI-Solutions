# AI-Solutions Backend — Setup Guide

## Prerequisites
- Python 3.10+ (`python --version`)
- pip

---

## 1. Create and activate a virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

---

## 2. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 3. Apply database migrations

```bash
python manage.py migrate
```

---

## 4. Seed demo data (admin user + sample content)

```bash
python manage.py seed_data
```

This creates:
| What | Detail |
|------|--------|
| **Admin user** | username: `admin` / password: `admin123` |
| Articles | 3 blog posts |
| Projects | 3 case studies |
| Reviews | 4 customer testimonials |
| Events | 3 promotional events |
| Solutions | 4 service packages |
| Contact requests | 5 sample inquiries |

To wipe and re-seed from scratch: `python manage.py seed_data --clear`

---

## 5. Start the development server

```bash
python manage.py runserver
```

The API is now live at **http://127.0.0.1:8000/api/**

---

## 6. Start the React frontend (in a separate terminal)

```bash
cd ../frontend/Website
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## API Reference

### Public endpoints (no authentication)

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/blogs/` | List all blog articles |
| `GET` | `/api/blogs/<id>/` | Article detail |
| `GET` | `/api/case-studies/` | List all case studies |
| `GET` | `/api/case-studies/<id>/` | Case study detail |
| `GET` | `/api/testimonials/` | List customer reviews |
| `GET` | `/api/events/` | List promotional events |
| `GET` | `/api/events/<id>/` | Event detail |
| `GET` | `/api/services/` | List service solutions |
| `POST` | `/api/inquiries/` | Submit a contact request |
| `GET` | `/api/analytics/` | Summary statistics |
| `POST` | `/api/auth/login/` | Obtain JWT token |

### Admin-only endpoints (Bearer token required)

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/inquiries/` | List all contact requests |
| `GET` | `/api/inquiries/<id>/` | Contact request detail |
| `PATCH` | `/api/inquiries/<id>/toggle-review/` | Toggle reviewed status |
| `DELETE` | `/api/inquiries/<id>/` | Delete a request |

### Authentication

Login to receive a JWT access token:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Use the returned `token` value in subsequent requests:

```bash
curl http://127.0.0.1:8000/api/inquiries/ \
  -H "Authorization: Token <your_token_here>"
```

### Pagination

All list endpoints support `?limit=20&offset=0` query parameters.
Response shape: `{ "count": <total>, "results": [...] }`

---

## Project structure

```
aisolutions_backend/
├── config/
│   ├── settings.py        Django configuration
│   ├── urls.py            Root URL routing
│   └── wsgi.py
├── core/
│   ├── models.py          Data models (ContactRequest, Article, Project, …)
│   ├── serializers.py     DRF serializers with frontend-compatibility aliases
│   ├── views.py           All API views (APIView-based, no magic ViewSets)
│   ├── urls.py            /api/* routing
│   ├── admin.py           Django admin registrations
│   ├── middleware.py      Token→Bearer header rewrite
│   ├── apps.py
│   ├── migrations/
│   └── management/
│       └── commands/
│           └── seed_data.py
├── manage.py
├── requirements.txt
└── SETUP.md               ← you are here
```

---

## Django admin panel

Browse to **http://127.0.0.1:8000/admin/** and log in with `admin / admin123`
to manage all content through the built-in admin interface.
