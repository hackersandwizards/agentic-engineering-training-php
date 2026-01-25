# CRM Training Application (Laravel + React)

A training CRM application built with Laravel 11, Inertia.js, and React with Chakra UI.

## Tech Stack

- **Backend**: Laravel 11 (PHP 8.2+)
- **Database**: SQLite
- **Authentication**: Laravel Sanctum (SPA sessions + API tokens)
- **Frontend**: Inertia.js + React + TypeScript
- **UI**: Chakra UI v3
- **Build**: Vite

## Features

- User authentication (login/signup)
- Contact management (CRUD)
- User administration (superuser only)
- Profile settings
- REST API for external clients

## Quick Start

### Option 1: Local Development (without Docker)

Requirements:
- PHP 8.2+
- Composer
- Node.js 18+
- SQLite support (pdo_sqlite extension)

```bash
./scripts/setup-local.sh
```

Then in separate terminals:

```bash
# Terminal 1: PHP Server
php artisan serve

# Terminal 2: Vite Dev Server
npm run dev
```

Open http://localhost:8000

### Option 2: Docker with Laravel Sail

Requirements:
- Docker Desktop

```bash
./scripts/setup-sail.sh

# Start Vite dev server
./vendor/bin/sail npm run dev
```

Open http://localhost

## Default Users

| Email | Password | Role |
|-------|----------|------|
| dev@example.com | DevPassword | Superuser |
| alice@example.com | AlicePassword123 | User |
| bob@example.com | BobPassword123 | User |

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/V1/          # REST API controllers
│   │   └── Web/             # Inertia web controllers
│   └── Middleware/
│       ├── EnsureSuperuser.php
│       └── HandleInertiaRequests.php
├── Models/
│   ├── User.php
│   └── Contact.php
database/
├── migrations/
└── seeders/
resources/
├── js/
│   ├── app.tsx              # Entry point
│   ├── types/               # TypeScript types
│   ├── Components/          # React components
│   │   ├── Layout/
│   │   ├── Contacts/
│   │   └── Admin/
│   └── Pages/               # Inertia pages
│       ├── Auth/
│       ├── Dashboard.tsx
│       ├── Contacts/
│       ├── Admin/
│       └── Settings.tsx
└── views/
    └── app.blade.php        # Root template
routes/
├── web.php                  # Web routes (Inertia)
└── api.php                  # API routes (REST)
```

## REST API

Base URL: `/api/v1`

### Authentication

```bash
# Login (get bearer token)
POST /api/v1/login/access-token
Content-Type: application/json
{
  "username": "dev@example.com",
  "password": "DevPassword"
}

# Response
{
  "access_token": "...",
  "token_type": "Bearer"
}

# Test token validity
POST /api/v1/login/test-token
Authorization: Bearer <token>
```

### Users

```bash
# Get current user
GET /api/v1/users/me
Authorization: Bearer <token>

# Update profile
PATCH /api/v1/users/me
Authorization: Bearer <token>
{
  "email": "new@example.com",
  "full_name": "New Name"
}

# Change password
PATCH /api/v1/users/me/password
Authorization: Bearer <token>
{
  "current_password": "...",
  "new_password": "..."
}

# Signup (public)
POST /api/v1/users/signup
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "User Name"
}

# Admin: List users
GET /api/v1/users
Authorization: Bearer <token>  # requires superuser

# Admin: Create user
POST /api/v1/users
Authorization: Bearer <token>  # requires superuser

# Admin: Update user
PATCH /api/v1/users/{id}
Authorization: Bearer <token>  # requires superuser

# Admin: Delete user
DELETE /api/v1/users/{id}
Authorization: Bearer <token>  # requires superuser
```

### Contacts

```bash
# List contacts
GET /api/v1/contacts
Authorization: Bearer <token>

# Create contact
POST /api/v1/contacts
Authorization: Bearer <token>
{
  "organisation": "Company Name",
  "description": "Optional description"
}

# Get contact
GET /api/v1/contacts/{id}
Authorization: Bearer <token>

# Update contact
PUT /api/v1/contacts/{id}
Authorization: Bearer <token>

# Delete contact
DELETE /api/v1/contacts/{id}
Authorization: Bearer <token>
```

### Health Check

```bash
GET /api/v1/health-check
# Response: { "message": "OK" }
```

## Development Commands

```bash
# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Fresh database
php artisan migrate:fresh --seed

# Run tests
php artisan test

# Build for production
npm run build

# Type check
npm run type-check
```

### Laravel Sail Commands

```bash
# Start containers
./vendor/bin/sail up -d

# Stop containers
./vendor/bin/sail down

# Run artisan commands
./vendor/bin/sail artisan <command>

# Run npm commands
./vendor/bin/sail npm <command>

# Open shell
./vendor/bin/sail shell

# View logs
./vendor/bin/sail logs
```

## Environment Variables

Key variables in `.env`:

```env
# Database
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Sanctum (for API token auth)
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8000,127.0.0.1

# First superuser (optional, used by seeder)
FIRST_SUPERUSER_EMAIL=dev@example.com
FIRST_SUPERUSER_PASSWORD=DevPassword
```

## PHP 8.5 Compatibility

This project includes a patch for PHP 8.5 compatibility. The Laravel framework's `database.php` config uses `PDO::MYSQL_ATTR_SSL_CA` which is deprecated in PHP 8.5 (replaced by `Pdo\Mysql::ATTR_SSL_CA`).

The patch is automatically applied via `cweagans/composer-patches`. If you need to reapply:

```bash
composer reinstall laravel/framework
```

## License

This project is for training purposes.
