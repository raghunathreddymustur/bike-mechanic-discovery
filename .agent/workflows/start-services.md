---
description: Start all application services (frontend and auth-service)
---

# Start Services Workflow

Follow these steps to bring up all services for the bike-mechanic-discovery application:

## Step 1: Start Frontend Service
Open a terminal and run:
```bash
cd c:\Users\Raghunath Mustur\Videos\antigravity\bikeMechanicProto\bike-mechanic-discovery
npm run dev
```

The frontend will be available at: http://localhost:5173

## Step 2: Start Auth Service  
Open a **second terminal** and run:
```bash
cd c:\Users\Raghunath Mustur\Videos\antigravity\bikeMechanicProto\bike-mechanic-discovery\auth-service
// turbo
tsx src/server.ts
```

Or alternatively:
```bash
npm run dev
```

The auth service will be available at: http://localhost:3001

## Step 3: Verify Services
Check that both services are running:
- Frontend: http://localhost:5173
- Auth API Health: http://localhost:3001/api/auth/health

## Notes
- Both services must be running simultaneously for the app to work
- MongoDB Atlas connection is already configured in auth-service/.env
- Frontend automatically makes API calls to auth-service on port 3001
