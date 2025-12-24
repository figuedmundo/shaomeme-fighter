# Deployment Guide (Ubuntu Home Lab)

This guide explains how to deploy **Shaomeme Fighter** to your Ubuntu server using Docker and your existing Caddy setup.

## Prerequisites

- **Docker** & **Docker Compose** installed.
- **Git** to clone the repository.
- **Existing Caddy Setup** connected to the `homelab_net` network.
- **Domain** (e.g., `shaomeme.yourdomain.com`) pointing to your home IP.

## 1. Setup on Server

SSH into your Ubuntu server and clone the repository (or pull the latest changes):

```bash
# Clone (if new)
git clone https://github.com/YOUR_USERNAME/shaomeme-fighter.git
cd shaomeme-fighter

# Or Pull (if existing)
git pull origin master
```

## 2. Start the Game (Production Mode)

Use the production compose file. This connects the game to your `homelab_net` network so Caddy can reach it internally on port 3000.

```bash
# Build and start in detached mode
docker compose -f docker-compose.prod.yml up -d --build
```

**Verify it's running:**

```bash
docker ps
# You should see 'shaomeme-fighter' with status 'Up (healthy)'
```

## 3. Update Caddyfile

Add the following to your existing `docker/caddy/Caddyfile`:

```caddyfile
# Shaomeme Fighter
{$SHAOMEME_DOMAIN} {
    reverse_proxy shaomeme-fighter:3000 {
        header_up Host {http.request.host}
        header_up X-Real-IP {remote_host}
    }
}
```

**Important:**

1. Add `SHAOMEME_DOMAIN=your-game-domain.com` to your existing Caddy `.env` file (where `CLOUDFLARE_EMAIL` is defined).
2. Reload Caddy: `docker compose restart caddy` (or `docker exec caddy caddy reload`).

## 4. Managing Photos

The game reads photos from the `photos/` directory on your server.

1.  Navigate to the project folder: `cd shaomeme-fighter`
2.  Create a city folder: `mkdir -p photos/taipei`
3.  Upload photos to `photos/taipei/`.
4.  **No restart needed!** The game detects them automatically.

## 5. Troubleshooting

**Check Logs:**

```bash
docker compose -f docker-compose.prod.yml logs -f
```

**Rebuild after Code Update:**

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```
