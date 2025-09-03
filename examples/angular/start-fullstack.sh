#!/bin/bash

# Start TodoMVC Full-Stack Application
echo "🚀 Starting TodoMVC Full-Stack Application..."

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set up signal handlers for graceful shutdown
trap cleanup SIGINT SIGTERM

# Start backend server
echo "📦 Starting backend server on port 3000..."
cd backend
npm start &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 2

# Return to main directory and start frontend
cd ..
echo "🅰️ Starting Angular frontend on port 4200..."
npm start &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Services started successfully!"
echo "🌐 Frontend: http://localhost:4200"
echo "🔗 Backend API: http://localhost:3000/api"
echo "📊 Health check: http://localhost:3000/api/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait