/**
 * PM2 ecosystem configuration for production deployment
 * Run with: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [
    {
      name: 'aternos-dashboard',
      script: '.next/standalone/server.js',
      cwd: './',
      instances: process.env.PM2_INSTANCES || 'max',
      exec_mode: 'cluster',
      
      // Environment variables
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Process management
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      
      // Monitoring
      listen_timeout: 10000,
      kill_timeout: 5000,
      wait_ready: true,
      
      // Advanced features
      exp_backoff_restart_delay: 100,
      
      // Source maps for debugging
      source_map_support: true,
      
      // Watch (disabled in production)
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
    },
  ],
  
  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:yourname/aternos-dashboard.git',
      path: '/var/www/aternos-dashboard',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
