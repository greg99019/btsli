# BTSLI LMS + Booking (Full Stack Monorepo)

This repo includes:
- Postgres (Docker)
- NestJS API + Prisma
- Next.js Web

## Quick start

### 1) Start Postgres
```bash
docker compose up -d
```

### 2) API
```bash
cd apps/api
cp ../../.env.example ../../.env
npm i
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

API: http://localhost:4000

### 3) Web
```bash
cd apps/web
cp .env.local.example .env.local
npm i
npm run dev
```

Web: http://localhost:3000

## Notes
- Seed script loads the services/pricing.
- You will need to create at least one COACH user, CoachProfile, CoachService links, and AvailabilitySlots
  (use Prisma Studio: `cd apps/api && npx prisma studio`).
- LMS frontend expects you to enroll in a course and have lessons/assessments seeded/created (admin UI can be added next).
