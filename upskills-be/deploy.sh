#!/bin/bash

# UpSkills Backend Deployment Script
# This script handles the deployment of the Laravel backend

set -e

echo "🚀 Starting UpSkills Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Install/Update dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
composer install --no-dev --optimize-autoloader

# Generate application key if not set
echo -e "${YELLOW}Checking application key...${NC}"
php artisan key:generate --force

# Run migrations
echo -e "${YELLOW}Running migrations...${NC}"
php artisan migrate --force

# Clear and cache configuration
echo -e "${YELLOW}Optimizing application...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Clear application cache
php artisan cache:clear

# Optimize autoloader
composer dump-autoload --optimize

# Set permissions
echo -e "${YELLOW}Setting permissions...${NC}"
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Create storage link
php artisan storage:link

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}Backend is ready to serve requests.${NC}"

