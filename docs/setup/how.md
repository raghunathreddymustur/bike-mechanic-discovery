# How to Set Up and Run Bike Mechanic Discovery

This document contains all the setup steps, changes made, and instructions to get this project running on a new system.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Options](#architecture-options)
4. [Running with npm (Development)](#running-with-npm-development)
5. [Running with Docker Compose (Recommended)](#running-with-docker-compose-recommended)
6. [Configuration Files](#configuration-files)
7. [Changes Made to the Project](#changes-made-to-the-project)
8. [Testing OTP Flow](#testing-otp-flow)
9. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Bike Mechanic Discovery** is a full-stack application that connects customers with bike mechanics.

**Tech Stack:**
- **Frontend**: React 18, TypeScript, Vite, Leaflet (maps)
- **Backend**: Express.js (TypeScript), MongoDB Atlas  
- **Infrastructure**: Docker Compose + Traefik API Gateway
- **Authentication**: JWT tokens, OTP verification
- **Styling**: Vanilla CSS

---

## Prerequisites

### Option 1: npm Development (Simple)
1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **tsx** (TypeScript runner) - Install globally: `npm install -g tsx`
4. **MongoDB Atlas Account** - Already configured

### Option 2: Docker Compose (Recommended)
1. **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
   - Windows/Mac: Includes Docker Compose
   - Linux: Install Docker + Docker Compose separately
2. **MongoDB Atlas Account** - Already configured

---

## Architecture Options

We support two deployment modes:

### Mode 1: npm Development
**Best for**: Initial setup, learning the codebase, quick prototyping

- Manually start each service in separate terminals
- Services run directly on your machine (no containers)
- Ports: Frontend (5173), Auth Service (3001)
- Hardcoded service URLs

### Mode 2: Docker Compose (Recommended)
**Best for**: Production-like development, team collaboration, scaling

- All services start with one command  
- Services run in isolated containers
- Automatic service discovery via Traefik gateway
- Access via domain names: `app.localhost`, `api.localhost`
- Production-ready architecture

**See [firstMigration.md](./firstMigration.md) for detailed architecture comparison**

---

## Running with npm (Development)

### Initial Setup

#### 1. Install Frontend Dependencies
```bash
cd bike-mechanic-discovery
npm install
```

#### 2. Install Auth Service Dependencies
```bash
cd auth-service
npm install
```

#### 3. Install tsx Globally 
```bash
npm install -g tsx  
```

#### 4. Configure Environment
```bash
# Copy template
cd auth-service
cp .env.example .env

# Edit .env and add your MongoDB URI
```

### Starting Services

**Terminal 1 - Frontend:**
```bash
cd bike-mechanic-discovery
npm run dev
```

Expected output:
```
VITE v4.5.14  ready in 3663 ms
➜  Local:   http://127.0.0.1:5173/
```

**Terminal 2 - Auth Service:**
```bash
cd bike-mechanic-discovery/auth-service  
tsx src/server.ts
# or: npm run dev
```

Expected output:
```
✅ Database loaded: 11 users
🔐 Authentication Service running on http://localhost:3001
🌐 CORS enabled for: http://localhost:5173
```

### Access
- **Frontend**: http://localhost:5173
- **Auth API**: http://localhost:3001/api/auth/health

---

## Running with Docker Compose (Recommended)

### Why Docker Compose?

✅ **No More Hardcoded Ports** - Services discover each other automatically  
✅ **Single Command Start** - `docker-compose up` starts everything  
✅ **Production Parity** - Local setup mirrors production  
✅ **Easy Scaling** - Run multiple instances with one flag  
✅ **Service Isolation** - Each service in its own container  
✅ **Built-in Health Checks** - Know when services are ready  

**Read [firstMigration.md](./first Migration.md) for full architecture details**

### Initial Setup

#### 1. Verify Docker Installation
```bash
docker --version
docker-compose --version
```

Should show Docker 20.10+ and Docker Compose 2.0+

#### 2. Configure Environment
```bash
# Copy Docker environment template
cd bike-mechanic-discovery
cp .env.docker.example .env

# Edit .env and add your MongoDB URI
# (Same URI as in auth-service/.env if you have it)
```

Example `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bike-mechanic-auth?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
```

### Starting Services

```bash
# Build and start all services (first time)
docker-compose up --build

# Or run in background
docker-compose up -d --build

# View logs (if running in background)
docker-compose logs -f
```

**What Happens:**
1. Traefik API Gateway starts (port 80, dashboard 8080)
2. Frontend builds and starts (internal port 3000)
3. Auth service builds and starts (internal port 3001)  
4. Automatic routing configured
5. Health checks verify everything is ready

Expected output:
```
✔ Container bike-mechanic-traefik  Started
✔ Container bike-mechanic-auth     Started  
✔ Container bike-mechanic-frontend Started
```

### Access Services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://app.localhost | Main application |
| **Auth API** | http://api.localhost/auth/health | Auth endpoints |
| **Traefik Dashboard** | http://localhost:8080 | Service monitoring |

> **Note**: Browsers understand `.localhost` as loopback (127.0.0.1). No `/etc/hosts` changes needed!

### Common Docker Commands

```bash
# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-service

# Scale a service (3 instances of auth)
docker-compose up --scale auth-service=3 -d

# Check service health
docker-compose ps

# Execute command in container
docker-compose exec auth-service sh

# Remove everything (containers + volumes)
docker-compose down -v
```

### Traefik Dashboard

Navigate to http://localhost:8080 to see:
- All registered HTTP routes
- Service health status
- Real-time traffic metrics
- Active middlewares

This is invaluable for debugging routing issues!

### Development Workflow

#### Making Code Changes

**Frontend Changes:**
```bash
# 1. Make code changes
# 2. Rebuild
docker-compose up --build frontend

# Or rebuild everything
docker-compose up --build
```

**Auth Service Changes:**
```bash
# 1. Make code changes  
# 2. Rebuild
docker-compose up --build auth-service
```

#### Adding a New Service

1. Create service directory and Dockerfile
2. Add to `docker-compose.yml`:
```yaml
  new-service:
    build: ./new-service
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.new.rule=Host(`new.localhost`)"
    networks:
      - bike-mechanic-network
```
3. Run: `docker-compose up --build`
4. Access at: http://new.localhost

**That's it!** Traefik automatically discovers and routes to it.

### Design Patterns in Docker Setup

Our Docker configuration follows several best practices:

#### 1. **Multi-Stage Builds** (Separation of Concerns)
```dockerfile
# Stage 1: Build (includes build tools)
FROM node:18-alpine AS builder
# ... install deps, compile ...

# Stage 2: Production (minimal runtime)
FROM node:18-alpine AS production  
# ... copy built files only...
```

**Benefits**: Smaller images (50MB vs 500MB), faster deployments

#### 2. **Dependency Inversion Principle**
Services depend on abstractions (Docker network, DNS), not concrete implementations (IP addresses, ports).

```yaml
# Instead of: http://192.168.1.5:3001
# Use service name: http://auth-service:3001
# Traefik resolves via DNS automatically
```

#### 3. **Single Responsibility** 
Each service has one job:
- **Traefik**: Routing and load balancing
- **Frontend**: Serve UI
- **Auth Service**: Handle authentication

#### 4. **Health Checks** (Fail Fast)
```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get(...)"]
  interval: 30s
```

Unhealthy containers are restarted automatically.

#### 5. **Environment-Based Configuration** (12-Factor App)
All configuration via environment variables, not hardcoded:

```yaml
environment:
  - PORT=3001                # Not in code!
  - MONGO_URI=${MONGO_URI}   # From .env file
```

---

## Configuration Files

### For npm Development

**Frontend:** Usually no .env needed (uses defaults)

**Auth Service** (`auth-service/.env`):
```env
PORT=3001
JWT_SECRET=bike-mechanic-super-secret-key-change-in-production
JWT_EXPIRY=24h
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
MONGO_URI=mongodb+srv://...
OTP_EXPIRY=300
EMAIL_ENABLED=false
SMS_ENABLED=false
```

### For Docker Compose

**Root `.env`** (Docker Compose environment):
```env
# MongoDB (required)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bike-mechanic-auth

# JWT Secret (required)
JWT_SECRET=your-secret-key-change-in-production

# Email Service (optional - defaults to console)
EMAIL_ENABLED=false
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# SMS Service (optional - defaults to console)
SMS_ENABLED=false
TEXTBEE_URL=
TEXTBEE_API_KEY=
```

**Important**: MongoDB URI is the ONLY required configuration. Everything else has sensible defaults.

---

## Changes Made to the Project

### December 12, 2025 - Docker Compose Migration

**New Files:**
- `Dockerfile` - Frontend containerization (multi-stage build)
- `.dockerignore` - Excludes node_modules, .env from Docker context
- `auth-service/Dockerfile` - Auth service containerization
- `auth-service/.dockerignore` - Excludes development files
- `docker-compose.yml` - Multi-service orchestration with Traefik
- `.env.docker.example` - Environment template for Docker
- `firstMigration.md` - Comprehensive migration documentation

**Architecture Changes:**
- **Before**: Hardcoded ports, manual service start, direct service exposure
- **After**: Service discovery via DNS, API gateway (Traefik), automatic routing, health checks

**See [firstMigration.md](./firstMigration.md) for complete migration details**

### Previous Changes

1. **Auth Service package.json** - Added `dev` script for tsx  
2. **CORS Fix** - Updated from port 5174 to 5173 (see problemsfaced.md)
3. **tsx Installation** - Global install for TypeScript runtime

---

## Testing OTP Flow

### With npm (Development Mode)

1. Start both services (see "Running with npm" above)
2. Navigate to http://localhost:5173/register  
3. Fill in: email, password, role
4. Click "Send OTP"
5. Check auth-service terminal for OTP code:
   ```
   🔐 OTP created for test@gmail.com: 123456
   ```
6. Enter OTP and verify

### With Docker Compose

1. Start services: `docker-compose up`
2. Navigate to http://app.localhost/register
3. Fill in: email, password, role
4. Click "Send OTP"
5. Check logs for OTP code:
   ```bash
   docker-compose logs auth-service | grep "OTP created"
   ```
6. Enter OTP and verify

**OTP Rules:**
- Expiration: 5 minutes
- Rate limit: 3 requests per 15 minutes
- Max verification attempts: 3

---

## Troubleshooting

### npm Development Mode

**Port Already in Use:**
```powershell
# Find process
netstat -ano | findstr :5173
netstat -ano | findstr :3001

# Kill it
taskkill /PID <PID> /F
```

**CORS Errors:**
1. Check `CORS_ORIGIN=http://localhost:5173` in `auth-service/.env`
2. Restart auth service
3. Verify in console: `🌐 CORS enabled for: http://localhost:5173`

### Docker Compose Mode

**Port 80 Already in Use:**
```powershell
# Find what's using port 80
netstat -ano | findstr :80

# Stop it (often IIS or Apache)
# Windows: Stop IIS in Services
# Or use different port in docker-compose.yml
```

**Services Not Found (ERR_NAME_NOT_RESOLVED):**
```bash
# Verify Docker network
docker network ls | grep bike-mechanic

# Restart Docker Desktop
# Check Traefik dashboard: http://localhost:8080
```

**Build Failures:**
```bash
# Clear Docker cache
docker-compose down
docker system prune -a

# Rebuild from scratch
docker-compose up --build --force-recreate
```

**Can't Access Traefik Dashboard:**
- URL: http://localhost:8080 (not app.localhost:8080)
- Check Traefik container is running: `docker-compose ps`
- View Traefik logs: `docker-compose logs traefik`

**Frontend Shows Old Code:**
```bash
# Docker caches builds - force rebuild
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

---

## Project Structure

```
bike-mechanic-discovery/
├── Dockerfile                    # Frontend container build
├── .dockerignore                 # Docker build exclusions
├── docker-compose.yml            # Multi-service orchestration
├── .env                          # Docker Compose environment (add this)
├── .env.docker.example           # Docker env template
├── firstMigration.md             # Migration documentation
├── how.md                        # This file
├── problemsfaced.md              # Issues and solutions
├── microservices-architecture-research.md  # Future architecture
│
├── auth-service/
│   ├── Dockerfile                # Auth service container
│   ├── .dockerignore
│   ├── .env                      # npm dev environment
│   ├── .env.example
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   └── package.json
│
└── src/                          # Frontend source
    ├── components/
    ├── pages/  
    ├── services/
    └── utils/
```

---

## Next Steps

### Immediate
1. Try Docker Compose setup
2. Verify all services accessible
3. Test OTP flow end-to-end
4. Explore Traefik dashboard

### Short-Term
1. Add more services (mechanic, location, notification)
2. Set up HTTPS with Let's Encrypt  
3. Configure production environment
4. Deploy to cloud (uses same docker-compose.yml!)

### Long-Term
1. Migrate to Kubernetes (Docker Compose knowledge transfers directly)
2. Add service mesh (Linkerd or Istio)  
3. Implement canary deployments

**See [microservices-architecture-research.md](./microservices-architecture-research.md) for scaling roadmap**

---

## Support & Resources

- **Migration Guide**: See [firstMigration.md](./firstMigration.md)
- **Problems & Solutions**: See [problemsfaced.md](./problemsfaced.md)
- **Scal ing Architecture**: See [microservices-architecture-research.md](./microservices-architecture-research.md)
- **Docker Docs**: https://docs.docker.com/compose/
- **Traefik Docs**: https://doc.traefik.io/traefik/

---

**Last Updated**: December 13, 2025 - **Added localhost routing fix** (see troubleshooting/problemsfaced.md Problem 5)
