#!/bin/bash

# CRM Training Application - Laravel Sail (Docker) Setup Script
# This script sets up the application using Laravel Sail with Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  CRM Training App - Sail Setup${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check Docker
echo -e "${YELLOW}Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker Desktop: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker daemon is not running${NC}"
    echo "Please start Docker Desktop and try again"
    exit 1
fi
echo -e "${GREEN}Docker found and running${NC}"

# Install Composer dependencies via Docker
echo ""
echo -e "${YELLOW}Installing PHP dependencies via Docker...${NC}"
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php82-composer:latest \
    composer install --ignore-platform-reqs

# Setup environment
echo ""
echo -e "${YELLOW}Setting up environment...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}.env file created from .env.example${NC}"
else
    echo -e "${YELLOW}.env file already exists, skipping${NC}"
fi

# Create SQLite database file
echo -e "${YELLOW}Setting up SQLite database...${NC}"
if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
    echo -e "${GREEN}database/database.sqlite created${NC}"
else
    echo -e "${YELLOW}database/database.sqlite already exists${NC}"
fi

# Start Sail containers
echo ""
echo -e "${YELLOW}Starting Laravel Sail containers...${NC}"
./vendor/bin/sail up -d

# Wait for container to be ready
echo -e "${YELLOW}Waiting for container to be ready...${NC}"
sleep 5

# Generate application key
echo -e "${YELLOW}Generating application key...${NC}"
./vendor/bin/sail artisan key:generate --ansi

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
./vendor/bin/sail artisan migrate --force

# Seed database
echo -e "${YELLOW}Seeding database...${NC}"
./vendor/bin/sail artisan db:seed --force

# Install Node dependencies
echo ""
echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
./vendor/bin/sail npm install

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "Sail containers are running. To start the Vite dev server:"
echo ""
echo -e "  ${YELLOW}./vendor/bin/sail npm run dev${NC}"
echo ""
echo -e "Then open ${GREEN}http://localhost${NC} in your browser"
echo ""
echo -e "Default superuser credentials:"
echo -e "  Email: ${YELLOW}dev@example.com${NC}"
echo -e "  Password: ${YELLOW}DevPassword${NC}"
echo ""
echo -e "Useful Sail commands:"
echo -e "  ${YELLOW}./vendor/bin/sail up${NC}      - Start containers"
echo -e "  ${YELLOW}./vendor/bin/sail down${NC}    - Stop containers"
echo -e "  ${YELLOW}./vendor/bin/sail artisan${NC} - Run Artisan commands"
echo -e "  ${YELLOW}./vendor/bin/sail npm${NC}     - Run npm commands"
echo -e "  ${YELLOW}./vendor/bin/sail shell${NC}   - Open shell in container"
echo ""
