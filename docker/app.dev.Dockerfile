# ========================================
# Development Dockerfile for Live Reload
# ========================================
FROM oven/bun:alpine

# Install system dependencies
RUN apk add --no-cache libc6-compat wget

# Install turbo globally
RUN bun install -g turbo

WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lock ./
COPY apps/sim/package.json ./apps/sim/package.json

# Install dependencies (including dev dependencies for development)
RUN bun install

# Copy the entire project
COPY . .

# Install additional dependencies that might be needed
RUN bun install

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV VERCEL_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Set the default command to run the development server
CMD ["bun", "run", "dev", "--port", "3000", "--hostname", "0.0.0.0"]
