# AITHLETE - AI Fitness Tracker

A modern fitness tracking web application built with Next.js, featuring workout logging, goal tracking, schedule management, AI-powered coaching, and comprehensive analytics.

## Features

- **Authentication** — Login, register, and profile management
- **Dashboard** — At-a-glance stats, progress charts, AI coach panel, weekly analytics, muscle recovery, and today's schedule
- **Workout Tracking** — Log workouts with exercises, sets, reps, weight, duration, calories, and heart rate
- **Exercise Library** — Browse exercises by muscle group, equipment, and difficulty
- **Schedule Management** — Create, edit, delete, and track scheduled activities with completion toggling
- **Goal Tracking** — Set fitness goals (workouts, volume, calories, streak, custom) with progress tracking
- **Progress Tracking** — Body weight, strength metrics, consistency, and muscle volume charts
- **Analytics** — Total volume, avg session, sessions/month, goal completion, weekly volume charts, and muscle distribution
- **AI Coach** — AI-powered recommendations, fatigue analysis, recovery scores, and plateau detection (feature-toggled)

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui + Radix UI |
| **Icons** | Lucide React |
| **State Management** | Zustand |
| **Server State** | TanStack Query |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Notifications** | Sonner |
| **API Mocking** | Mockoon |

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (auth)/               # Auth route group (login, register)
│   └── dashboard/            # Protected dashboard routes
│       ├── page.tsx          # Main dashboard
│       ├── workouts/         # Workout management
│       ├── schedule/         # Schedule management
│       ├── goals/            # Goal management
│       ├── exercises/        # Exercise library
│       ├── progress/         # Progress tracking
│       ├── analytics/        # Analytics & charts
│       ├── ai/               # AI Coach
│       └── profile/          # User profile
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── layout/               # Sidebar, Topbar, Shell
│   ├── dashboard/            # Dashboard widgets
│   ├── workout/              # Workout components
│   ├── schedule/             # Schedule components
│   └── goal/                 # Goal components
├── services/                 # API service layer
│   ├── auth.service.ts
│   ├── workout.service.ts
│   ├── schedule.service.ts
│   ├── goal.service.ts
│   ├── exercise.service.ts
│   ├── progress.service.ts
│   ├── ai.service.ts
│   ├── analytics.service.ts
│   ├── profile.service.ts
│   ├── *.queries.ts          # TanStack Query hooks
│   └── query-keys.ts         # Query key definitions
├── stores/                   # Zustand stores
│   ├── auth.store.ts
│   ├── workout.store.ts
│   ├── ai.store.ts
│   └── ui.store.ts
├── types/                    # TypeScript type definitions
├── lib/                      # Utilities
│   ├── api-client.ts         # Axios instance with interceptors
│   ├── query-options.ts      # Query key helpers
│   └── utils.ts              # cn() utility
└── hooks/                    # Custom React hooks
```

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | >= 18.0 | [Download](https://nodejs.org/) |
| **npm** | >= 9.0 | Comes with Node.js |
| **Mockoon** | >= 8.0 | [Download](https://mockoon.com/) — for local API mocking |

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and configure:

```bash
cp .env .env.local
```

Edit `.env.local`:

```env
# API base URL (Mockoon runs on port 3001 by default)
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Enable/disable AI Coach features
NEXT_PUBLIC_AI_ENABLED=true
```

### 3. Set Up Mockoon (API Mocking)

1. Download and install [Mockoon](https://mockoon.com/)
2. Open Mockoon and import `mockoon-aithlete-api.json`
3. Start the mock server (default port: **3001**)
4. Verify the endpoint prefix is `/api` in Mockoon settings

The mock file includes **50+ endpoints** covering:
- Auth (login, register, logout, me, refresh)
- Workouts (CRUD + stats)
- Exercises (list, detail, muscle groups)
- Schedules (CRUD + today + toggle)
- Goals (CRUD + toggle + progress)
- Progress (body weight, strength, consistency, muscle volume, overview)
- AI (recommendations, chat, fatigue, recovery, plateau)
- Analytics (dashboard, weekly, streak, overview, volume)
- Profile (update)

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## API Response Format

All API endpoints return data in this structure:

```json
{
  "transaction": {
    "status_code": 200,
    "status_desc": "OK"
  },
  "data": { ... },
  "meta": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

## Feature Toggles

| Flag | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_AI_ENABLED` | Enables AI Coach tab and dashboard AI widgets | `false` |

## Data Flow

See [DATA_FLOW.md](./DATA_FLOW.md) for detailed documentation on:
- Where each metric is input
- How calculations are performed
- API endpoint mappings
- Frontend display components

## Authentication

- Login redirects to `/dashboard` on success
- Logout redirects to `/login`
- Unauthenticated access to `/dashboard/*` redirects to `/login`
- 401 responses from API trigger automatic logout

## Building for Production

```bash
npm run build
npm run start
```

Set `NEXT_PUBLIC_API_URL` to your production API endpoint in `.env.production`.

## License

Private — All rights reserved.
