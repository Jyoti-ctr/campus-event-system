#!/bin/bash

# Campus Events Management System Startup Script

echo "=========================================="
echo "  Campus Events Management System"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Install Python dependencies if needed
echo "Installing Python dependencies..."
cd backend
pip install -q -r requirements.txt

# Seed the database
echo "Seeding database with sample data..."
python3 seed_data.py

# Start Flask backend in background
echo "Starting Flask backend on http://localhost:5000..."
python3 app.py &
BACKEND_PID=$!

cd ..

# Wait for backend to start
sleep 2

echo ""
echo "=========================================="
echo "  Backend running at: http://localhost:5000"
echo "  API endpoints: http://localhost:5000/api"
echo "=========================================="
echo ""

# Keep the script running
echo "Press Ctrl+C to stop the server"
trap "kill $BACKEND_PID; exit" INT
wait $BACKEND_PID
