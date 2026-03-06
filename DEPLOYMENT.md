# Vercel Deployment Guide

## Prerequisites
- GitHub repository with code pushed (✅ Done)
- Vercel account (free tier works)
- PostgreSQL database (Supabase, Railway, Render, or similar)

## Step 1: Set Up PostgreSQL Database

### Option A: Supabase (Recommended - Free Tier)
1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to **Settings → Database** → Copy the connection string
4. Keep it safe - you'll need it in Step 3

### Option B: Railway
1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL
4. Copy the database URL from the dashboard

### Option C: Render
1. Go to https://render.com
2. Create PostgreSQL instance
3. Copy the external database URL

## Step 2: Connect GitHub to Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New..." → "Project"**
3. Select your GitHub repository: `tchiboub-dot/security-headers`
4. Click **"Import"**

## Step 3: Configure Environment Variables
Before deploying, add these environment variables in Vercel:

1. In the Vercel project settings, go to **Settings → Environment Variables**
2. Add the following variables:

| Key | Value | Type |
|-----|-------|------|
| `DATABASE_URL` | Your PostgreSQL connection string from Step 1 | Production |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL (e.g., `https://security-headers.vercel.app`) | Production |
| `NODE_ENV` | `production` | Production |

**Example DATABASE_URL format:**
```
postgresql://user:password@host:5432/database?schema=public
```

## Step 4: Deploy
1. Click **"Deploy"** in Vercel
2. Wait for the build to complete (should take 2-5 minutes)
3. Once deployed, your app is live at the Vercel URL

## Step 5: Run Database Migration (First Time Only)
After first deployment, you need to set up the database schema:

1. Open your terminal and run:
```bash
cd your-local-project
export DATABASE_URL="your-postgresql-connection-string"
npx prisma migrate deploy
```

Or use Vercel CLI:
```bash
vercel env pull  # Downloads env vars
npx prisma migrate deploy
```

## Troubleshooting

### Build Failed Error
**Problem:** `npm run build` exited with 1
**Solutions:**
1. Ensure `DATABASE_URL` is set in Vercel environment variables
2. Check that you're using PostgreSQL (not SQLite) for production
3. Verify the connection string is correct

### Database Connection Error
**Problem:** "Can't reach database server"
**Solutions:**
1. Verify the database is running
2. Check the connection string format
3. Ensure IP whitelisting is disabled (or add Vercel's IP range)

### Prisma Migration Error
**Problem:** "Schema doesn't match database"
**Solutions:**
1. Run `npx prisma migrate deploy` after deployment
2. Or use `npx prisma db push` to sync schema
3. Ensure only one person runs migrations at a time

## Local Testing Before Deployment

To test production build locally:
```bash
# Create .env.production.local for local testing
cp .env.example .env.production.local

# Update DATABASE_URL to your PostgreSQL in .env.production.local
npm run build
npm run start  # Starts production build locally on :3000
```

## Redeploying

To redeploy with updates:
```bash
git add .
git commit -m "Update: description"
git push origin main
```

Vercel automatically deploys when you push to `main` branch.

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Production) | `postgresql://...` |
| `NEXT_PUBLIC_APP_URL` | Public app URL for redirects | `https://security-headers.vercel.app` |
| `NODE_ENV` | Deployment environment | `production` |

## Important Notes

⚠️ **Never commit `.env.production.local`** - environment variables should only be in Vercel dashboard

⚠️ **SQLite doesn't work on Vercel** - Use PostgreSQL for production

⚠️ **First deployment requires schema migration** - See Step 5

✅ **Database is created automatically** when you run `prisma migrate deploy`

## Support

If deployment still fails:
1. Check Vercel build logs for specific error messages
2. Verify DATABASE_URL format matches your provider
3. Ensure GitHub repository is up to date
4. Try redeploying via Vercel dashboard
