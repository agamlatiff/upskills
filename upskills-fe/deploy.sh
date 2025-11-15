#!/bin/bash

# UpSkills Frontend Deployment Script
# This script handles the deployment of the React frontend

set -e

echo "🚀 Starting UpSkills Frontend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Warning: .env.local file not found!${NC}"
    echo "Creating .env.local from template..."
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo -e "${YELLOW}Please update .env.local with your environment variables${NC}"
    fi
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm ci

# Run tests (optional, can be skipped with --skip-tests)
if [ "$1" != "--skip-tests" ]; then
    echo -e "${YELLOW}Running tests...${NC}"
    npm test -- --run || echo -e "${YELLOW}Tests failed, but continuing deployment...${NC}"
fi

# Build for production
echo -e "${YELLOW}Building for production...${NC}"
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build failed! dist directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo -e "${GREEN}Frontend build is ready in the dist/ directory.${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Upload the dist/ directory to your web server"
echo "2. Configure your web server to serve the React app"
echo "3. Ensure API_BASE_URL points to your backend API"

