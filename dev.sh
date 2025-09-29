#!/bin/bash

# Development script for running the application with live reload
echo "🚀 Starting development environment with live reload..."

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file with default values..."
    cat > .env << EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=simstudio
POSTGRES_PORT=5432
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_auth_secret_here_change_this_in_production
ENCRYPTION_KEY=your_encryption_key_here_change_this_in_production
NEXT_PUBLIC_SOCKET_URL=http://localhost:3002
EOF
    echo "✅ .env file created with default values"
fi

# Run the development environment
echo "🐳 Starting Docker containers..."
docker-compose -f docker-compose.dev.yml up -d --build

echo "✅ Development environment is running!"
echo "🌐 Application: http://localhost:3000"
echo "🔌 Socket server: http://localhost:3002"
echo "🗄️  Database: localhost:5432"
echo ""
echo "📝 To stop the environment, run: docker-compose -f docker-compose.dev.yml down"
echo "🔄 To restart with rebuild: docker-compose -f docker-compose.dev.yml up -d --build"
