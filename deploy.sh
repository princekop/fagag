#!/bin/bash

# Aternos Dashboard - Quick Deployment Script
# Usage: ./deploy.sh

echo "🚀 Starting Aternos Dashboard Deployment..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

# Step 1: Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm ci --production
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Generate Prisma Client
echo -e "${BLUE}🗄️  Generating Prisma Client...${NC}"
npx prisma generate
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to generate Prisma Client${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Prisma Client generated${NC}"
echo ""

# Step 3: Run database migrations
echo -e "${BLUE}🔄 Running database migrations...${NC}"
npx prisma migrate deploy
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to run migrations${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Migrations completed${NC}"
echo ""

# Step 4: Create logs directory
echo -e "${BLUE}📁 Creating logs directory...${NC}"
mkdir -p logs
echo -e "${GREEN}✓ Logs directory created${NC}"
echo ""

# Step 5: Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}PM2 is not installed. Installing globally...${NC}"
    sudo npm install -g pm2
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install PM2. Please install manually: sudo npm install -g pm2${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ PM2 is installed${NC}"
echo ""

# Step 6: Check if app is already running
echo -e "${BLUE}🔍 Checking if app is already running...${NC}"
if pm2 describe aternos-dashboard &> /dev/null; then
    echo -e "${BLUE}App is running. Reloading...${NC}"
    pm2 reload ecosystem.config.js --env production
else
    echo -e "${BLUE}Starting app with PM2...${NC}"
    pm2 start ecosystem.config.js --env production
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to start/reload app${NC}"
    exit 1
fi
echo -e "${GREEN}✓ App started successfully${NC}"
echo ""

# Step 7: Save PM2 process list
echo -e "${BLUE}💾 Saving PM2 process list...${NC}"
pm2 save
echo -e "${GREEN}✓ PM2 process list saved${NC}"
echo ""

# Step 8: Show status
echo -e "${BLUE}📊 Application Status:${NC}"
pm2 status
echo ""

# Step 9: Show logs
echo -e "${BLUE}📋 Recent Logs:${NC}"
pm2 logs aternos-dashboard --lines 20 --nostream
echo ""

# Success message
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "View logs:        ${BLUE}pm2 logs aternos-dashboard${NC}"
echo -e "Monitor:          ${BLUE}pm2 monit${NC}"
echo -e "Restart:          ${BLUE}pm2 restart aternos-dashboard${NC}"
echo -e "Stop:             ${BLUE}pm2 stop aternos-dashboard${NC}"
echo ""
echo -e "${GREEN}Your app is now running! 🚀${NC}"
