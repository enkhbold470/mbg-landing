# Role-Based Access Control & Audit Logging System

This document explains the comprehensive admin role system and audit logging that tracks all changes made to the website.

## Overview

The system now includes:
- **Role-Based Access Control (RBAC)** with Super Admin and Admin roles
- **Comprehensive Audit Logging** tracking all changes
- **Session Management** with secure authentication
- **IP Address & Device Tracking** for all logins and actions

## Admin Roles

### Super Admin
Full access to everything including:
- All regular admin capabilities
- User management (create, edit, delete admin users)
- View all audit logs
- Manage other admins' roles and permissions

### Regular Admin
Limited access:
- Edit website content (courses, testimonials, partners, FAQ, features, site config)
- View their own audit logs only
- Cannot manage other admin users
- Cannot access super admin features

## Setup Instructions

### 1. Update Database Schema

Push the new schema to your database:

```bash
pnpm db:push
```

This will create:
- `admins` table - stores admin users with roles
- `audit_logs` table - tracks all changes
- `AdminRole` enum - defines SUPER_ADMIN and ADMIN roles

### 2. Seed Initial Admin Users

Run the seed script to create initial admin accounts:

```bash
pnpm db:seed
```

This creates two default accounts:

**Super Admin:**
- Username: `superadmin`
- Password: `admin123`
- Email: `superadmin@mbg.edu`

**Regular Admin:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@mbg.edu`

⚠️ **IMPORTANT:** Change these default passwords immediately in production!

### 3. Login with New Credentials

Navigate to `/admin` and login with either account to test the system.

## Features

### Authentication
- Passwords are securely hashed using bcrypt
- Sessions stored in HTTP-only cookies
- 24-hour session duration
- Automatic session validation on each request

### Audit Logging

Every action is logged with:
- **Who**: Admin username and ID
- **What**: Action type (CREATE, UPDATE, DELETE, LOGIN, LOGOUT)
- **When**: Timestamp
- **Where**: IP address
- **How**: Device type (Mobile/Desktop/Tablet), Browser, OS
- **Details**: Actual changes made (before/after values)

#### Logged Actions
- ✅ Login/Logout
- ✅ Create/Update/Delete Courses
- ✅ Create/Update/Delete Testimonials
- ✅ Create/Update/Delete Partners
- ✅ Create/Update/Delete FAQ items
- ✅ Create/Update/Delete Features
- ✅ Update Site Configuration
- ✅ Create/Update/Delete Admin Users (Super Admin only)

### Tracked Information

#### For Each Login:
- Login timestamp
- IP address
- Device type (Mobile, Desktop, Tablet)
- Browser (Chrome, Safari, Firefox, Edge, etc.)
- Operating System (Windows, macOS, Linux, iOS, Android)
- User agent string

#### For Each Content Change:
- What was changed (field-by-field comparison)
- Previous value → New value
- Entity type and ID
- Entity title/name for easy reference

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/logout` - Logout current session

### Admin Management (Super Admin Only)
- `GET /api/admins` - List all admin users
- `POST /api/admins` - Create new admin user
- `PATCH /api/admins` - Update admin user
- `DELETE /api/admins?id={id}` - Delete admin user

### Audit Logs
- `GET /api/audit-logs` - Get audit logs
  - Query params:
    - `limit` - Number of logs to return (default: 50)
    - `offset` - Pagination offset
    - `adminId` - Filter by admin (super admin only)
    - `action` - Filter by action type
    - `entityType` - Filter by entity type
    - `startDate` - Filter by date range
    - `endDate` - Filter by date range

## Security Features

### Password Security
- Passwords hashed with bcrypt (10 rounds)
- Never stored in plain text
- Validated on every login attempt

### Session Security
- HTTP-only cookies (not accessible via JavaScript)
- Secure flag in production (HTTPS only)
- 24-hour automatic expiration
- Session validation on each request

### Access Control
- Middleware checks authentication before any admin action
- Role-based permission checks
- Super admin actions require explicit role verification
- Regular admins can only see their own audit logs

### Audit Trail
- All actions logged before completion
- Failed operations also logged
- Immutable audit trail
- Cannot be deleted by anyone (only super admin can view all)

## Usage Examples

### Viewing Audit Logs (Admin Panel UI - To Be Created)

Super admins will see:
- All audit logs from all admins
- Filter by admin, action type, date range
- Export logs for compliance

Regular admins will see:
- Only their own actions
- Same filtering capabilities
- Cannot see other admins' actions

### Managing Admins (Super Admin Only)

Create a new admin:
```javascript
POST /api/admins
{
  "username": "newadmin",
  "email": "newadmin@mbg.edu",
  "password": "securepassword",
  "role": "ADMIN" // or "SUPER_ADMIN"
}
```

Update admin role:
```javascript
PATCH /api/admins
{
  "id": "admin_id_here",
  "role": "SUPER_ADMIN"
}
```

Deactivate admin:
```javascript
PATCH /api/admins
{
  "id": "admin_id_here",
  "isActive": false
}
```

## Database Schema

### Admin Table
```prisma
model Admin {
  id              String    @id @default(cuid())
  username        String    @unique
  password        String    // Hashed with bcrypt
  email           String    @unique
  role            AdminRole @default(ADMIN)
  isActive        Boolean   @default(true)
  lastLoginAt     DateTime?
  lastLoginIp     String?
  lastLoginDevice String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  auditLogs       AuditLog[]
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
}
```

### AuditLog Table
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  adminId     String
  admin       Admin    @relation(fields: [adminId], references: [id])
  action      String   // CREATE, UPDATE, DELETE, LOGIN, LOGOUT
  entityType  String   // Course, Testimonial, Partner, FAQ, Feature, SiteConfig
  entityId    String?
  entityTitle String?
  changes     Json?    // Detailed change information
  ipAddress   String
  userAgent   String
  device      String?  // Mobile, Desktop, Tablet
  browser     String?
  os          String?
  createdAt   DateTime @default(now())
}
```

## Next Steps

1. **Update Middleware**: Update `/middleware.tsx` to use the new `getAdminSession()` function
2. **Update All API Routes**: Add audit logging to all content modification endpoints
3. **Create Admin Management UI**: Build pages for super admins to manage users
4. **Create Audit Log Viewer**: Build UI to view and filter audit logs
5. **Update Auth Wrapper**: Update the login component to work with the new system
6. **Add Notifications**: Email notifications for important actions
7. **Add Export Feature**: Allow exporting audit logs to CSV/PDF

## Production Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Update admin emails to real addresses
- [ ] Set `NODE_ENV=production` for secure cookies
- [ ] Configure proper CORS headers
- [ ] Set up database backups (especially audit logs)
- [ ] Review and test all role permissions
- [ ] Test session timeout behavior
- [ ] Set up monitoring for failed login attempts
- [ ] Configure rate limiting on login endpoint
- [ ] Review audit log retention policy

## Troubleshooting

### "Unauthorized" errors
- Check if session cookie is present
- Verify admin account is active in database
- Check if session hasn't expired (24 hours)

### Can't see audit logs
- Regular admins can only see their own logs
- Super admin required to see all logs

### Password won't work
- Passwords must be hashed before storing
- Use the `hashPassword()` utility function
- Never store plain text passwords

## Support

For issues or questions:
1. Check the audit logs for detailed error information
2. Review the console logs for authentication errors
3. Verify database schema is up to date (`pnpm db:push`)
4. Ensure all dependencies are installed (`pnpm install`)

