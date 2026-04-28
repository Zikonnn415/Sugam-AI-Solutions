# AI-Solution Prototype (React + Django)

A demo promotional website for a fictitious startup, AI-Solution. Built with React (Vite + Tailwind) and Django (DRF). Includes a Contact form that persists to SQLite and an admin dashboard protected by token login.

## Features
- Public pages: Home, Services, Past Works, Testimonials, Articles, Events, Contact
- Contact form: name, email, phone, company, country, job title, job details
- Persists inquiries to SQLite via Django REST API
- Admin dashboard: shows total inquiries and lists submissions (requires login token)
- Django Admin for full CRUD at `/admin`

## Prerequisites
- Python 3.12+
- Node.js 18+

## Backend (Django) - Local Setup
1. Open a terminal at `backend/`.
2. Create and activate venv if not already (Windows PowerShell):
   ```powershell
   python -m venv venv
   ./venv/Scripts/Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   pip install django djangorestframework django-cors-headers
   ```
   Note: DRF token auth is enabled via `rest_framework.authtoken` in settings; the built-in app will be migrated automatically.
4. Run migrations:
   ```powershell
   python manage.py migrate
   ```
5. Create an admin user:
   ```powershell
   python manage.py createsuperuser
   ```
6. Start the server:
   ```powershell
   python manage.py runserver
   ```
   API base: `http://127.0.0.1:8000/`

### API Endpoints
- POST `api/inquiries/` – submit contact form (public)
- GET `api/inquiries/` – list inquiries (requires token)
- GET `api/inquiries/count/` – total inquiries (public)
- POST `api/auth/login/` – login with `{ username, password }` to receive `{ token }`
- Django Admin: `http://127.0.0.1:8000/admin`

## Frontend (React) - Local Setup
1. Open a new terminal at `frontend/Website/`.
2. Install deps:
   ```powershell
   npm install
   ```
3. Start dev server:
   ```powershell
   npm run dev
   ```
4. Visit the app at the URL shown (typically `http://127.0.0.1:5173`).

### Admin Dashboard Usage
1. Go to `Admin` in the nav.
2. Login with the username/password created via `createsuperuser`.
3. The dashboard stores the token in localStorage. Click Logout to clear it.

## Notes
- CORS is enabled for local development and is permissive for demo purposes.
- Validation is implemented on the frontend (required fields) and enforced by Django model/serializer on the backend.
- Database is SQLite at `backend/db.sqlite3`.

## Scripts
- Backend: `python manage.py runserver`
- Frontend: `npm run dev`

## License
Academic demo only. Not production-ready.
