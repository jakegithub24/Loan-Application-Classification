# Deployment Guide

This guide covers deploying the Loan Application Classification & Approval System to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Deployment Options](#deployment-options)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Docker](#docker)
  - [Traditional VPS](#traditional-vps)
  - [AWS](#aws)
  - [Google Cloud](#google-cloud)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- ✅ Source code pushed to GitHub/GitLab/Bitbucket
- ✅ Database credentials (if using PostgreSQL/MySQL)
- ✅ Domain name (optional)
- ✅ SSL certificate (for production)
- ✅ Monitoring/logging service configured

## Environment Setup

### 1. Environment Variables

Copy the example file and configure your production environment:

```bash
cp .env.example .env.production
```

**Critical variables for production:**

```env
# Database (use PostgreSQL for production)
DATABASE_URL="postgresql://user:password@host:5432/loan_app_db"

# Application
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# Security
# Add these before deploying:
# NEXTAUTH_SECRET="generate-a-secure-random-string"
```

**Generate secure secrets:**

```bash
# Generate NEXTAUTH_SECRET (if using auth)
openssl rand -base64 32
```

### 2. Database Setup

#### For PostgreSQL (Recommended for Production)

```bash
# Create database
createdb loan_app_db

# Run migrations
bun run db:push

# Or for production migrations
bun run db:migrate
```

#### For MySQL

```bash
# Create database
mysql -u root -p
CREATE DATABASE loan_app_db;
EXIT;

# Run migrations
bun run db:push
```

#### For SQLite (Development Only)

SQLite works for development and small-scale deployments, but consider PostgreSQL or MySQL for production due to:
- Better concurrency handling
- Advanced features (replication, backups)
- Better performance under load

## Deployment Options

### Vercel (Recommended)

Vercel is the easiest deployment option for Next.js applications.

#### Step 1: Prepare for Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login
```

#### Step 2: Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Step 3: Configure Environment Variables

In Vercel dashboard:
1. Go to **Settings > Environment Variables**
2. Add all variables from `.env.production`
3. Redeploy after adding variables

#### Vercel-Specific Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

**Database with Vercel:**

Use Vercel Postgres or connect to external PostgreSQL:

```bash
# Install Vercel Postgres
npm install @vercel/postgres
```

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}
```

### Docker

Docker provides consistent deployment across any platform.

#### Step 1: Create Dockerfile

```dockerfile
# Base image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Build application
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN bun run build

# Production image
FROM base AS production
ENV NODE_ENV=production

COPY --from=install /temp/dev/node_modules node_modules
COPY --from=build /app/.next .next
COPY --from=build /app/public public
COPY --from=build /app/prisma prisma
COPY package.json bun.lockb ./

EXPOSE 3000

CMD ["bun", "start"]
```

#### Step 2: Create docker-compose.yml (optional)

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/loan_app_db
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=loan_app_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Step 3: Build and Run

```bash
# Build image
docker build -t loan-app-system .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NODE_ENV="production" \
  loan-app-system

# Or use docker-compose
docker-compose up -d
```

### Traditional VPS

Deploy to any VPS provider (DigitalOcean, Linode, Hetzner, etc.).

#### Step 1: Server Setup

```bash
# SSH into server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install Nginx
sudo apt install -y nginx
```

#### Step 2: Install PM2 (Process Manager)

```bash
npm install -g pm2
```

#### Step 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/your-username/loan-application-system.git
cd loan-application-system

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env with production values

# Build application
bun run build

# Setup database
bun run db:push

# Start with PM2
pm2 start bun --name "loan-app" -- start
pm2 save
pm2 startup
```

#### Step 4: Configure Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/loan-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

### AWS

#### Option 1: AWS Amplify (Easiest)

1. Connect your GitHub repository to AWS Amplify
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install -g bun
           - bun install
       build:
         commands:
           - bun run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/.cache
   ```
3. Add environment variables in Amplify console
4. Deploy

#### Option 2: AWS EC2

Follow the "Traditional VPS" guide and use:
- EC2 instance (t3.medium or larger)
- RDS for PostgreSQL
- S3 for static assets (if any)
- CloudFront for CDN
- Route 53 for DNS
- Certificate Manager for SSL

#### Option 3: AWS ECS (Containerized)

1. Push Docker image to ECR
2. Create ECS task definition
3. Set up ECS service
4. Configure load balancer
5. Configure domain and SSL

### Google Cloud

#### Option 1: Cloud Run (Recommended)

```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/loan-app

gcloud run deploy loan-app \
  --image gcr.io/PROJECT_ID/loan-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="..."
```

#### Option 2: Google App Engine

Create `app.yaml`:

```yaml
runtime: nodejs18

env_variables:
  DATABASE_URL: "postgresql://..."
  NODE_ENV: "production"

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6
```

Deploy:

```bash
gcloud app deploy
```

## Post-Deployment Checklist

### Security

- [ ] SSL/HTTPS is enabled
- [ ] Environment variables are set correctly
- [ ] `.env` file is NOT committed to git
- [ ] Database is not publicly accessible
- [ ] API rate limiting is configured
- [ ] CORS is properly configured
- [ ] Security headers are set
- [ ] Dependencies are up to date

### Performance

- [ ] Build is optimized for production
- [ ] Images are optimized
- [ ] Database is indexed properly
- [ ] CDN is configured (if using static assets)
- [ ] Gzip/Brotli compression is enabled
- [ ] Caching is configured

### Monitoring

- [ ] Error tracking (Sentry, LogRocket, etc.)
- [ ] Logging is configured
- [ ] Uptime monitoring is set up
- [ ] Database backups are configured
- [ ] Performance monitoring is enabled

### Functionality

- [ ] All API endpoints work
- [ ] Database migrations ran successfully
- [ ] Email notifications work (if configured)
- [ ] File uploads work (if enabled)
- [ ] Authentication works (if implemented)

## Monitoring & Maintenance

### Log Management

#### Using PM2

```bash
# View logs
pm2 logs loan-app

# Monitor
pm2 monit

# Log rotation
pm2 install pm2-logrotate
```

#### Using Docker

```bash
# View logs
docker logs -f loan-app

# Log to file
docker run -v /var/log/loan-app:/app/logs loan-app
```

### Database Backups

#### PostgreSQL

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /backups/backup_$DATE.sql

# Keep last 7 days
find /backups -name "backup_*.sql" -mtime +7 -delete
```

Add to crontab:

```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

#### MySQL

```bash
mysqldump -u user -p database_name > backup.sql
```

### Health Checks

Create `/api/health` endpoint:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Check database
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Database connection failed',
      },
      { status: 503 }
    );
  }
}
```

### Update Procedure

```bash
# SSH into server
ssh user@your-server

# Navigate to app directory
cd /path/to/loan-application-system

# Pull latest changes
git pull origin main

# Install dependencies
bun install

# Run migrations
bun run db:migrate

# Rebuild
bun run build

# Restart application
pm2 restart loan-app

# Or with Docker
docker-compose pull
docker-compose up -d
```

## Troubleshooting

### Common Issues

#### Application Won't Start

```bash
# Check logs
pm2 logs loan-app

# Or Docker logs
docker logs loan-app

# Common fixes:
# 1. Check DATABASE_URL is correct
# 2. Ensure database is running
# 3. Verify all environment variables
```

#### Database Connection Failed

```bash
# Test connection
psql $DATABASE_URL

# Check if database exists
\l

# Check if migrations ran
bun run db:studio
```

#### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
bun install
bun run build

# Check Node.js version
node --version  # Should be 18+
bun --version
```

#### Out of Memory

Increase Node.js memory limit:

```bash
NODE_OPTIONS="--max-old-space-size=4096" bun start
```

Or in PM2:

```bash
pm2 start bun --name "loan-app" -- max-old-space-size=4096 start
```

### Performance Issues

1. **Enable caching**
2. **Optimize database queries**
3. **Use CDN for static assets**
4. **Enable gzip compression**
5. **Monitor with profiling tools**

### Security Issues

1. **Update dependencies regularly**: `bun update`
2. **Run security audit**: `bun audit`
3. **Review access logs**
4. **Implement rate limiting**
5. **Use Web Application Firewall (WAF)**

## Support

For deployment issues:
- Check GitHub Issues
- Review logs in detail
- Verify environment variables
- Test database connectivity
- Check security group/firewall settings

---

Need help? Open an issue on GitHub or contact support.
