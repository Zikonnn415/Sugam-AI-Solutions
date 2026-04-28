# Local Development Setup Guide

This guide will help you set up and run the AI-Solution project locally for development using XAMPP or similar local server environment.

## Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- Git
- XAMPP (for local server environment) - Optional but recommended

## Quick Start

### Option 1: Using the provided scripts

**Windows:**
```bash
# Make sure you're in the project root directory
run_local.bat
```

**Linux/Mac:**
```bash
# Make sure you're in the project root directory
chmod +x run_local.sh
./run_local.sh
```

### Option 2: Manual setup

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Seed demo data (optional):**
   ```bash
   python manage.py seed_demo
   ```

7. **Start the backend server:**
   ```bash
   python manage.py runserver
   ```

   The backend will be available at: http://localhost:8000

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at: http://localhost:5173

## Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/ (requires superuser account)
- **Django Admin**: http://127.0.0.1:8000/admin/ (alternative URL)

## XAMPP Integration (Optional)

If you're using XAMPP, you can also serve the project through Apache:

1. **Copy the project to XAMPP htdocs**:
   ```bash
   # Copy the entire project to C:\xampp\htdocs\PD_assignment
   ```

2. **Configure Apache Virtual Host** (optional):
   - Edit `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
   - Add virtual host configuration for the project

3. **Access via XAMPP**:
   - Frontend: http://localhost/PD_assignment/frontend/Website/
   - Backend: http://localhost:8000/ (still runs on Django dev server)

## Default Admin Credentials

If you created a superuser, use those credentials. Otherwise, you can create one with:
```bash
cd backend
python manage.py createsuperuser
```

## Project Structure

```
PD_assignment/
├── backend/                 # Django backend
│   ├── config/             # Django settings
│   ├── inquiries/          # Main app
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # React frontend
│   └── Website/
│       ├── src/
│       ├── package.json
│       └── vite.config.js
├── run_local.bat          # Windows startup script
├── run_local.sh           # Linux/Mac startup script
└── README.md
```

## Common Issues and Solutions

### Backend Issues

1. **Port already in use:**
   ```bash
   # Kill process using port 8000
   # Windows
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F

   # Linux/Mac
   lsof -ti:8000 | xargs kill -9
   ```

2. **Database issues:**
   ```bash
   # Reset database
   rm db.sqlite3
   python manage.py migrate
   ```

3. **Dependencies issues:**
   ```bash
   # Reinstall dependencies
   pip install -r requirements.txt --force-reinstall
   ```

4. **CORS issues:**
   ```bash
   # Make sure CORS is properly configured in settings.py
   # Check that frontend URL is in CORS_ALLOWED_ORIGINS
   ```

5. **Static files not loading:**
   ```bash
   # Collect static files
   python manage.py collectstatic
   ```

### Frontend Issues

1. **Port already in use:**
   ```bash
   # Kill process using port 5173
   # Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F

   # Linux/Mac
   lsof -ti:5173 | xargs kill -9
   ```

2. **Node modules issues:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build issues:**
   ```bash
   # Clear Vite cache
   rm -rf .vite
   npm run dev
   ```

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **API Testing**: Use the admin panel or tools like Postman to test API endpoints
3. **Database**: SQLite is used by default for development (no additional setup required)
4. **Logs**: Check console output for both servers for debugging information

## Stopping the Servers

- **Using scripts**: Press Ctrl+C in the terminal
- **Manual**: Close the terminal windows or use Ctrl+C in each server terminal

## Next Steps

1. Explore the admin panel at http://localhost:8000/admin/
2. Test the contact form on the frontend
3. Check the API endpoints at http://localhost:8000/api/
4. Review the code structure and make your own modifications

## Support

If you encounter any issues:
1. Check the console output for error messages
2. Ensure all dependencies are installed correctly
3. Verify that ports 8000 and 5173 are available
4. Check the troubleshooting section above

Happy coding! 🚀
