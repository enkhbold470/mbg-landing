# Quick Setup Instructions for RBAC & Audit Logging

## 🚀 What Has Been Implemented

### ✅ Completed:
1. **Database Schema** - Admin and AuditLog models with role system
2. **Authentication System** - Secure password hashing with bcrypt, session management
3. **Authorization System** - Role-based access control (Super Admin vs Admin)
4. **Audit Logging** - Comprehensive tracking with IP, device, browser, OS
5. **API Endpoints** - Login/logout with audit logging
6. **Admin Management API** - CRUD operations for managing admin users
7. **Audit Logs API** - Query and filter audit logs
8. **Database Seed** - Creates initial super admin and regular admin accounts

## 📋 Required Setup Steps

### Step 1: Push Database Schema
```bash
pnpm db:push
```

This creates the new `admins` and `audit_logs` tables in your database.

### Step 2: Seed Initial Admin Accounts
```bash
pnpm db:seed
```

This creates two admin accounts:
- **Super Admin**: username: `superadmin`, password: `admin123`
- **Regular Admin**: username: `admin`, password: `admin123`

⚠️ **Change these passwords immediately after first login!**

### Step 3: Test Login
1. Navigate to `/admin`
2. Login with `superadmin` / `admin123`
3. Verify authentication works

## 🔄 What Needs To Be Done Next

### High Priority:

#### 1. Update Middleware
The middleware at `/middleware.tsx` needs to be updated to use the new `getAdminSession()` function instead of checking for `admin-auth` cookie.

#### 2. Update Admin Panel Layout
Update `/app/admin/layout.tsx` and `/app/admin/page.tsx` to:
- Use new `getAdminSession()` to check authentication
- Display user's role and username
- Show logout button
- Add navigation for Admin Management (super admin only)
- Add navigation for Audit Logs

#### 3. Add Audit Logging to All API Routes
Update these API routes to include audit logging:
- `/app/api/courses/route.ts` - Log course create/update/delete
- `/app/api/testimonials/route.ts` - Log testimonial changes
- `/app/api/partners/route.ts` - Log partner changes
- `/app/api/faqs/route.ts` - Log FAQ changes
- `/app/api/features/route.ts` - Log feature changes
- `/app/api/site-config/route.ts` - Log site config changes

Example pattern:
```typescript
import { requireAuth } from '@/lib/auth'
import { logCreate, logUpdate, logDelete } from '@/lib/audit'

export async function POST(request: NextRequest) {
  const session = await requireAuth() // Require authentication
  
  // ... your existing logic ...
  const course = await prisma.course.create({ data })
  
  // Log the action
  await logCreate(session, 'Course', course.id, course.title, course)
  
  return NextResponse.json({ course })
}
```

#### 4. Create Admin Management UI (Super Admin Only)
Create `/app/admin/users/page.tsx` with:
- List all admin users
- Create new admin
- Edit admin (username, email, password, role, isActive)
- Delete admin (can't delete yourself)
- Show last login info

#### 5. Create Audit Log Viewer UI
Create `/app/admin/audit-logs/page.tsx` with:
- Table showing all audit logs
- Filters: admin, action type, entity type, date range
- Pagination
- View detailed changes (JSON viewer)
- Export to CSV option
- Super admins see all logs, regular admins see only their own

### Medium Priority:

#### 6. Update Auth Wrapper Component
Update `/components/admin/auth-wrapper.tsx` to:
- Use the new login API properly
- Handle role display
- Show admin username after login

#### 7. Add Role-Based UI Elements
- Hide "Admin Management" nav item from regular admins
- Show role badge in header (Super Admin vs Admin)
- Add tooltips explaining what each role can do

#### 8. Add Password Change Feature
Create UI for admins to change their own password
- Current password verification
- New password with confirmation
- Password strength indicator

### Low Priority:

#### 9. Email Notifications
- Send email when new admin is created
- Notify on password changes
- Alert super admins of suspicious activity

#### 10. Security Enhancements
- Add rate limiting to login endpoint
- Add CAPTCHA after failed login attempts
- Add 2FA option for super admins
- Add session management (view active sessions, logout all)

#### 11. Audit Log Enhancements
- Add export to PDF feature
- Add scheduled reports (daily/weekly summaries)
- Add audit log retention policy
- Add ability to archive old logs

## 🧪 Testing

### Test Super Admin Access:
1. Login as `superadmin`
2. Navigate to `/api/admins` (should return all admins)
3. Navigate to `/api/audit-logs` (should see all logs)
4. Try creating a new admin via API

### Test Regular Admin Access:
1. Login as `admin`
2. Navigate to `/api/admins` (should return 403 Forbidden)
3. Navigate to `/api/audit-logs` (should see only your own logs)
4. Try accessing admin management (should be denied)

### Test Audit Logging:
1. Login and check `/api/audit-logs` - should see LOGIN action
2. Create/edit content and check logs - should see changes tracked
3. Logout and check logs - should see LOGOUT action

## 📊 Database Schema

### Admin Table
- `id` - Unique identifier
- `username` - Unique username
- `password` - Bcrypt hashed password
- `email` - Unique email
- `role` - SUPER_ADMIN or ADMIN
- `isActive` - Account status
- `lastLoginAt` - Last login timestamp
- `lastLoginIp` - Last login IP address
- `lastLoginDevice` - Device type (Mobile/Desktop/Tablet)

### AuditLog Table
- `id` - Unique identifier
- `adminId` - Who performed the action
- `action` - CREATE, UPDATE, DELETE, LOGIN, LOGOUT
- `entityType` - Course, Testimonial, Partner, FAQ, Feature, SiteConfig, Admin
- `entityId` - ID of the affected entity
- `entityTitle` - Human-readable identifier
- `changes` - JSON containing actual changes
- `ipAddress` - IP address of the request
- `userAgent` - Browser user agent string
- `device` - Mobile, Desktop, or Tablet
- `browser` - Browser name
- `os` - Operating system
- `createdAt` - When the action occurred

## 🔐 Security Considerations

### Passwords
- All passwords are hashed with bcrypt (10 rounds)
- Never log or display passwords
- Enforce strong password policy in production

### Sessions
- HTTP-only cookies prevent XSS attacks
- Secure flag in production ensures HTTPS
- 24-hour automatic expiration
- Session validation on every request

### Audit Logs
- Cannot be modified or deleted (append-only)
- All administrative actions are logged
- IP and device tracking for forensics
- Regular admins can only see their own logs

## 📝 Example Usage

### Create a New Admin (API)
```bash
curl -X POST http://localhost:3000/api/admins \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newadmin",
    "email": "newadmin@mbg.edu",
    "password": "SecurePassword123!",
    "role": "ADMIN"
  }'
```

### Query Audit Logs (API)
```bash
# Get all logs (super admin only)
curl http://localhost:3000/api/audit-logs

# Filter by action
curl http://localhost:3000/api/audit-logs?action=CREATE

# Filter by date range
curl http://localhost:3000/api/audit-logs?startDate=2025-01-01&endDate=2025-12-31

# Pagination
curl http://localhost:3000/api/audit-logs?limit=20&offset=40
```

## 🆘 Troubleshooting

### "Unauthorized" Error
- Check if you're logged in
- Verify session cookie exists
- Check if admin account is active

### "Forbidden" Error
- Regular admin trying to access super admin features
- Check role in database: `SELECT * FROM admins WHERE username = 'your_username'`

### Audit Logs Not Appearing
- Verify Prisma client was regenerated: `pnpm db:generate`
- Check database schema is up to date: `pnpm db:push`
- Look for errors in server console

### Can't Login After Setup
- Verify seed ran successfully: check for admin accounts in database
- Clear browser cookies
- Check database connection

## 📚 Reference Documentation

- Full documentation: See `/RBAC_AUDIT_SETUP.md`
- Authentication utilities: `/lib/auth.ts`
- Audit logging utilities: `/lib/audit.ts`
- Admin API: `/app/api/admins/route.ts`
- Audit Logs API: `/app/api/audit-logs/route.ts`

## ✅ Quick Checklist

Before going to production:
- [ ] Run `pnpm db:push`
- [ ] Run `pnpm db:seed`
- [ ] Change all default passwords
- [ ] Update admin email addresses
- [ ] Add audit logging to all API routes
- [ ] Create admin management UI
- [ ] Create audit log viewer UI
- [ ] Test all role permissions
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts

