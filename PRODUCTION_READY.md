# Production Deployment Guide

## ✅ Production-Ready Checklist

Your Aternos Dashboard is now fully production-ready with:

- ✅ Next.js 15 optimizations
- ✅ Security headers (HSTS, CSP, X-Frame-Options, etc.)
- ✅ Environment validation
- ✅ Docker support (standalone output)
- ✅ PM2 process management
- ✅ Health check endpoint
- ✅ Fixed authentication redirects
- ✅ ESLint configuration for generated files

---

## 🚀 Deployment Steps

### Step 1: Prepare Environment Variables

On your production server, create `.env` with:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/aternos_db"

# NextAuth Configuration
NEXTAUTH_URL="https://your-domain.com"  # CRITICAL: Use your actual domain
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Pterodactyl Panel
PTERO_PANEL_URL="https://panel.example.com"
PTERO_API_KEY="your-api-key"
PTERO_CLIENT_API_KEY="your-client-api-key"
NEXT_PUBLIC_PTERO_PANEL_URL="https://panel.example.com"

# Encryption
PTERO_CRED_KEY="$(openssl rand -base64 32 | cut -c1-32)"

# Node Environment
NODE_ENV="production"
```

### Step 2: Deploy Code

```bash
# Clone or pull latest code
cd /var/aternos-dashboard
git pull origin main

# Or if not using git, upload files manually
```

### Step 3: Install Dependencies

```bash
npm ci --omit=dev
```

### Step 4: Database Setup

```bash
# Run migrations
npm run db:migrate

# Optional: Seed database
npm run db:seed
```

### Step 5: Build Application

```bash
# Production build (skips linting)
npm run build:prod

# Or with full validation
npm run build
```

### Step 6: Start with PM2

```bash
# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration for auto-restart
pm2 save

# Enable PM2 startup on reboot
pm2 startup

# Check status
pm2 status
pm2 logs aternos-dashboard
```

---

## 🔍 Verification

### Health Check

```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-20T06:30:00.000Z",
  "database": "connected"
}
```

### Check Running Process

```bash
pm2 status
pm2 logs aternos-dashboard --lines 50
```

---

## 🔐 Security Checklist

- [ ] `NEXTAUTH_URL` is set to your actual domain (not localhost)
- [ ] `NEXTAUTH_SECRET` is a strong random string (32+ characters)
- [ ] `PTERO_CRED_KEY` is exactly 32 characters
- [ ] Database credentials are secure
- [ ] HTTPS is enabled on your domain
- [ ] Environment variables are not committed to git
- [ ] `.env` file is in `.gitignore`

---

## 📊 Monitoring

### View Logs

```bash
# Real-time logs
pm2 logs aternos-dashboard

# Last 100 lines
pm2 logs aternos-dashboard --lines 100

# Specific time range
pm2 logs aternos-dashboard --err
```

### Monitor Resources

```bash
pm2 monit
```

### Restart Application

```bash
pm2 restart aternos-dashboard
pm2 reload aternos-dashboard  # Graceful reload
```

---

## 🐛 Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs aternos-dashboard

# Verify environment variables
cat .env

# Check database connection
npm run db:push --dry-run
```

### Localhost Redirect Issue

**Cause:** `NEXTAUTH_URL` not set or set to localhost

**Fix:**
```bash
# Edit .env
NEXTAUTH_URL="https://your-actual-domain.com"

# Restart
pm2 restart aternos-dashboard
```

### ESLint Errors During Build

The build now properly ignores generated files. If you still see errors:

```bash
# Use production build (skips validation)
npm run build:prod

# Or skip prebuild hooks
npm run build --ignore-scripts
```

---

## 📦 Docker Deployment (Alternative)

```bash
# Build Docker image
docker build -t aternos-dashboard .

# Run container
docker-compose up -d

# Check logs
docker-compose logs -f aternos-dashboard
```

---

## 🔄 Updates & Maintenance

### Update Application

```bash
cd /var/aternos-dashboard

# Pull latest code
git pull origin main

# Install dependencies
npm ci --omit=dev

# Run migrations if needed
npm run db:migrate

# Rebuild
npm run build:prod

# Restart
pm2 restart aternos-dashboard
```

### Backup Database

```bash
# PostgreSQL backup
pg_dump aternos_db > backup_$(date +%Y%m%d).sql

# Restore from backup
psql aternos_db < backup_20251020.sql
```

---

## 📞 Support

For issues, check:
1. `pm2 logs aternos-dashboard`
2. `.env` configuration
3. Database connection
4. NEXTAUTH_URL setting
5. Firewall/port settings

---

## ✨ You're Ready!

Your application is now production-ready. Deploy with confidence! 🚀
