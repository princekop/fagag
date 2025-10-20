# 🔌 WebSocket Console Troubleshooting Guide

## ⚠️ Current Issue

Your console is showing:
```
WebSocket connection to 'wss://play.heartheavenmc.xyz:8080/...' failed
```

This means the browser **cannot connect** to the Pterodactyl panel's WebSocket server.

---

## 🔍 Root Cause Analysis

### **Why is it failing?**

The WebSocket URL `wss://play.heartheavenmc.xyz:8080` is being returned by your Pterodactyl panel, but:

1. **Port 8080 is not accessible** from the internet/browser
2. **SSL/TLS certificate issues** - Port 8080 may not have a valid SSL certificate
3. **Firewall blocking** - The WebSocket port is blocked
4. **CORS restrictions** - Cross-origin WebSocket connection blocked

### **What's happening:**

```
Browser (localhost:3000)
    ↓ Attempts connection
Pterodactyl WebSocket (play.heartheavenmc.xyz:8080)
    ↓ Connection BLOCKED ❌
Error: WebSocket connection failed
```

---

## ✅ Solutions

### **Option 1: Configure Panel WebSocket Proxy (Recommended)**

The Pterodactyl panel should be accessible via HTTPS on the same domain without exposing port 8080.

**In your Pterodactyl `.env` file:**
```env
APP_URL=https://panel.heartheavenmc.xyz
TRUSTED_PROXIES=*
```

**In your web server (Nginx/Apache):**

#### Nginx Configuration:
```nginx
server {
    listen 443 ssl http2;
    server_name panel.heartheavenmc.xyz;

    # Existing PHP/Laravel config...

    # WebSocket proxy
    location /api/client/servers/*/websocket {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Apache Configuration:
```apache
<VirtualHost *:443>
    ServerName panel.heartheavenmc.xyz

    # Existing config...

    # WebSocket proxy
    ProxyPass /api/client/servers/ ws://localhost:8080/api/client/servers/
    ProxyPassReverse /api/client/servers/ ws://localhost:8080/api/client/servers/
</VirtualHost>
```

---

### **Option 2: Open WebSocket Port (Not Recommended)**

If you must expose port 8080:

1. **Open firewall port 8080** for WebSocket
2. **Configure SSL certificate** for port 8080
3. **Update Pterodactyl config** to use correct WebSocket URL

**Security Risk:** Exposing additional ports increases attack surface.

---

### **Option 3: Use Panel URL for WebSocket**

Modify `.env` to ensure WebSocket uses the same domain:

```env
# In Pterodactyl .env
APP_URL=https://panel.heartheavenmc.xyz
APP_ENVIRONMENT_ONLY=false
```

Then restart Pterodactyl:
```bash
cd /var/www/pterodactyl
php artisan config:clear
php artisan cache:clear
php artisan queue:restart
```

---

## 🧪 Testing Steps

### **1. Check if Pterodactyl Panel is Accessible**

```bash
curl https://panel.heartheavenmc.xyz
# Should return HTML/JSON
```

### **2. Test WebSocket Endpoint**

```bash
# From server
wscat -c ws://localhost:8080/api/servers/UUID/ws
# Should connect

# From internet (if exposed)
wscat -c wss://play.heartheavenmc.xyz:8080/api/servers/UUID/ws
# Currently failing
```

### **3. Check Panel Logs**

```bash
tail -f /var/www/pterodactyl/storage/logs/laravel-$(date +%Y-%m-%d).log
```

### **4. Verify Wings is Running**

```bash
systemctl status wings
# Should be active (running)
```

---

## 🔧 Quick Fixes

### **If Panel is `panel.heartheavenmc.xyz` but WebSocket is `play.heartheavenmc.xyz:8080`:**

**Update Pterodactyl Application URL:**

1. Edit `/var/www/pterodactyl/.env`:
   ```env
   APP_URL=https://panel.heartheavenmc.xyz
   ```

2. Clear cache:
   ```bash
   cd /var/www/pterodactyl
   php artisan config:clear
   php artisan cache:clear
   ```

3. Restart services:
   ```bash
   systemctl restart wings
   php artisan queue:restart
   ```

### **If SSL Certificate is Missing:**

```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d panel.heartheavenmc.xyz

# Auto-renewal
certbot renew --dry-run
```

---

## 📊 Expected Behavior (After Fix)

### **Successful Connection:**
```
[System] Connecting to console...
[Debug] Connecting to: wss://panel.heartheavenmc.xyz/api/client/...
[System] ✅ Console connected successfully
[System] Authenticated successfully
```

### **Console Output:**
```
Server log output appears here in real-time
Commands work
Status updates automatically
```

---

## 🎯 Current Workarounds

While WebSocket is down, you can still:

✅ **Start/Stop/Restart** server (power controls work)
✅ **Manage Files** via file manager
✅ **View Resources** (RAM, CPU, Disk)
✅ **Access Settings** and configurations
✅ **Manage Databases** and backups

❌ **Cannot:**
- View real-time console output
- Send console commands (will fail)

---

## 📞 Need Help?

### **Check These:**

1. ✅ Pterodactyl panel accessible: `https://panel.heartheavenmc.xyz`
2. ✅ Wings service running: `systemctl status wings`
3. ✅ SSL certificate valid: `curl -I https://panel.heartheavenmc.xyz`
4. ✅ Firewall allows connections
5. ✅ DNS resolves correctly: `nslookup panel.heartheavenmc.xyz`

### **Common Misconfigurations:**

| Issue | Fix |
|-------|-----|
| Different domains | Use single domain for panel & WebSocket |
| Port 8080 exposed | Proxy through Nginx/Apache instead |
| No SSL on 8080 | Configure proxy with SSL termination |
| Wings offline | `systemctl start wings` |
| Config cached | `php artisan config:clear` |

---

## 🚀 Recommended Solution

**For production environments:**

1. **Use Nginx/Apache proxy** (Option 1 above)
2. **Single domain** for panel and WebSocket
3. **SSL everywhere** (Let's Encrypt)
4. **No exposed ports** except 80/443

This provides:
- ✅ Better security
- ✅ Easier maintenance
- ✅ Standard HTTPS
- ✅ Works with all browsers
- ✅ No CORS issues

---

## 📝 Summary

The WebSocket connection fails because:
- Port 8080 is not accessible/configured properly
- WebSocket URL doesn't match panel URL
- SSL certificate issues on WebSocket port

**Fix it by:** Configuring Nginx/Apache to proxy WebSocket connections through the main panel URL with proper SSL.

---

**After implementing the fix, refresh the page and the console should connect automatically!** ✅
