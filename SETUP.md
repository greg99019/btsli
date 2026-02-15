# BTSLI LMS - Setup Instructions

## MongoDB Atlas Setup

This application uses MongoDB Atlas instead of Docker PostgreSQL.

### Steps to Setup:

1. **Create a MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Cluster"
   - Choose the FREE tier
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Create a username and password (remember these!)
   - Grant "Atlas Admin" or "Read and write to any database" privileges

4. **Setup Network Access**
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your specific IP)
   -Click "Confirm"

5. **Get Your Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

6. **Update the .env File**
   - Open `apps/api/.env`
   - Replace the DATABASE_URL with your connection string
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add `/btsli` before the `?` to specify the database name
   
   Example:
   ```
   DATABASE_URL="mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/btsli?retryWrites=true&w=majority"
   ```

7. **Generate Prisma Client**
   ```bash
   cd apps/api
   npx prisma generate
   ```

8. **Start the Application**
   ```bash
   # Terminal 1 - API Server (port 8000)
   cd apps/api
   npm run dev

   # Terminal 2 - Web Server (port 3000)
   cd apps/web
   npm run dev
   ```

9. **Access the Application**
   - Web: http://localhost:3000
   - API: http://localhost:8000

## Modern UI Features

The app now includes:
- ✨ Modern Tailwind CSS styling
- 🎨 Gradient designs and glass-morphism effects
- 📱 Responsive layout
- 🎯 Interactive hover effects
- 🌊 Smooth transitions and animations
- 🎪 Professional navigation with sticky header
- 📊 Feature cards with icons
- 🎭 Call-to-action sections

## Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: NestJS, Prisma ORM
- **Database**: MongoDB Atlas
- **Auth**: JWT with passport-jwt
