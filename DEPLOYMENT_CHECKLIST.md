# Production Deployment Checklist

Use this checklist before deploying to production to ensure everything is configured correctly.

## 📋 Pre-Deployment Checklist

### Environment Configuration
- [ ] Copy `.env.example` to `.env` or `.env.production`
- [ ] Generate secure `NEXTAUTH_SECRET` (32+ characters)
- [ ] Generate secure `PTERO_CRED_KEY` (exactly 32 characters)
- [ ] Set `NODE_ENV` to `"production"`
- [ ] Configure `NEXTAUTH_URL` with HTTPS domain
- [ ] Verify all required environment variables are set
- [ ] Remove or update any default/example values
- [ ] Test environment validation: `npm run validate`

### Database
- [ ] Production database (PostgreSQL/MySQL) is set up
- [ ] `DATABASE_URL` is configured with production credentials
- [ ] Database user has appropriate permissions
- [ ] Database migrations are up to date: `npm run db:migrate`
- [ ] Database connection pooling is configured
- [ ] Backup strategy is in place
- [ ] Test database connectivity

### Security
- [ ] All secrets use strong, unique values
- [ ] HTTPS is enabled and SSL certificate is valid
- [ ] Security headers are configured (check `next.config.ts`)
- [ ] Rate limiting is implemented (if needed)
- [ ] CORS is properly configured
- [ ] API keys are not exposed in client-side code
- [ ] `.env` files are in `.gitignore`
- [ ] No sensitive data in version control

### Application
- [ ] Run type checking: `npm run type-check`
- [ ] Run linting: `npm run lint`
- [ ] Build succeeds without errors: `npm run build`
- [ ] All tests pass (if applicable)
- [ ] Dependencies are up to date
- [ ] Production build is tested locally
- [ ] Health check endpoint works: `/api/health`

### Performance
- [ ] Image optimization is configured
- [ ] Caching strategy is implemented
- [ ] CDN is configured (if applicable)
- [ ] Database queries are optimized
- [ ] Bundle size is acceptable
- [ ] Lighthouse score is reviewed

### Monitoring & Logging
- [ ] Health check endpoint is accessible
- [ ] Monitoring service is configured (optional)
- [ ] Error tracking is set up (Sentry, etc.)
- [ ] Logging is configured
- [ ] Uptime monitoring is active
- [ ] Performance monitoring is set up

### Deployment Method
Choose your deployment method and complete the relevant section:

#### Docker
- [ ] Docker is installed
- [ ] `Dockerfile` is configured correctly
- [ ] `docker-compose.yml` is configured (if using)
- [ ] Environment variables are passed to container
- [ ] Volumes are configured for persistence
- [ ] Test Docker build: `docker build -t aternos-dashboard .`
- [ ] Test Docker run locally

#### PM2
- [ ] PM2 is installed globally
- [ ] `ecosystem.config.js` is configured
- [ ] Log directory exists
- [ ] PM2 startup script is configured
- [ ] Auto-restart is enabled
- [ ] Cluster mode is configured (if needed)

#### Vercel/Railway/Render
- [ ] Project is connected to Git repository
- [ ] Environment variables are set in dashboard
- [ ] Build command is correct: `npm run build`
- [ ] Start command is correct: `npm run start:prod`
- [ ] Domain is configured
- [ ] HTTPS redirect is enabled

### Infrastructure
- [ ] Server/hosting meets minimum requirements
  - [ ] CPU: 2+ cores (4+ recommended)
  - [ ] RAM: 2GB+ (4GB+ recommended)
  - [ ] Storage: 10GB+ SSD
- [ ] Network/firewall rules are configured
  - [ ] Port 3000 is accessible (or custom port)
  - [ ] Database port is restricted
  - [ ] HTTPS port 443 is open
- [ ] Load balancer is configured (if needed)
- [ ] Auto-scaling is set up (if needed)

### Documentation
- [ ] README.md is updated with project-specific information
- [ ] Environment variables are documented
- [ ] Deployment steps are documented
- [ ] Team members have access to credentials
- [ ] Runbook for common issues exists

## 🚀 Deployment Steps

### First Deployment

1. **Setup Database**
   ```bash
   npm run db:migrate
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Test Production Build Locally**
   ```bash
   npm run start:prod
   ```

4. **Deploy to Production**
   
   **Docker:**
   ```bash
   docker-compose up -d
   ```
   
   **PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   ```
   
   **Vercel:**
   ```bash
   vercel --prod
   ```

5. **Verify Deployment**
   - [ ] Application is accessible
   - [ ] Health check returns 200: `curl https://yourdomain.com/api/health`
   - [ ] Authentication works
   - [ ] Database connectivity confirmed
   - [ ] All features work as expected

### Updates/Redeployments

1. **Pull Latest Changes**
   ```bash
   git pull origin main
   ```

2. **Install Dependencies**
   ```bash
   npm ci
   ```

3. **Run Migrations** (if any)
   ```bash
   npm run db:migrate
   ```

4. **Build**
   ```bash
   npm run build
   ```

5. **Restart Application**
   
   **Docker:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```
   
   **PM2:**
   ```bash
   pm2 reload aternos-dashboard
   ```

## ✅ Post-Deployment Verification

- [ ] Application loads successfully
- [ ] Health check endpoint returns healthy status
- [ ] User authentication works
- [ ] Database queries execute successfully
- [ ] Real-time features work (WebSocket)
- [ ] All API endpoints respond correctly
- [ ] Static assets load properly
- [ ] Images are optimized and loading
- [ ] No console errors in browser
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable (check response times)
- [ ] Monitoring alerts are received (test)

## 🔍 Health Checks

### Automated Checks
```bash
# Application health
curl https://yourdomain.com/api/health

# Database connectivity (should be checked by health endpoint)

# SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### Manual Testing
- [ ] Login with test account
- [ ] Create a test server
- [ ] Access server console
- [ ] Check real-time updates
- [ ] Test all major features

## 🚨 Rollback Plan

If deployment fails:

1. **Docker:**
   ```bash
   docker-compose down
   docker-compose pull  # Pull previous image
   docker-compose up -d
   ```

2. **PM2:**
   ```bash
   git checkout previous-working-commit
   npm ci
   npm run build
   pm2 reload aternos-dashboard
   ```

3. **Database Rollback** (if needed):
   ```bash
   # Restore from backup
   psql -U user database < backup.sql
   ```

## 📞 Emergency Contacts

Document key contacts for production issues:

- **DevOps/Infrastructure**: _______________
- **Database Admin**: _______________
- **Team Lead**: _______________
- **Hosting Support**: _______________

## 📝 Notes

Document any environment-specific configurations or gotchas:

```
[Add notes here]
```

---

**Last Updated**: [Date]
**Deployed By**: [Name]
**Version**: [Version Number]
