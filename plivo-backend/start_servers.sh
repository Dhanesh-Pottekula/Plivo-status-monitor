#!/bin/bash

# Start both Django and WebSocket servers
echo "🚀 Starting Plivo Backend Services..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $DJANGO_PID $WS_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start WebSocket server in background
echo "📡 Starting WebSocket server..."
source venv/bin/activate
python3 ws_server.py &
WS_PID=$!

# Wait a moment for WebSocket server to start
sleep 2

# Start Django server
echo "🌐 Starting Django server..."
python3 manage.py runserver &
DJANGO_PID=$!

echo "✅ Both servers started!"
echo "   - Django: http://localhost:8000"
echo "   - WebSocket: ws://localhost:8765"
echo "   - Internal: localhost:9000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait 