# 🚀 GitHub to VPS Deployment Guide

Complete guide to deploy from GitHub to your VPS with PM2.

---

## 📋 PART 1: Push to GitHub (Run on Local Machine)

### Step 1: Initialize Git and Push to GitHub

```bash
# Navigate to project directory
cd "c:\Users\Pc\Music\Lustnode website\aternos-dashboard"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Aternos Dashboard"

# Add remote repository
git remote add origin https://github.com/princekop/aternos-dash.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### If you get authentication errors:
```bash
# Use personal access token instead of password
# Generate token at: https://github.com/settings/tokens
# Then push with:
git push -u origin main
```

---

## 🖥️ PART 2: Deploy on VPS (Run on VPS)

### Prerequisites on VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x

# Install PM2 globally
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Git (if not installed)
sudo apt install -y git
```

---

## 📦 PART 3: Clone and Setup Application

### Step 1: Create Directory and Clone

```bash
# Create application directory
sudo mkdir -p /var/www/aternos-dashboard
sudo chown -R $USER:$USER /var/www/aternos-dashboard

# Navigate to directory
cd /var/www/aternos-dashboard

# Clone from GitHub
git clone https://github.com/princekop/aternos-dash.git .

# Verify files
ls -la
```

### Step 2: Setup Database

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user (in PostgreSQL prompt)
CREATE DATABASE aternos_dashboard;
CREATE USER aternos_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE aternos_dashboard TO aternos_user;
ALTER DATABASE aternos_dashboard OWNER TO aternos_user;
\q
```

### Step 3: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file
nano .env
```

**Update these values in .env:**
```env
# Database (REQUIRED - update with your password)
DATABASE_URL="postgresql://aternos_user:your_secure_password_here@localhost:5432/aternos_dashboard"

# NextAuth (REQUIRED - generate new secret)
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="http://your-domain.com"

# Pterodactyl Panel (REQUIRED - your panel details)
PTERODACTYL_URL="https://your-panel.com"
PTERODACTYL_API_KEY="your-pterodactyl-api-key"

# Public URLs
NEXT_PUBLIC_PTERO_PANEL_URL="https://your-panel.com"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 4: Install Dependencies and Build

```bash
# Install dependencies
npm ci

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build the application
npm run build

# Create logs directory
mkdir -p logs
```

---

## 🚀 PART 4: Start with PM2

### Option A: Using the Deploy Script (Recommended)

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Option B: Manual PM2 Start

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Copy and run the command PM2 outputs
# It will look something like:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u username --hp /home/username

# Save again after setup
pm2 save
```

### Step 5: Verify Application is Running

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs aternos-dashboard --lines 50

# Monitor resources
pm2 monit
```

**Your app should now be running on:** `http://your-vps-ip:3000`

---

## 🌐 PART 5: Setup Nginx Reverse Proxy (Optional)

### Install and Configure Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/aternos-dashboard
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/aternos-access.log;
    error_log /var/log/nginx/aternos-error.log;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**Enable the site:**
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/aternos-dashboard /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# If test passes, restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Setup SSL (Free HTTPS with Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 🔒 PART 6: Security & Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check firewall status
sudo ufw status

# Secure .env file
chmod 600 .env
```

---

## 🔄 PART 7: Update/Redeploy Process

When you make changes and want to update the VPS:

```bash
# On VPS, navigate to app directory
cd /var/www/aternos-dashboard

# Pull latest changes
git pull origin main

# Install any new dependencies
npm ci

# Run new migrations
npx prisma migrate deploy

# Rebuild application
npm run build

# Reload with PM2 (zero downtime)
pm2 reload aternos-dashboard

# Or use the deploy script
./deploy.sh
```

---

## 📊 Useful PM2 Commands

```bash
# View status of all apps
pm2 status

# View logs (live)
pm2 logs aternos-dashboard

# View last 100 log lines
pm2 logs aternos-dashboard --lines 100

# Monitor CPU/Memory
pm2 monit

# Restart application
pm2 restart aternos-dashboard

# Reload (zero-downtime)
pm2 reload aternos-dashboard

# Stop application
pm2 stop aternos-dashboard

# Delete from PM2
pm2 delete aternos-dashboard

# Show detailed info
pm2 show aternos-dashboard
```

---

## 🐛 Troubleshooting

### Application won't start

```bash
# Check PM2 logs
pm2 logs aternos-dashboard --err

# Check if port 3000 is already in use
sudo lsof -i :3000

# Check .env file
cat .env

# Verify database connection
psql -U aternos_user -d aternos_dashboard -h localhost
```

### Database connection failed

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check DATABASE_URL in .env
grep DATABASE_URL .env
```

### Can't access from browser

```bash
# Check if app is running
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### High memory usage

```bash
# Reduce PM2 instances
pm2 scale aternos-dashboard 2

# Or restart
pm2 restart aternos-dashboard
```

---

## ✅ Deployment Checklist

**Local Machine:**
- [ ] Code pushed to GitHub successfully

**VPS Prerequisites:**
- [ ] Node.js 20+ installed
- [ ] PM2 installed globally
- [ ] PostgreSQL installed and running
- [ ] Git installed

**VPS Setup:**
- [ ] Repository cloned to `/var/www/aternos-dashboard`
- [ ] Database created (aternos_dashboard)
- [ ] Database user created (aternos_user)
- [ ] `.env` file configured with correct values
- [ ] Dependencies installed (`npm ci`)
- [ ] Prisma client generated
- [ ] Database migrations run
- [ ] Application built successfully
- [ ] PM2 started application
- [ ] PM2 startup configured
- [ ] Application accessible on port 3000

**Optional (Production):**
- [ ] Nginx installed and configured
- [ ] SSL certificate installed
- [ ] Firewall configured (UFW)
- [ ] Domain pointed to VPS IP
- [ ] Application accessible via domain

---

## 🎯 Quick Command Reference

**First Time Setup:**
```bash
cd /var/www/aternos-dashboard
git clone https://github.com/princekop/aternos-dash.git .
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

**Updates:**
```bash
cd /var/www/aternos-dashboard
git pull
npm ci
npx prisma migrate deploy
npm run build
pm2 reload aternos-dashboard
```

---

## 🎉 Success!

Your Aternos Dashboard is now deployed and running on your VPS!

- **Without Nginx:** `http://your-vps-ip:3000`
- **With Nginx:** `http://your-domain.com`
- **With SSL:** `https://your-domain.com`

For help, check the logs:
```bash
pm2 logs aternos-dashboard
```
