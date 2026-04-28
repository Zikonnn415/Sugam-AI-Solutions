#!/bin/bash

echo "Starting AI-Solution Project on Localhost..."
echo

echo "Starting Backend Server..."
cd backend
gnome-terminal --title="Backend Server" -- bash -c "python manage.py runserver 127.0.0.1:8000; exec bash" 2>/dev/null || xterm -title "Backend Server" -e "python manage.py runserver 127.0.0.1:8000" &
sleep 3

echo "Starting Frontend Server..."
cd ../frontend/Website
gnome-terminal --title="Frontend Server" -- bash -c "npm run dev; exec bash" 2>/dev/null || xterm -title "Frontend Server" -e "npm run dev" &
sleep 2

echo
echo "========================================"
echo "AI-Solution Project Started Successfully!"
echo "========================================"
echo
echo "Backend API: http://127.0.0.1:8000/api/"
echo "Frontend: http://localhost:5173"
echo "Admin Panel: http://127.0.0.1:8000/admin/"
echo
echo "Press any key to exit..."
read -n 1
