# 🚀 CI/CD Pipeline — COVID-19 Tracker

Complete DevOps setup for the COVID-19 Tracker full-stack application using **GitHub Actions**, **Docker**, and **Ubuntu VPS** deployment.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Pipeline Workflows](#pipeline-workflows)
- [Quick Start](#quick-start)
- [GitHub Secrets Setup](#github-secrets-setup)
- [VPS Server Setup](#vps-server-setup)
- [Docker Commands Reference](#docker-commands-reference)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│                                                             │
│  Push/PR to main ──► GitHub Actions                         │
│                        │                                    │
│              ┌─────────┴─────────┐                          │
│              ▼                   ▼                           │
│     frontend-ci.yml      backend-ci.yml                     │
│     ┌───────────┐        ┌────────────┐                     │
│     │ Lint      │        │ Build      │                     │
│     │ Build     │        │ Test       │                     │
│     │ Artifact  │        │ Docker Push│                     │
│     └─────┬─────┘        └──────┬─────┘                     │
│           └──────────┬──────────┘                           │
│                      ▼                                      │
│               deploy.yml                                    │
│        ┌──────────────────────┐                             │
│        │  SSH → Ubuntu VPS    │                             │
│        │  docker compose up   │                             │
│        └──────────────────────┘                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────── Ubuntu VPS ──────────────────┐
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ Frontend │  │ Backend  │  │ PostgreSQL│ │
│  │ (Nginx)  │◄─┤ (Spring  │◄─┤           │ │
│  │ :3000    │  │  Boot)   │  │  :5432    │ │
│  │          │  │  :8080   │  │           │ │
│  └──────────┘  └──────────┘  └───────────┘ │
│           Docker Compose Network            │
└─────────────────────────────────────────────┘
```

---

## Pipeline Workflows

### 1. `frontend-ci.yml` — Frontend Pipeline

| Job | Description | Trigger |
|-----|-------------|---------|
| **Lint** | ESLint static analysis | Push/PR to `main` (frontend files) |
| **Build** | Vite production build | After lint passes |
| **Deploy** | Deploy to VPS via SSH | Push to `main` only |

### 2. `backend-ci.yml` — Backend Pipeline

| Job | Description | Trigger |
|-----|-------------|---------|
| **Build** | Maven compile + package JAR | Push/PR to `main` (backend files) |
| **Test** | Run tests with PostgreSQL service | After build passes |
| **Docker** | Build & push Docker image | Push to `main` only |

### 3. `deploy.yml` — Deployment Pipeline

| Job | Description | Trigger |
|-----|-------------|---------|
| **Pre-deploy** | Determine targets | After CI success / manual |
| **Deploy Backend** | SSH → rebuild Docker container | Conditional |
| **Deploy Frontend** | SSH → rebuild Docker container | Conditional |
| **Post-deploy** | Verification report | Always |

---

## Quick Start

### 1. Clone and configure

```bash
git clone <your-repo-url>
cd covid-19-tracker

# Create environment file
cp .env.example .env
nano .env  # Fill in your values
```

### 2. Run locally with Docker

```bash
# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### 3. Access the application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

---

## GitHub Secrets Setup

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Required Secrets

| Secret | Description | Example |
|--------|-------------|---------|
| `DOCKERHUB_USERNAME` | Docker Hub username | `johndoe` |
| `DOCKERHUB_TOKEN` | Docker Hub access token | `dckr_pat_xxx` |
| `VPS_HOST` | Server IP address | `203.0.113.50` |
| `VPS_USERNAME` | SSH username | `deploy` |
| `VPS_SSH_KEY` | Private SSH key (full content) | `-----BEGIN OPENSSH...` |
| `VPS_SSH_PORT` | SSH port | `22` |

### Optional Secrets (for Vercel/Netlify)

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel deployment token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `NETLIFY_AUTH_TOKEN` | Netlify auth token |
| `NETLIFY_SITE_ID` | Netlify site ID |

### How to generate a Docker Hub token

1. Go to [Docker Hub](https://hub.docker.com) → Account Settings → Security
2. Click **New Access Token**
3. Name: `github-actions`, Permissions: **Read & Write**
4. Copy the token and add as `DOCKERHUB_TOKEN`

### How to generate an SSH key for deployment

```bash
# Generate a dedicated deploy key (on your local machine)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key -N ""

# Copy the PUBLIC key to your VPS
ssh-copy-id -i ~/.ssh/deploy_key.pub deploy@your-server-ip

# Copy the PRIVATE key content — paste as VPS_SSH_KEY secret
cat ~/.ssh/deploy_key
```

---

## VPS Server Setup

### First-time setup

```bash
# Upload and run the setup script on your VPS
scp scripts/setup-server.sh root@your-server:/tmp/
ssh root@your-server 'bash /tmp/setup-server.sh'
```

The script automatically:
- ✅ Updates system packages
- ✅ Installs Docker & Docker Compose
- ✅ Creates a `deploy` user with Docker access
- ✅ Configures UFW firewall (ports 22, 80, 443, 3000, 8080)
- ✅ Sets up SSH directory structure
- ✅ Configures 2GB swap
- ✅ Creates app directory at `/opt/covid-19-tracker`

### After setup

```bash
# SSH as deploy user
ssh deploy@your-server

# Clone the repository
cd /opt/covid-19-tracker
git clone <your-repo-url> .

# Create .env and start
cp .env.example .env
nano .env
docker compose up -d
```

### Recommended VPS specs

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 2 GB | 4 GB |
| Storage | 20 GB SSD | 40 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |

---

## Docker Commands Reference

### Basic operations

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart a specific service
docker compose restart backend

# Rebuild and restart
docker compose up -d --build

# Force recreate containers
docker compose up -d --force-recreate
```

### Logs

```bash
# Follow all logs
docker compose logs -f

# Logs for specific service
docker compose logs -f backend

# Last 100 lines
docker compose logs --tail=100 backend
```

### Debugging

```bash
# Enter a running container
docker compose exec backend sh

# Check container health
docker inspect --format='{{.State.Health.Status}}' covid19-backend

# View resource usage
docker stats

# List all containers
docker ps -a
```

### Cleanup

```bash
# Remove unused images
docker image prune -f

# Remove all unused resources
docker system prune -f

# Remove unused volumes (⚠️ destroys data)
docker volume prune -f

# Nuclear option — remove everything
docker system prune -a --volumes -f
```

---

## Deployment Guide

### Automatic Deployment (via GitHub Actions)

1. Push code to `main` branch
2. CI pipelines run automatically (lint → build → test → docker)
3. On success, `deploy.yml` triggers automatically
4. Backend & frontend containers are rebuilt on VPS

### Manual Deployment

#### Option 1: GitHub Actions UI
1. Go to **Actions** → **Deploy to Production**
2. Click **Run workflow**
3. Select target: `all`, `frontend`, or `backend`
4. Click **Run**

#### Option 2: SSH into VPS

```bash
ssh deploy@your-server
cd /opt/covid-19-tracker
bash scripts/deploy.sh all      # Deploy everything
bash scripts/deploy.sh backend  # Backend only
bash scripts/deploy.sh frontend # Frontend only
```

### Deployment flow

```
1. SSH into server
2. git pull origin main
3. docker compose build <service>
4. docker compose up -d --force-recreate <service>
5. Health check verification
6. docker image prune -f  (cleanup)
```

---

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker compose logs backend

# Common issues:
# 1. Database not ready — backend depends on postgres health check
# 2. Wrong DB credentials — check .env file
# 3. Port conflict — check if 8080 is already in use
sudo lsof -i :8080
```

### Frontend shows blank page

```bash
# Check if nginx is serving files
docker compose exec frontend ls /usr/share/nginx/html

# Check nginx logs
docker compose logs frontend

# Rebuild frontend
docker compose up -d --build frontend
```

### Database connection refused

```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check health
docker inspect --format='{{.State.Health.Status}}' covid19-postgres

# Connect to PostgreSQL directly
docker compose exec postgres psql -U postgres -d covid19
```

### GitHub Actions workflow fails

1. Go to **Actions** tab → click the failed run
2. Expand the failed step to see error logs
3. Common issues:
   - **Missing secrets**: Ensure all required secrets are set
   - **Docker Hub auth**: Regenerate token if expired
   - **SSH connection**: Verify VPS_HOST, VPS_SSH_KEY, VPS_SSH_PORT

### Docker image too large

```bash
# Check image sizes
docker images | grep covid

# Multi-stage builds already minimize size
# Backend: ~200MB (JRE Alpine)
# Frontend: ~25MB (Nginx Alpine)
```

### Out of disk space on VPS

```bash
# Check disk usage
df -h

# Clean Docker resources
docker system prune -a -f

# Check what's using space
du -sh /var/lib/docker/*
```

---

## 📁 File Structure

```
covid-19-tracker/
├── .github/
│   └── workflows/
│       ├── frontend-ci.yml      ← Frontend CI pipeline
│       ├── backend-ci.yml       ← Backend CI pipeline
│       └── deploy.yml           ← Production deployment
├── scripts/
│   ├── deploy.sh                ← Server deployment script
│   └── setup-server.sh          ← VPS initial setup
├── frontend/
│   ├── Dockerfile               ← Frontend Docker (Nginx)
│   ├── nginx.conf               ← Nginx reverse proxy
│   ├── eslint.config.js         ← ESLint configuration
│   └── package.json             ← Updated with lint scripts
├── Dockerfile                   ← Backend Docker (Spring Boot)
├── docker-compose.yml           ← Full-stack orchestration
├── .env.example                 ← Environment template
├── .gitignore                   ← Updated with .env patterns
├── .dockerignore                ← Docker build exclusions
├── CICD_README.md               ← This documentation
└── src/main/resources/
    └── application.yml          ← Externalized secrets
```

---

## 🔒 Security Checklist

- [x] No hardcoded secrets in source code
- [x] Environment variables via `.env` / GitHub Secrets
- [x] Non-root Docker containers
- [x] SSH key-based authentication for deployments
- [x] Docker health checks for all services
- [x] `.env` files excluded from Git
- [x] JVM security flags enabled
- [x] Firewall configured (UFW)

---

> **Created with ❤️ for the COVID-19 Tracker project**
