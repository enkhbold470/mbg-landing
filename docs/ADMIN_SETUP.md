# MBG Admin Panel Setup

This is a simple admin panel for managing the MBG Education website content.

## Features

- **Simple Authentication**: Username: `admin`, Password: `admin123`
- **Site Configuration**: Edit basic site information
- **Course Management**: Add, edit, and delete courses
- **Content Management**: Manage testimonials, partners, FAQ, and features
- **Database Integration**: All data is stored in PostgreSQL via Prisma

## Setup Instructions

### 1. Database Setup

First, make sure you have a PostgreSQL database running. Add your database URL to `.env`:

```
DATABASE_URL="postgresql://username:password@localhost:5432/mbg_education"
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Generate Prisma Client

```bash
pnpm db:generate
```

### 4. Push Database Schema

```bash
pnpm db:push
```

### 5. Seed Initial Data (Optional)

To populate the database with initial data from your site configuration:

```bash
pnpm db:seed
```

### 6. Start Development Server

```bash
pnpm dev
```

## Using the Admin Panel

1. Navigate to `/admin` in your browser
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Use the tabs to manage different sections:
   - **Site Config**: Basic site information
   - **Courses**: Course listings and details
   - **Testimonials**: Customer testimonials
   - **Partners**: Partner organizations
   - **FAQ**: Frequently asked questions
   - **Features**: Site features

## Security Notes

- The admin panel uses simple hardcoded authentication for demo purposes
- In production, implement proper authentication with hashed passwords
- The authentication is session-based using HTTP-only cookies
- Consider adding role-based permissions for multiple admin users

## Database Schema

The admin panel manages the following database tables:

- `site_config`: Basic site configuration
- `courses`: Course listings with all details
- `testimonials`: Customer testimonials
- `partners`: Partner organizations
- `faq`: Frequently asked questions
- `features`: Site features

All changes made through the admin panel are immediately reflected in the database and will be available to your Next.js application.

## Authentication Details

- Session duration: 24 hours
- Cookie-based authentication
- Logout clears the session
- No registration - hardcoded credentials only

---

Created by Enkhbold Ganbold - https://github.com/enkhbold470 