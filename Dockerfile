FROM node:24-bullseye-slim

# Install pnpm and system dependencies for canvas and sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
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

# Default ports
EXPOSE 3000 7600

# The command is overridden in docker-compose.yml
CMD ["pnpm", "run", "server"]
