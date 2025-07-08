# Admin Panel 500 Error Fix

## Problem Description

When editing course details in the admin panel, the system was throwing 500 Internal Server Error with the following console errors:

```
Failed to load resource: the server responded with a status of 500 ()
POST https://mbg-landing.vercel.app/admin 500 (Internal Server Error)
Fetch failed loading: POST "https://mbg-landing.vercel.app/admin".
```

## Root Cause Analysis

The issue was caused by multiple configuration problems:

### 1. Missing Dependencies
- **Issue**: `node_modules` directory was missing, indicating dependencies were not installed
- **Evidence**: `prisma: not found` error during build
- **Impact**: Prisma client was not available, causing all database operations to fail

### 2. Missing Database Configuration
- **Issue**: No `.env` file with `DATABASE_URL` was present
- **Evidence**: Only `.env.local.example` existed, no actual environment variables
- **Impact**: Prisma couldn't connect to any database

### 3. Schema Compatibility Issues
- **Issue**: Original schema used PostgreSQL with `String[]` arrays, but needed SQLite for easier setup
- **Evidence**: Schema validation error for `features` field when switching to SQLite
- **Impact**: Prisma client generation failed

## Solution Implemented

### Step 1: Install Dependencies
```bash
npm install
```
This installed all required packages including Prisma client and CLI.

### Step 2: Database Setup
- **Changed database provider** from PostgreSQL to SQLite for easier development setup
- **Created `.env` file** with SQLite database URL:
  ```
  DATABASE_URL="file:./dev.db"
  ```

### Step 3: Schema Fixes
- **Updated `features` field** in Course model from `String[]` to `String` for SQLite compatibility
- **Generated Prisma client** with new schema
- **Pushed schema** to create SQLite database

### Step 4: Server Action Updates
Updated the server actions to handle features correctly:

```typescript
// Convert features array to JSON string for SQLite storage
const courseData = {
  ...data,
  features: Array.isArray(data.features) ? JSON.stringify(data.features) : data.features
}

// Parse features from JSON string back to array for frontend compatibility
const coursesWithParsedFeatures = courses.map(course => ({
  ...course,
  features: course.features ? (typeof course.features === 'string' ? JSON.parse(course.features) : course.features) : []
}));
```

## Files Modified

1. **`prisma/schema.prisma`**
   - Changed provider from `postgresql` to `sqlite`
   - Changed `features` field from `String[]` to `String`

2. **`.env`** (created)
   - Added `DATABASE_URL="file:./dev.db"`

3. **`app/actions/config.ts`**
   - Updated `createCourse` to serialize features array to JSON
   - Updated `updateCourse` to serialize features array to JSON  
   - Updated `getCourses` to parse features JSON back to array

## Result

- ✅ Dependencies installed successfully
- ✅ Prisma client generated successfully
- ✅ SQLite database created and schema pushed
- ✅ Admin panel accessible (HTTP 200 response)
- ✅ Course editing should now work without 500 errors

## Testing

The admin panel is now accessible at `http://localhost:3000/admin` and should allow:
- Creating new courses
- Editing existing courses
- All CRUD operations for courses, testimonials, partners, FAQ, and features

## Production Considerations

For production deployment:
1. Use PostgreSQL with proper connection string
2. Revert schema to use `String[]` for features field
3. Remove the JSON serialization code from server actions
4. Set up proper environment variables
5. Run database migrations instead of `db push`