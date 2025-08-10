# Tovis License Verification System - Setup Guide

## Prerequisites

1. **Node.js 20+** (currently using Node.js 18 which is deprecated for Supabase)
2. **pnpm** package manager
3. **Supabase account** (free tier is sufficient)

## 1. Supabase Setup

### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be ready (usually 2-3 minutes)

### Get Your Credentials
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Service Role Key** (secret key, starts with `eyJ`)

### Create Storage Bucket
1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `licenses-private`
3. Set it as **Private** (not public)
4. Configure RLS (Row Level Security) policies as needed

## 2. Environment Configuration

Update `apps/web/.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NextAuth Configuration  
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Email Configuration (for development)
EMAIL_SERVER_HOST=localhost
EMAIL_SERVER_PORT=1025
EMAIL_FROM=no-reply@tovis.local
```

### Generate NEXTAUTH_SECRET
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## 3. Email Setup (Optional for Development)

For email authentication to work, you need a mail server. For development, you can use Mailpit:

```bash
# Install Mailpit (lightweight mail server for development)
# On macOS with Homebrew:
brew install mailpit

# On Linux/Windows, download from: https://github.com/axllent/mailpit/releases

# Run Mailpit
mailpit
```

Mailpit will run on `localhost:1025` (SMTP) and provide a web interface at `http://localhost:8025`.

## 4. Database Setup (Future Enhancement)

Currently, the app uses in-memory storage. For production, you'll want to:

1. Set up Supabase database tables
2. Configure Drizzle ORM with your database
3. Run migrations

## 5. Running the Application

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 6. Testing the Full Workflow

1. **Upload License**: Go to `/pro/verification`
   - Fill out the form with license details
   - Upload front/back images
   - Submit the form

2. **Admin Review**: Go to `/admin/licenses/pending`
   - View submitted licenses
   - Approve or reject licenses

## Current Development Status

- ✅ **File Upload**: Ready (needs Supabase configuration)
- ✅ **License Management**: Working with in-memory storage
- ✅ **Admin Panel**: Functional (auth bypassed for development)
- ⚠️ **Authentication**: Needs mail server for full functionality
- ⚠️ **Database**: Using in-memory storage (not persistent)

## Production Considerations

1. **Authentication**: Set up proper role-based access control
2. **Database**: Migrate from in-memory to persistent storage
3. **File Storage**: Configure proper RLS policies in Supabase
4. **Email**: Use a production email service (SendGrid, AWS SES, etc.)
5. **Environment Variables**: Use secure secret management
