# Deployment Guide

## Heroku Deployment (API Backend)

This guide will help you deploy the NestJS API backend to Heroku.

**App Name: btfd**
**Git Remote: Configured ✓**

### Prerequisites

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Create a Heroku account: https://signup.heroku.com/
3. Login to Heroku: `heroku login`

### Deployment Steps

The git remote is already configured for app name **btfd**.

1. **Create the Heroku app (if not already created)**
   ```bash
   heroku create btfd
   ```
   
   Or link to existing app:
   ```bash
   heroku git:remote -a btfd
   ```

3. **Set environment variables**
   ```bash
   heroku config:set DATABASE_URL="your-mongodb-atlas-connection-string" -a btfd
   heroku config:set JWT_SECRET="your-jwt-secret-key" -a btfd
   heroku config:set API_PORT=4100 -a btfd
   ```

4. **Deploy to Heroku**
   ```bash
   git push heroku master
   ```

5. **Verify deployment**
   ```bash
   heroku logs --tail -a btfd
   heroku open -a btfd
   ```

### Important Notes

- The API will be available at: `https://btfd.herokuapp.com`
- Heroku uses the `PORT` environment variable, which is set automatically
- The app is configured to use MongoDB Atlas (no local database needed)
- Prisma client is generated automatically during deployment

### Troubleshooting

- **Build failures**: Check logs with `heroku logs --tail -a btfd`
- **Database connection issues**: Verify DATABASE_URL is set correctly
- **Port issues**: Heroku sets PORT automatically; API_PORT is for local dev only

### Next.js Frontend Deployment

For the Next.js frontend (`apps/web`), consider deploying to:
- **Vercel** (recommended): https://vercel.com
- **Heroku**: Requires separate app configuration

To deploy the web app to Vercel:
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to `apps/web`
3. Run `vercel`
4. Set `NEXT_PUBLIC_API_BASE` to `https://btfd.herokuapp.com`
