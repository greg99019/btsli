# Deploy Next.js Frontend to Vercel

## Quick Deploy Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to the web app directory**:
   ```bash
   cd apps/web
   ```

4. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "Yes" when asked to link to existing project or create new
   - Select your account/team
   - Confirm the settings

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Environment Variables

The app is already configured with the API URL in `vercel.json`:
- `NEXT_PUBLIC_API_BASE=https://btfd-283a411fb274.herokuapp.com`

If you need to change it, you can:
1. Go to your project on vercel.com
2. Settings → Environment Variables
3. Add/Update `NEXT_PUBLIC_API_BASE`
4. Redeploy

## Alternative: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub/GitLab/Bitbucket
3. Import your repository
4. Set Root Directory to: `apps/web`
5. Add environment variable: `NEXT_PUBLIC_API_BASE=https://btfd-283a411fb274.herokuapp.com`
6. Deploy!

## Your API Endpoint
Backend API: https://btfd-283a411fb274.herokuapp.com/

After deployment, your frontend will be available at: `https://your-project.vercel.app`
