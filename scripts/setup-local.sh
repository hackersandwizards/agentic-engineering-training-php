#!/bin/bash

# CRM Training Application - Local Setup Script
# This script sets up the application for local development without Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  CRM Training App - Local Setup${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check PHP version
echo -e "${YELLOW}Checking PHP version...${NC}"
PHP_VERSION=$(php -v 2>/dev/null | head -n 1 | cut -d ' ' -f 2 | cut -d '.' -f 1,2)
if [ -z "$PHP_VERSION" ]; then
    echo -e "${RED}Error: PHP is not installed${NC}"
    echo "Please install PHP 8.2 or higher"
    exit 1
fi

PHP_MAJOR=$(echo "$PHP_VERSION" | cut -d '.' -f 1)
PHP_MINOR=$(echo "$PHP_VERSION" | cut -d '.' -f 2)

if [ "$PHP_MAJOR" -lt 8 ] || ([ "$PHP_MAJOR" -eq 8 ] && [ "$PHP_MINOR" -lt 2 ]); then
    echo -e "${RED}Error: PHP 8.2 or higher is required (found: $PHP_VERSION)${NC}"
    exit 1
fi
echo -e "${GREEN}PHP version $PHP_VERSION found${NC}"

# Check for required PHP extensions
echo -e "${YELLOW}Checking required PHP extensions...${NC}"
REQUIRED_EXTENSIONS=("pdo_sqlite" "mbstring" "openssl" "tokenizer" "xml" "ctype" "json" "fileinfo")

for ext in "${REQUIRED_EXTENSIONS[@]}"; do
    if php -m | grep -qi "^${ext}$"; then
        echo -e "  ${GREEN}[OK]${NC} $ext"
    else
        echo -e "  ${RED}[MISSING]${NC} $ext"
        echo -e "${RED}Error: Required PHP extension '$ext' is not installed${NC}"
        echo "Please install the extension and try again"
        exit 1
    fi
done

# Check Composer
echo -e "${YELLOW}Checking Composer...${NC}"
if ! command -v composer &> /dev/null; then
    echo -e "${RED}Error: Composer is not installed${NC}"
    echo "Please install Composer: https://getcomposer.org/"
    exit 1
fi
echo -e "${GREEN}Composer found${NC}"

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 18 or higher"
    exit 1
fi
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js 18 or higher is required${NC}"
    exit 1
fi
echo -e "${GREEN}Node.js $(node -v) found${NC}"

echo ""
echo -e "${YELLOW}Installing PHP dependencies...${NC}"
composer install

echo ""
echo -e "${YELLOW}Setting up environment...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}.env file created from .env.example${NC}"
else
    echo -e "${YELLOW}.env file already exists, skipping${NC}"
fi

# Generate application key
echo -e "${YELLOW}Generating application key...${NC}"
php artisan key:generate --ansi

# Create SQLite database
echo -e "${YELLOW}Setting up SQLite database...${NC}"
if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
    echo -e "${GREEN}database/database.sqlite created${NC}"
else
    echo -e "${YELLOW}database/database.sqlite already exists${NC}"
fi

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
php artisan migrate --force

# Seed database
echo -e "${YELLOW}Seeding database...${NC}"
php artisan db:seed --force

# Install Node dependencies
echo ""
echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
npm install

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "To start the development servers, run these commands in separate terminals:"
echo ""
echo -e "  ${YELLOW}Terminal 1 (PHP Server):${NC}"
echo -e "    php artisan serve"
echo ""
echo -e "  ${YELLOW}Terminal 2 (Vite Dev Server):${NC}"
echo -e "    npm run dev"
echo ""
echo -e "Then open ${GREEN}http://localhost:8000${NC} in your browser"
echo ""
echo -e "Default superuser credentials:"
echo -e "  Email: ${YELLOW}dev@example.com${NC}"
echo -e "  Password: ${YELLOW}DevPassword${NC}"
echo ""
