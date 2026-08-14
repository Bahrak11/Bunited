# Bunited — Your Gateway to Studying in Türkiye

Production-ready education agency platform for international students applying to Turkish universities.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT with HTTP-only cookies, bcrypt password hashing

## Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment

Copy `.env.example` to `.env` and configure your values.

### 4. Initialize database

```bash
npm run db:push
npm run db:seed
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

- URL: `/admin/login`
- Initial credentials are set via environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)
- Password change is required on first login

## Project Structure

```
src/
├── app/           # Pages and API routes
│   ├── admin/     # Admin dashboard
│   ├── portal/    # Student portal
│   └── api/       # REST API endpoints
├── components/    # UI components
└── lib/           # Utilities, auth, database
prisma/
├── schema.prisma  # Database schema
└── seed.ts        # Sample data
```

## Features

- University & program search with filters
- Multi-step application form with document upload
- Student portal with application tracking
- Admin dashboard with analytics
- Scholarship listings
- Messaging system
- Payment architecture (gateway-ready)
- SEO (sitemap, robots.txt, structured data)
