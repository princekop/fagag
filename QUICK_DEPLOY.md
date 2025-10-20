# ⚡ Quick Deploy Commands - Copy & Paste

## 🔼 STEP 1: Push to GitHub (Local Machine)

```bash
cd "c:\Users\Pc\Music\Lustnode website\aternos-dashboard"

git init
git add .
git commit -m "Deploy Aternos Dashboard"
git remote add origin https://github.com/princekop/aternos-dash.git
git branch -M main
git push -u origin main
```

---

## 🖥️ STEP 2: Deploy on VPS

### A. Install Prerequisites (One-time setup)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib git
```

### B. Setup Database (One-time setup)

```bash
sudo -u postgres psql
```

**In PostgreSQL prompt:**
```sql
CREATE DATABASE aternos_dashboard;
CREATE USER aternos_user WITH PASSWORD 'YourSecurePassword123';
GRANT ALL PRIVILEGES ON DATABASE aternos_dashboard TO aternos_user;
ALTER DATABASE aternos_dashboard OWNER TO aternos_user;
\q
```

### C. Clone and Deploy

```bash
# Create directory
sudo mkdir -p /var/www/aternos-dashboard
sudo chown -R $USER:$USER /var/www/aternos-dashboard
cd /var/www/aternos-dashboard

# Clone repository
git clone https://github.com/princekop/aternos-dash.git .

# Create .env file
nano .env
```

**Paste this in .env (UPDATE THE VALUES!):**
```env
DATABASE_URL="postgresql://aternos_user:YourSecurePassword123@localhost:5432/aternos_dashboard"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://your-vps-ip:3000"
PTERODACTYL_URL="https://your-panel.com"
PTERODACTYL_API_KEY="your-api-key"
NEXT_PUBLIC_PTERO_PANEL_URL="https://your-panel.com"
```

**Save:** `Ctrl+X` → `Y` → `Enter`

### D. Install and Start

```bash
# Install dependencies
npm ci

# Setup Prisma
npx prisma generate
npx prisma migrate deploy

# Build
npm run build

# Start with PM2
chmod +x deploy.sh
./deploy.sh

# OR manually:
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
# Run the command PM2 outputs
pm2 save
```

### E. Check Status

```bash
pm2 status
pm2 logs aternos-dashboard
```

**Access:** `http://your-vps-ip:3000`

---

## 🔄 Update Later (After code changes)

```bash
cd /var/www/aternos-dashboard
git pull
npm ci
npx prisma migrate deploy
npm run build
pm2 reload aternos-dashboard
```

---

## 🌐 Optional: Setup Nginx + SSL

```bash
# Install Nginx
sudo apt install -y nginx certbot python3-certbot-nginx

# Create config
sudo nano /etc/nginx/sites-available/aternos-dashboard
```

**Paste:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable:**
```bash
sudo ln -s /etc/nginx/sites-available/aternos-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL
sudo certbot --nginx -d your-domain.com

# Firewall
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**Access:** `https://your-domain.com`

---

## 📝 Useful Commands

```bash
pm2 logs aternos-dashboard    # View logs
pm2 restart aternos-dashboard # Restart
pm2 monit                     # Monitor
pm2 stop aternos-dashboard    # Stop
```

Done! 🎉
