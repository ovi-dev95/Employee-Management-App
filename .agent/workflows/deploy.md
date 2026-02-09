---
description: How to deploy the Employee Management App to Vercel
---

# Deployment Guide for Vercel

### 1. Database Setup (Crucial)
Vercel is serverless and does not support SQLite for persistent data. You must switch to a hosted PostgreSQL database (like **Neon.tech**, **Vercel Postgres**, or **Supabase**).

1. Create a PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
2. Get your `DATABASE_URL` (Direct Connection String).
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql" // Change from "sqlite" to "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

### 2. Prepare for Vercel
1. Add `prisma generate` to your `package.json` scripts to ensure Prisma client is ready on Vercel:
   ```json
   "scripts": {
     "postinstall": "prisma generate"
   }
   ```

### 3. Push to GitHub
If you haven't already:
1. Initialize Git: `git init`
2. Add all files: `git add .`
3. Commit: `git commit -m "Prepare for deployment"`
4. Create a repository on GitHub and push your code.

### 4. Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" > "Project"**.
2. Import your GitHub repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `NEXT_PUBLIC_APP_URL`: Your Vercel domain (once generated).
4. Click **Deploy**.

### 5. Initialize Database
After deployment, run the following command locally (with your cloud `DATABASE_URL` in your local `.env`) to sync the schema:
```bash
npx prisma db push
```
