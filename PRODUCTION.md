# Production Deployment Guide

This guide covers deploying the Aternos Dashboard to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Deployment Options](#deployment-options)
- [Security Checklist](#security-checklist)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying to production, ensure you have:

- ✅ Node.js 18.x or higher
- ✅ Production database (PostgreSQL/MySQL recommended)
- ✅ Valid SSL certificate for HTTPS
- ✅ Environment variables configured
- ✅ Pterodactyl Panel API access

## Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Generate Secure Secrets

**NEXTAUTH_SECRET** (minimum 32 characters):
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**PTERO_CRED_KEY** (exactly 32 characters for AES-256):
```bash
# Linux/Mac
openssl rand -base64 32 | cut -c1-32

# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 3. Configure Production Variables

```env
NODE_ENV="production"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-generated-secret"

# Use PostgreSQL or MySQL in production
DATABASE_URL="postgresql://user:password@host:5432/database"

# Configure your Pterodactyl panel
PTERO_PANEL_URL="https://panel.yourdomain.com"
PTERO_API_KEY="your-application-api-key"
PTERO_CLIENT_API_KEY="your-client-api-key"
NEXT_PUBLIC_PTERO_PANEL_URL="https://panel.yourdomain.com"

PTERO_CRED_KEY="your-32-char-key-here"
```

## Database Setup

### PostgreSQL (Recommended)

1. **Create database:**
```sql
CREATE DATABASE aternos_dashboard;
CREATE USER dashboard_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE aternos_dashboard TO dashboard_user;
```

2. **Run migrations:**
```bash
npm run db:migrate
```

### MySQL

1. **Create database:**
```sql
CREATE DATABASE aternos_dashboard;
CREATE USER 'dashboard_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON aternos_dashboard.* TO 'dashboard_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Update DATABASE_URL:**
```env
DATABASE_URL="mysql://dashboard_user:secure_password@localhost:3306/aternos_dashboard"
```

3. **Run migrations:**
```bash
npm run db:migrate
```

## Deployment Options

### Option 1: Traditional Server (PM2)

1. **Install dependencies:**
```bash
npm ci --production=false
```

2. **Build application:**
```bash
npm run build
```

3. **Install PM2:**
```bash
npm install -g pm2
```

4. **Create PM2 ecosystem file** (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'aternos-dashboard',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: './',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

5. **Start with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 2: Docker

See [Docker Deployment](#docker-deployment) section below.

### Option 3: Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Configure environment variables in Vercel dashboard**

### Option 4: Railway/Render/Fly.io

These platforms support automatic deployment from Git:

1. Connect your repository
2. Configure environment variables in the dashboard
3. Set build command: `npm run build`
4. Set start command: `npm run start:prod`

## Docker Deployment

### Using Docker Compose

1. **Start services:**
```bash
docker-compose up -d
```

2. **View logs:**
```bash
docker-compose logs -f app
```

3. **Stop services:**
```bash
docker-compose down
```

### Manual Docker Build

1. **Build image:**
```bash
docker build -t aternos-dashboard:latest .
```

2. **Run container:**
```bash
docker run -d \
  --name aternos-dashboard \
  -p 3000:3000 \
  --env-file .env \
  aternos-dashboard:latest
```

## Security Checklist

Before going live, verify:

- [ ] All environment variables use secure, unique values
- [ ] HTTPS is enabled (NEXTAUTH_URL uses https://)
- [ ] Database uses strong password
- [ ] NEXTAUTH_SECRET is at least 32 characters
- [ ] PTERO_CRED_KEY is exactly 32 characters
- [ ] Firewall rules restrict database access
- [ ] Regular backups are configured
- [ ] Monitoring and logging are set up
- [ ] Rate limiting is configured (if needed)
- [ ] CORS is properly configured

## Monitoring

### Health Check Endpoint

The application includes a health check endpoint at `/api/health`:

```bash
curl https://yourdomain.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345,
  "environment": "production",
  "checks": {
    "database": "ok",
    "environment": "ok"
  }
}
```

### Monitoring Integration

Configure your monitoring service to check:
- Health endpoint: `GET /api/health` (should return 200)
- Response time < 1000ms
- Database connectivity

Popular monitoring tools:
- **Uptime Robot**: Free tier available
- **New Relic**: APM monitoring
- **DataDog**: Full-stack monitoring
- **Sentry**: Error tracking

### Logging

In production, the application:
- Removes console.log (keeps console.error and console.warn)
- Logs errors to stderr
- Tracks performance metrics

Consider integrating:
- **Winston** or **Pino** for structured logging
- **Sentry** for error tracking
- **LogRocket** for session replay

## Performance Optimization

### Caching Strategy

1. **Static Assets**: Cached for 1 year
2. **API Routes**: Cache-Control headers applied
3. **Database Queries**: Consider Redis for session storage
4. **Images**: Optimized with Next.js Image component

### CDN Configuration

If using a CDN (Cloudflare, CloudFront):

1. Cache static assets: `/_next/static/*`
2. Cache images: `/_next/image/*`
3. Don't cache API routes: `/api/*`

## Troubleshooting

### Build Failures

**Issue**: Environment validation errors
```
Solution: Ensure all required environment variables are set
Run: npm run validate
```

**Issue**: TypeScript errors
```
Solution: Run type checking
npm run type-check
```

### Runtime Issues

**Issue**: Database connection failed
```
Check: DATABASE_URL is correct
Check: Database server is accessible
Check: Migrations are up to date (npm run db:migrate)
```

**Issue**: NextAuth errors
```
Check: NEXTAUTH_URL matches your domain
Check: NEXTAUTH_SECRET is set and secure
Check: Database adapter is configured
```

**Issue**: Pterodactyl API errors
```
Check: API keys are valid
Check: Panel URL is correct
Check: API permissions are sufficient
```

### Performance Issues

**Issue**: Slow response times
```
Solutions:
- Enable database connection pooling
- Add Redis for session storage
- Configure CDN for static assets
- Optimize database queries
- Scale horizontally (multiple instances)
```

### Database Migration Issues

**Issue**: Migration fails
```bash
# Reset migrations (⚠️ WARNING: This will delete data)
npx prisma migrate reset

# Or manually fix and retry
npx prisma migrate resolve --applied "migration_name"
npx prisma migrate deploy
```

## Backup & Recovery

### Database Backups

**PostgreSQL:**
```bash
# Backup
pg_dump -U dashboard_user aternos_dashboard > backup_$(date +%Y%m%d).sql

# Restore
psql -U dashboard_user aternos_dashboard < backup_20240101.sql
```

**MySQL:**
```bash
# Backup
mysqldump -u dashboard_user -p aternos_dashboard > backup_$(date +%Y%m%d).sql

# Restore
mysql -u dashboard_user -p aternos_dashboard < backup_20240101.sql
```

### Automated Backups

Set up cron job for daily backups:
```bash
0 2 * * * /path/to/backup-script.sh
```

## Scaling Considerations

### Horizontal Scaling

The application is stateless and can be scaled horizontally:

1. Use external session storage (Redis)
2. Load balancer for multiple instances
3. Database connection pooling
4. CDN for static assets

### Vertical Scaling

Recommended minimum specs:
- **CPU**: 2 cores
- **RAM**: 2GB
- **Storage**: 10GB (depending on database)

Production recommendations:
- **CPU**: 4+ cores
- **RAM**: 4GB+
- **Storage**: SSD with 50GB+

## Updates & Maintenance

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update safely
npm update

# Rebuild
npm run build
```

### Rolling Updates

When using PM2:
```bash
pm2 reload aternos-dashboard
```

When using Docker:
```bash
docker-compose pull
docker-compose up -d
```

## Support

For issues or questions:
- Check logs: `pm2 logs` or `docker-compose logs`
- Review health check: `/api/health`
- Check environment: `npm run validate`

---

**Last Updated**: 2024
**Version**: 1.0.0
