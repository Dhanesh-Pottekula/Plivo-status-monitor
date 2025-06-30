#!/bin/bash

echo "🚀 Starting Plivo Backend Services..."

# Trap signals to shut down gracefully
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $DJANGO_PID $WS_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start WebSocket server in background
echo "📡 Starting WebSocket server..."
python3 ws_server.py &
WS_PID=$!

# Wait a bit to avoid race conditions
sleep 2

# Start Django server using Render's assigned port
echo "🌐 Starting Django server..."
PORT=${PORT:-8000}
python3 manage.py runserver 0.0.0.0:$PORT &
DJANGO_PID=$!

echo "✅ Both servers started!"
echo "   - Django: http://0.0.0.0:$PORT"
echo "   - WebSocket: ws://localhost:8765"
echo "   - Internal: localhost:9000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes to finish
wait $DJANGO_PID $WS_PID
