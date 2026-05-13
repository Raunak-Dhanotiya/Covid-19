#!/usr/bin/env bash
# =============================================================================
# 🛠️ VPS Initial Setup Script
# =============================================================================
# Run this ONCE on a fresh Ubuntu VPS to prepare it for deployment.
# Usage: sudo bash scripts/setup-server.sh
# =============================================================================

set -euo pipefail

APP_DIR="/opt/covid-19-tracker"
DEPLOY_USER="deploy"

echo "========================================="
echo "🛠️  VPS Setup for COVID-19 Tracker"
echo "========================================="

# ---------------------------------------------------------------------------
# 1. System updates
# ---------------------------------------------------------------------------
echo "📦 Updating system packages..."
apt-get update -y && apt-get upgrade -y

# ---------------------------------------------------------------------------
# 2. Install Docker
# ---------------------------------------------------------------------------
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  echo "✅ Docker installed."
else
  echo "✅ Docker already installed."
fi

# Install Docker Compose plugin
echo "🐳 Installing Docker Compose..."
apt-get install -y docker-compose-plugin 2>/dev/null || {
  COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d '"' -f4)
  curl -fsSL "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
}
echo "✅ Docker Compose installed."

# ---------------------------------------------------------------------------
# 3. Create deploy user
# ---------------------------------------------------------------------------
echo "👤 Creating deploy user..."
if ! id "$DEPLOY_USER" &>/dev/null; then
  useradd -m -s /bin/bash -G docker "$DEPLOY_USER"
  echo "✅ User '$DEPLOY_USER' created."
else
  usermod -aG docker "$DEPLOY_USER"
  echo "✅ User '$DEPLOY_USER' already exists, added to docker group."
fi

# ---------------------------------------------------------------------------
# 4. Setup SSH for deploy user
# ---------------------------------------------------------------------------
echo "🔐 Setting up SSH..."
DEPLOY_HOME="/home/$DEPLOY_USER"
mkdir -p "$DEPLOY_HOME/.ssh"
chmod 700 "$DEPLOY_HOME/.ssh"
touch "$DEPLOY_HOME/.ssh/authorized_keys"
chmod 600 "$DEPLOY_HOME/.ssh/authorized_keys"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_HOME/.ssh"
echo "⚠️  Add your public SSH key to: $DEPLOY_HOME/.ssh/authorized_keys"

# ---------------------------------------------------------------------------
# 5. Configure firewall (UFW)
# ---------------------------------------------------------------------------
echo "🔥 Configuring firewall..."
apt-get install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (frontend)
ufw allow 443/tcp   # HTTPS
ufw allow 3000/tcp  # Frontend (dev)
ufw allow 8080/tcp  # Backend API
echo "y" | ufw enable
echo "✅ Firewall configured."

# ---------------------------------------------------------------------------
# 6. Create application directory
# ---------------------------------------------------------------------------
echo "📁 Creating application directory..."
mkdir -p "$APP_DIR"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR"
echo "✅ App directory: $APP_DIR"

# ---------------------------------------------------------------------------
# 7. Configure swap (2GB — helps small VPS instances)
# ---------------------------------------------------------------------------
echo "💾 Configuring swap..."
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo "/swapfile swap swap defaults 0 0" >> /etc/fstab
  echo "✅ 2GB swap configured."
else
  echo "✅ Swap already exists."
fi

# ---------------------------------------------------------------------------
# 8. Install useful tools
# ---------------------------------------------------------------------------
echo "🔧 Installing utilities..."
apt-get install -y git curl wget htop net-tools

# ---------------------------------------------------------------------------
# 9. Create log directory
# ---------------------------------------------------------------------------
mkdir -p /var/log
touch /var/log/covid19-deploy.log
chown "$DEPLOY_USER:$DEPLOY_USER" /var/log/covid19-deploy.log

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo "========================================="
echo "✅ VPS Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. Add SSH public key to: $DEPLOY_HOME/.ssh/authorized_keys"
echo "  2. Clone repo: cd $APP_DIR && git clone <repo-url> ."
echo "  3. Copy .env file: cp .env.example .env && nano .env"
echo "  4. Start services: docker compose up -d"
echo ""
