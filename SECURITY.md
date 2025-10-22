# 🔒 Security Checklist & Best Practices

## ✅ Pre-Deployment Security Checklist

### Environment & Configuration
- [ ] All `.env` files are in `.gitignore`
- [ ] `.env.example` exists with placeholder values (no real credentials)
- [ ] `NEXTAUTH_SECRET` is a strong random string (32+ characters)
- [ ] `PTERO_CRED_KEY` is exactly 32 characters for AES-256
- [ ] `DATABASE_URL` does not contain production credentials in code
- [ ] `NEXTAUTH_URL` uses HTTPS in production
- [ ] `NODE_ENV=production` is set on production server
- [ ] No hardcoded API keys or secrets in source code

### Database Security
- [ ] Database uses strong password (16+ characters, mixed case, numbers, symbols)
- [ ] Database user has minimum required permissions
- [ ] Database is not publicly accessible (firewall rules)
- [ ] Database backups are automated
- [ ] Prisma migrations are applied with `prisma migrate deploy`
- [ ] Database connection uses SSL/TLS in production

### API & Authentication
- [ ] NextAuth configured with secure settings
- [ ] CSRF protection enabled (NextAuth default)
- [ ] Rate limiting implemented for sensitive endpoints
- [ ] All API routes validate authentication
- [ ] User inputs are sanitized and validated
- [ ] SQL injection protected by Prisma ORM
- [ ] XSS protection enabled

### Server & Network
- [ ] Firewall (UFW) enabled with only necessary ports
- [ ] SSH key-based authentication (disable password login)
- [ ] Nginx/reverse proxy configured
- [ ] SSL/TLS certificate installed (Let's Encrypt)
- [ ] HTTPS redirect enabled
- [ ] Security headers configured
- [ ] DDoS protection considered (Cloudflare recommended)

### Application Code
- [ ] Dependencies are up to date (`npm audit`)
- [ ] No sensitive data in console.log statements
- [ ] Error messages don't expose system information
- [ ] File uploads are validated and sanitized
- [ ] CORS configured appropriately
- [ ] Helmet.js or similar security headers
- [ ] Content Security Policy (CSP) configured

## 🛡️ Production Environment Variables

### Required Variables
```env
# Node Environment
NODE_ENV=production

# Database (Use PostgreSQL in production)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# NextAuth (MUST be HTTPS)
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Pterodactyl Panel
PTERO_PANEL_URL=https://panel.yourdomain.com
PTERO_API_KEY=<your-admin-api-key>
PTERO_CLIENT_API_KEY=<your-client-api-key>
NEXT_PUBLIC_PTERO_PANEL_URL=https://panel.yourdomain.com

# Encryption Key (exactly 32 characters)
PTERO_CRED_KEY=<your-32-char-encryption-key>
```

### Generate Secure Secrets

**Linux/Mac:**
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate PTERO_CRED_KEY (exactly 32 chars)
openssl rand -base64 32 | cut -c1-32
```

**Windows PowerShell:**
```powershell
# Generate random string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## 🔐 Nginx Security Headers

Add these headers to your Nginx config:

```nginx
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# CSP (adjust based on your needs)
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';" always;
```

## 🚨 Common Security Mistakes to Avoid

1. **Don't commit `.env` files to Git**
   - Always use `.env.example` with placeholders
   - Add `.env*` to `.gitignore`

2. **Don't use weak secrets**
   - Use strong random strings (32+ characters)
   - Never use default or example values in production

3. **Don't expose error details**
   - Don't show stack traces to users
   - Log errors server-side only

4. **Don't skip HTTPS**
   - Always use SSL/TLS in production
   - Redirect HTTP to HTTPS

5. **Don't ignore updates**
   - Regularly run `npm audit` and fix vulnerabilities
   - Keep dependencies updated

6. **Don't allow public database access**
   - Bind PostgreSQL to localhost
   - Use firewall rules

7. **Don't store passwords in plain text**
   - Always hash passwords (bcrypt)
   - Never log sensitive data

## 🔍 Security Audit Commands

```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Validate TypeScript
npm run type-check

# Run linter
npm run lint
```

## 🏥 Security Monitoring

### Log Monitoring
```bash
# Check PM2 logs for errors
pm2 logs aternos-dashboard --err

# Monitor failed login attempts
tail -f /var/log/nginx/error.log | grep "401\|403"

# Check system auth logs
sudo tail -f /var/log/auth.log
```

### System Security
```bash
# Check open ports
sudo netstat -tulpn

# Check firewall status
sudo ufw status verbose

# Check for unauthorized SSH access
sudo lastlog

# Monitor system resources
htop
```

## 📞 Incident Response

If you suspect a security breach:

1. **Immediately**:
   - Change all secrets (NEXTAUTH_SECRET, API keys)
   - Rotate database passwords
   - Check logs for suspicious activity

2. **Investigate**:
   - Review access logs
   - Check for unauthorized database changes
   - Scan for malware

3. **Remediate**:
   - Patch vulnerabilities
   - Update all dependencies
   - Reset all user passwords

4. **Prevent**:
   - Implement additional monitoring
   - Add rate limiting
   - Consider WAF (Web Application Firewall)

## 🎯 Security Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- NextAuth Security: https://next-auth.js.org/configuration/options#security
- Prisma Security: https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/securing-prisma-client
- Node.js Security: https://nodejs.org/en/docs/guides/security/

---

**Remember**: Security is an ongoing process, not a one-time setup. Regularly review and update your security measures.
