# UpSkills Deployment Guide

This guide provides step-by-step instructions for deploying the UpSkills application to production.

## Prerequisites

- Server with Ubuntu 20.04+ or similar Linux distribution
- Nginx installed and configured
- PHP 8.2+ with required extensions
- Node.js 18+ and npm
- MySQL/PostgreSQL database
- SSL certificate (Let's Encrypt recommended)

## Backend Deployment

### 1. Clone Repository

```bash
cd /var/www
git clone <repository-url> upskills-be
cd upskills-be
```

### 2. Install Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

### 3. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` file with production values:
- `APP_ENV=production`
- `APP_DEBUG=false`
- Database credentials
- `SANCTUM_STATEFUL_DOMAINS` (your production domain)
- `FRONTEND_URL` (your frontend URL)
- Midtrans production keys

### 4. Run Migrations

```bash
php artisan migrate --force
php artisan db:seed  # If needed
```

### 5. Set Permissions

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 6. Create Storage Link

```bash
php artisan storage:link
```

### 7. Optimize Application

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 8. Using Deployment Script

Alternatively, use the provided deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Frontend Deployment

### 1. Clone Repository

```bash
cd /var/www
git clone <repository-url> upskills-fe
cd upskills-fe
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with production values:
- `VITE_API_URL=https://api.upskills.com/api`
- `VITE_MIDTRANS_CLIENT_KEY` (production key)

### 4. Build for Production

```bash
npm run build
```

This creates a `dist/` directory with optimized production files.

### 5. Using Deployment Script

```bash
chmod +x deploy.sh
./deploy.sh
```

## Nginx Configuration

### 1. Copy Configuration

```bash
cp nginx.conf.example /etc/nginx/sites-available/upskills
ln -s /etc/nginx/sites-available/upskills /etc/nginx/sites-enabled/
```

### 2. Update Configuration

Edit `/etc/nginx/sites-available/upskills`:
- Update `server_name` with your domain
- Update SSL certificate paths
- Update root path to frontend `dist/` directory
- Update proxy_pass to backend (e.g., `http://127.0.0.1:8000`)

### 3. Test and Reload Nginx

```bash
nginx -t
systemctl reload nginx
```

## Running Laravel Backend

### Using PHP Built-in Server (Development)

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

### Using Supervisor (Production)

Create `/etc/supervisor/conf.d/upskills-worker.conf`:

```ini
[program:upskills-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/upskills-be/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/upskills-be/storage/logs/worker.log
```

Then:

```bash
supervisorctl reread
supervisorctl update
supervisorctl start upskills-worker:*
```

## SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d upskills.com -d www.upskills.com
```

## Monitoring

### API Request Logging

API requests are automatically logged to:
- `storage/logs/api.log` (daily rotation, 30 days retention)

### Check Logs

```bash
# View API logs
tail -f storage/logs/api.log

# View Laravel logs
tail -f storage/logs/laravel.log
```

## Troubleshooting

### Permission Issues

```bash
sudo chown -R www-data:www-data /var/www/upskills-be
sudo chmod -R 775 /var/www/upskills-be/storage
sudo chmod -R 775 /var/www/upskills-be/bootstrap/cache
```

### Clear Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Check Queue Workers

```bash
php artisan queue:work --verbose
```

## Environment Variables Reference

### Backend (.env)

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://api.upskills.com`
- `SANCTUM_STATEFUL_DOMAINS=upskills.com,www.upskills.com`
- `FRONTEND_URL=https://upskills.com`
- `MIDTRANS_SERVER_KEY` (production)
- `MIDTRANS_CLIENT_KEY` (production)
- `MIDTRANS_IS_PRODUCTION=true`

### Frontend (.env.local)

- `VITE_API_URL=https://api.upskills.com/api`
- `VITE_MIDTRANS_CLIENT_KEY` (production)

## Post-Deployment Checklist

- [ ] Verify SSL certificate is valid
- [ ] Test API endpoints
- [ ] Test frontend routes
- [ ] Verify authentication flow
- [ ] Test payment integration (with test transactions)
- [ ] Check API logs for errors
- [ ] Verify file uploads work
- [ ] Test email sending (if configured)
- [ ] Monitor server resources
- [ ] Set up automated backups

## Rollback Procedure

If deployment fails:

1. **Backend Rollback:**
   ```bash
   git checkout <previous-commit>
   composer install
   php artisan migrate:rollback
   php artisan config:cache
   ```

2. **Frontend Rollback:**
   ```bash
   git checkout <previous-commit>
   npm ci
   npm run build
   ```

3. **Restore Database Backup:**
   ```bash
   mysql -u user -p database < backup.sql
   ```

## Support

For issues or questions, refer to:
- API Documentation: `API_DOCUMENTATION.md`
- Frontend Documentation: `FRONTEND_DOCUMENTATION.md`
- Migration Notes: `MIGRATION_TODO.md`

