#!/usr/bin/env bash
# =============================================================================
# 🚀 Production Deployment Script
# =============================================================================
# Usage: ./scripts/deploy.sh [all|frontend|backend]
# Run this script on the VPS to deploy the latest version.
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
APP_DIR="/opt/covid-19-tracker"
COMPOSE_FILE="docker-compose.yml"
LOG_FILE="/var/log/covid19-deploy.log"
BACKUP_DIR="/opt/backups/covid-19-tracker"
DEPLOY_TARGET="${1:-all}"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
log() {
  local msg="[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] $1"
  echo "$msg"
  echo "$msg" >> "$LOG_FILE" 2>/dev/null || true
}

error_exit() {
  log "❌ ERROR: $1"
  exit 1
}

# ---------------------------------------------------------------------------
# Pre-flight checks
# ---------------------------------------------------------------------------
log "========================================="
log "🚀 Deployment Started — Target: ${DEPLOY_TARGET}"
log "========================================="

# Ensure we're in the right directory
cd "$APP_DIR" || error_exit "Cannot access $APP_DIR"

# Check Docker is running
docker info > /dev/null 2>&1 || error_exit "Docker is not running"

# ---------------------------------------------------------------------------
# Pull latest code
# ---------------------------------------------------------------------------
log "📥 Pulling latest code from Git..."
git fetch origin main
git reset --hard origin/main

# ---------------------------------------------------------------------------
# Deploy based on target
# ---------------------------------------------------------------------------
deploy_backend() {
  log "🖥️  Deploying backend..."

  # Pull latest image or rebuild
  docker compose pull backend 2>/dev/null || \
    docker compose build --no-cache backend

  # Restart with zero-downtime (recreate only the backend)
  docker compose up -d --force-recreate --no-deps backend

  # Wait for health check
  log "⏳ Waiting for backend health check..."
  local retries=30
  for i in $(seq 1 $retries); do
    if docker compose exec -T backend wget -qO- http://localhost:8080/actuator/health 2>/dev/null | grep -q '"UP"'; then
      log "✅ Backend is healthy!"
      return 0
    fi
    log "  Attempt $i/$retries..."
    sleep 5
  done

  log "⚠️  Backend health check timed out — check logs:"
  docker compose logs --tail=30 backend
}

deploy_frontend() {
  log "🌐 Deploying frontend..."

  docker compose build --no-cache frontend
  docker compose up -d --force-recreate --no-deps frontend

  sleep 5
  if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    log "✅ Frontend is live!"
  else
    log "⚠️  Frontend may still be starting..."
  fi
}

case "$DEPLOY_TARGET" in
  all)
    deploy_backend
    deploy_frontend
    ;;
  backend)
    deploy_backend
    ;;
  frontend)
    deploy_frontend
    ;;
  *)
    error_exit "Unknown target: $DEPLOY_TARGET (use: all, frontend, backend)"
    ;;
esac

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------
log "🧹 Cleaning up unused Docker resources..."
docker image prune -f
docker container prune -f
docker volume prune -f --filter "label!=keep"

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
log "========================================="
log "✅ Deployment Complete!"
log "========================================="

# Show running containers
docker compose ps
