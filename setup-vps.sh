#!/bin/bash

# 🚀 LustNode VPS Setup Script
# This script automates the deployment process on a fresh VPS

set -e  # Exit on error

echo "🚀 Starting LustNode VPS Setup..."
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
  echo -e "${RED}❌ Please don't run as root. Use a regular user with sudo privileges.${NC}"
  exit 1
fi

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo -e "${YELLOW}📦 Installing Node.js 20...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"

# Install PM2
echo -e "${YELLOW}📦 Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

echo -e "${GREEN}✅ PM2 version: $(pm2 --version)${NC}"

# Install PostgreSQL
echo -e "${YELLOW}📦 Installing PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

echo -e "${GREEN}✅ PostgreSQL installed${NC}"

# Install Nginx
echo -e "${YELLOW}📦 Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
fi

echo -e "${GREEN}✅ Nginx installed${NC}"

# Setup firewall
echo -e "${YELLOW}🔒 Setting up firewall...${NC}"
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp  # For direct access during setup

echo -e "${GREEN}✅ Firewall configured${NC}"

# Create application directory
APP_DIR="/var/www/lustnode"
echo -e "${YELLOW}📁 Creating application directory: $APP_DIR${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

echo -e "${GREEN}✅ Application directory created${NC}"

# Setup database
echo -e "${YELLOW}🗄️  Setting up database...${NC}"
echo -e "${YELLOW}Please enter database name (default: lustnode_db):${NC}"
read -r DB_NAME
DB_NAME=${DB_NAME:-lustnode_db}

echo -e "${YELLOW}Please enter database user (default: lustnode_user):${NC}"
read -r DB_USER
DB_USER=${DB_USER:-lustnode_user}

echo -e "${YELLOW}Please enter database password:${NC}"
read -rs DB_PASS

# Create database and user
sudo -u postgres psql <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\q
EOF

echo -e "${GREEN}✅ Database created${NC}"

# Create .env template
echo -e "${YELLOW}📝 Creating .env template...${NC}"
cat > $APP_DIR/.env.template <<EOF
NODE_ENV=production
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=CHANGE_ME_$(openssl rand -base64 32)
PTERO_PANEL_URL=https://your-panel.com
PTERO_API_KEY=your_api_key
PTERO_CLIENT_API_KEY=your_client_api_key
NEXT_PUBLIC_PTERO_PANEL_URL=https://your-panel.com
PTERO_CRED_KEY=$(openssl rand -base64 32 | cut -c1-32)
EOF

echo -e "${GREEN}✅ .env template created at $APP_DIR/.env.template${NC}"
echo -e "${YELLOW}⚠️  Please edit this file and rename to .env${NC}"

# Install Certbot for SSL
echo -e "${YELLOW}🔒 Installing Certbot for SSL...${NC}"
sudo apt install -y certbot python3-certbot-nginx

echo -e "${GREEN}✅ Certbot installed${NC}"

# Final instructions
echo -e "${GREEN}"
echo "================================="
echo "✅ VPS Setup Complete!"
echo "================================="
echo -e "${NC}"
echo "Next steps:"
echo "1. Clone your repository to $APP_DIR"
echo "2. Edit $APP_DIR/.env.template and rename to .env"
echo "3. Run: cd $APP_DIR && npm ci"
echo "4. Run: npx prisma generate && npx prisma migrate deploy"
echo "5. Run: npm run build"
echo "6. Run: pm2 start ecosystem.config.js --env production"
echo "7. Run: pm2 save && pm2 startup"
echo "8. Setup Nginx reverse proxy"
echo "9. Get SSL certificate: sudo certbot --nginx -d your-domain.com"
echo ""
echo -e "${YELLOW}Database Connection String:${NC}"
echo "postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
