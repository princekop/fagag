# 🚀 VPS Deployment Guide with PM2

## 📦 Files to Upload to VPS

### Upload these files/folders:
```
✅ .next/                    (entire production build folder)
✅ .next/standalone/         (standalone server files)
✅ public/                   (static assets - images, fonts, etc.)
✅ prisma/                   (database schema)
✅ .env                      (production environment variables)
✅ package.json              (dependencies)
✅ package-lock.json         (lock file)
✅ ecosystem.config.js       (PM2 configuration)
```

### Do NOT upload:
```
❌ node_modules/            (install fresh on VPS)
❌ src/                     (source code not needed)
❌ .git/                    (version control)
❌ .env.local               (local dev env)
❌ .next/cache/             (build cache)
```

---

## 🖥️ VPS Setup Commands

### 1. Connect to VPS
```bash
ssh user@your-vps-ip
```

### 2. Install Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 or later)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 globally
sudo npm install -g pm2

# Install PostgreSQL (if not already installed)
sudo apt install -y postgresql postgresql-contrib
```

### 3. Create Application Directory
```bash
# Create directory
sudo mkdir -p /var/www/aternos-dashboard
sudo chown -R $USER:$USER /var/www/aternos-dashboard
cd /var/www/aternos-dashboard
```

### 4. Upload Files to VPS

**Option A: Using SCP (from your local machine)**
```bash
# Upload entire project
scp -r .next user@your-vps-ip:/var/www/aternos-dashboard/
scp -r public user@your-vps-ip:/var/www/aternos-dashboard/
scp -r prisma user@your-vps-ip:/var/www/aternos-dashboard/
scp package*.json user@your-vps-ip:/var/www/aternos-dashboard/
scp .env user@your-vps-ip:/var/www/aternos-dashboard/
scp ecosystem.config.js user@your-vps-ip:/var/www/aternos-dashboard/
```

**Option B: Using Git (recommended)**
```bash
# Clone repository
git clone https://github.com/yourusername/aternos-dashboard.git /var/www/aternos-dashboard
cd /var/www/aternos-dashboard

# Build on server
npm ci
npm run build
```

**Option C: Using rsync**
```bash
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ user@your-vps-ip:/var/www/aternos-dashboard/
```

### 5. Setup on VPS
```bash
cd /var/www/aternos-dashboard

# Install dependencies (production only)
npm ci --production

# Setup Prisma
npx prisma generate
npx prisma migrate deploy

# Create logs directory
mkdir -p logs

# Setup environment variables
nano .env
# Copy your production .env content here
```

### 6. Configure PostgreSQL Database
```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE aternos_dashboard;
CREATE USER aternos_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE aternos_dashboard TO aternos_user;
\q

# Update DATABASE_URL in .env
# DATABASE_URL="postgresql://aternos_user:your_strong_password@localhost:5432/aternos_dashboard"
```

### 7. Start Application with PM2
```bash
# Start the app
pm2 start ecosystem.config.js --env production

# View logs
pm2 logs aternos-dashboard

# Monitor
pm2 monit

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs (usually starts with 'sudo')
```

---

## 🔧 PM2 Management Commands

```bash
# View status
pm2 status

# View logs
pm2 logs aternos-dashboard
pm2 logs aternos-dashboard --lines 100

# Restart application
pm2 restart aternos-dashboard

# Reload (zero-downtime restart)
pm2 reload aternos-dashboard

# Stop application
pm2 stop aternos-dashboard

# Delete from PM2
pm2 delete aternos-dashboard

# Monitor resources
pm2 monit

# Show detailed info
pm2 show aternos-dashboard
```

---

## 🔄 Update/Redeploy Process

```bash
# On local machine: Build
npm run build

# Upload new build to VPS (SCP method)
scp -r .next user@your-vps-ip:/var/www/aternos-dashboard/

# OR: On VPS (Git method)
cd /var/www/aternos-dashboard
git pull origin main
npm ci
npm run build
npx prisma migrate deploy

# Reload with PM2 (zero downtime)
pm2 reload aternos-dashboard
```

---

## 🌐 Nginx Reverse Proxy (Optional but Recommended)

### Install Nginx
```bash
sudo apt install -y nginx
```

### Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/aternos-dashboard
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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
        proxy_read_timeout 86400;
    }
}
```

### Enable Nginx Config
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/aternos-dashboard /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable on boot
sudo systemctl enable nginx
```

### Setup SSL with Let's Encrypt (Free HTTPS)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (certbot sets this up automatically)
sudo certbot renew --dry-run
```

---

## 🔒 Security Best Practices

### Firewall Setup
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

### Secure .env file
```bash
# Set proper permissions
chmod 600 .env

# Only owner can read/write
ls -la .env
```

---

## 📊 Monitoring & Logs

```bash
# PM2 Logs
pm2 logs aternos-dashboard --lines 200

# PM2 Monitoring
pm2 monit

# Nginx Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System resources
htop
```

---

## 🐛 Troubleshooting

### App won't start
```bash
# Check PM2 logs
pm2 logs aternos-dashboard --err

# Check if port is in use
sudo lsof -i :3000

# Restart PM2
pm2 restart aternos-dashboard
```

### Database connection issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test database connection
psql -U aternos_user -d aternos_dashboard -h localhost

# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL
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

- [ ] VPS has Node.js 18+ installed
- [ ] PostgreSQL database created and configured
- [ ] `.env` file updated with production values
- [ ] Build completed successfully (`npm run build`)
- [ ] All files uploaded to `/var/www/aternos-dashboard`
- [ ] `npm ci` executed on VPS
- [ ] Prisma migrations applied
- [ ] PM2 started successfully
- [ ] PM2 startup script configured
- [ ] Nginx reverse proxy configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] Firewall configured
- [ ] Application accessible via browser

---

## 🎯 Quick Start Summary

```bash
# 1. On VPS - Setup
cd /var/www/aternos-dashboard
npm ci --production
npx prisma generate
npx prisma migrate deploy

# 2. Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# 3. Check status
pm2 status
pm2 logs aternos-dashboard

# Done! Visit http://your-vps-ip:3000
```

Your application should now be running in production! 🚀
