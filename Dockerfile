FROM node:24-bullseye-slim

# Install pnpm and system dependencies for canvas and sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    curl \
    && npm install -g pnpm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Ensure an empty .env exists so 'node --env-file=.env' doesn't crash if it's missing
RUN touch .env

# Build the frontend (Vite -> dist/)
RUN pnpm run build

# Expose the backend port
EXPOSE 3000

# Default command (can be overridden)
CMD ["pnpm", "run", "server"]