@echo off
echo Starting AI-Solution Project on Localhost...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "python manage.py runserver 127.0.0.1:8000"
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
cd ..\frontend\Website
start "Frontend Server" cmd /k "npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo AI-Solution Project Started Successfully!
echo ========================================
echo.
echo Backend API: http://127.0.0.1:8000/api/
echo Frontend: http://localhost:5173
echo Admin Panel: http://127.0.0.1:8000/admin/
echo.
echo Press any key to exit...
pause >nul
