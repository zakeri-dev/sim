@echo off
echo 🚀 Starting development environment with live reload...

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ docker-compose not found. Please install Docker Compose.
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file with default values...
    (
        echo POSTGRES_USER=postgres
        echo POSTGRES_PASSWORD=postgres
        echo POSTGRES_DB=simstudio
        echo POSTGRES_PORT=5432
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000
        echo BETTER_AUTH_SECRET=your_auth_secret_here_change_this_in_production
        echo ENCRYPTION_KEY=your_encryption_key_here_change_this_in_production
        echo NEXT_PUBLIC_SOCKET_URL=http://localhost:3002
    ) > .env
    echo ✅ .env file created with default values
)

REM Run the development environment
echo 🐳 Starting Docker containers...
docker-compose -f docker-compose.dev.yml up -d --build

echo.
echo ✅ Development environment is running!
echo 🌐 Application: http://localhost:3000
echo 🔌 Socket server: http://localhost:3002
echo 🗄️  Database: localhost:5432
echo.
echo 📝 To stop the environment, run: docker-compose -f docker-compose.dev.yml down
echo 🔄 To restart with rebuild: docker-compose -f docker-compose.dev.yml up -d --build
pause
