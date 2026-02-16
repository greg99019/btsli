# Demo Login Credentials

## Quick Start

The login page now displays demo credentials prominently. Visit the login page to see them.

## Demo Accounts

### Client Account
- **Email:** `demo@btsli.com`
- **Password:** `Demo123!`
- **Role:** CLIENT
- **Use for:** Testing client features, booking sessions, viewing courses

### Coach Account
- **Email:** `coach@btsli.com`
- **Password:** `Demo123!`
- **Role:** COACH
- **Use for:** Testing coach features, managing appointments, viewing client bookings

## Setting Up Demo Users

### Method 1: Run the Seed Script (Recommended)
```bash
cd apps/api
npx ts-node prisma/seed.ts
```

### Method 2: Run the Standalone Script
```bash
cd apps/api
node create-demo-users.js
```

### Method 3: Use the API Directly
Register the accounts through the API:

**Client Account:**
```bash
curl -X POST https://btfd-283a411fb274.herokuapp.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Client",
    "email": "demo@btsli.com",
    "password": "Demo123!",
    "role": "CLIENT"
  }'
```

**Coach Account:**
```bash
curl -X POST https://btfd-283a411fb274.herokuapp.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Coach",
    "email": "coach@btsli.com",
    "password": "Demo123!",
    "role": "COACH"
  }'
```

## Login Page Features

The updated login page includes:
- ✨ Beautiful gradient design with glassmorphism effects
- 🎯 Prominent demo credential display
- ⚡ Auto-fill buttons for quick testing
- 📱 Fully responsive for mobile devices
- ✅ Success/error message display

## URLs

- **Local Development:** http://localhost:3001/login (or http://localhost:8080/login)
- **Production:** https://btsli.vercel.app/login
- **API:** https://btfd-283a411fb274.herokuapp.com

## Testing the Login

1. Visit the login page
2. Click "Auto-fill" next to either demo account
3. Click "Sign In"
4. Check browser console for the JWT token
5. Token is automatically saved to localStorage

## Security Note

⚠️ **Important:** These demo credentials should only be used in development/testing environments. For production, implement proper user registration and authentication flows.
