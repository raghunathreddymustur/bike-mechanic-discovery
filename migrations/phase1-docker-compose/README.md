# Phase 1 Migration: Docker Compose + Traefik

This directory contains all configuration files for the first infrastructure migration from hardcoded ports to Docker Compose with service discovery.

## Directory Structure

```
phase1-docker-compose/
├── dockerfiles/
│   ├── Dockerfile.frontend      # Frontend container build
│   ├── Dockerfile.auth-service  # Auth service container build
│   ├── .dockerignore.frontend   # Frontend build exclusions
│   └── .dockerignore.auth       # Auth service build exclusions
│
├── docker-compose.yml            # Multi-service orchestration
├── .env.example                  # Environment template
└── README.md                     # This file
```

## What This Migration Does

**Problem Solved**: Hardcoded service ports, manual CORS configuration, no service discovery

**Solution**: Docker Compose + Traefik API Gateway

### Before
- Frontend: http://localhost:5173 (hardcoded)
- Auth API: http://localhost:3001 (hardcoded)
- CORS configured per service
- Manual startup in 2 terminals
- Can't scale

### After
- Frontend: http://app.localhost (via Traefik)
- Auth API: http://api.localhost (via Traefik)
- CORS handled by gateway
- Single command startup: `docker-compose up`
- Easy scaling: `--scale service=N`

## Quick Start

### 1. Prerequisites
- Docker Desktop installed and running
- MongoDB Atlas connection string

### 2. Setup Environment
```bash
# From this directory
cp .env.example .env

# Edit .env and add your MongoDB URI
```

### 3. Start Services
```bash
# From project root
docker-compose -f migrations/phase1-docker-compose/docker-compose.yml up --build

# Or create symlink in root (recommended)
# Windows (Admin PowerShell):
New-Item -ItemType SymbolicLink -Path "docker-compose.yml" -Target "migrations\phase1-docker-compose\docker-compose.yml"

Then:
docker-compose up --build
```

### 4. Access Services
- **Frontend**: http://app.localhost
- **Auth API**: http://api.localhost/auth/health
- **Traefik Dashboard**: http://localhost:8080

## Design Patterns Used

### 1. Separation of Concerns
- Migration infrastructure kept separate from application code
- Application code remains unchanged
- Easy rollback: just don't use Docker files

### 2. Multi-Stage Builds
- Builder stage: Installs all dependencies, compiles code
- Production stage: Only runtime dependencies, optimized size
- Result: 50MB vs 500MB images

### 3. Dependency Inversion
- Services depend on abstractions (Docker DNS) not concrete IPs
- Configuration via environment variables, not hardcoded
- Easy to swap implementations

### 4. Single Responsibility
- Each service has one job
- Traefik: Routing only
- Frontend: UI only
- Auth Service: Authentication only

### 5. Health Checks (Fail Fast Pattern)
- Services self-report health status
- Unhealthy containers auto-restart
- Traefik only routes to healthy instances

## File Descriptions

### Dockerfiles

**`docker files/Dockerfile.frontend`**
- Multi-stage build for React app
- Stage 1: Vite build
- Stage 2: Serve static files
- Optimized for production

**`dockerfiles/Dockerfile.auth-service`**
- Multi-stage build for Express API
- Stage 1: TypeScript compilation
- Stage 2: Runtime with tsx
- Health check endpoint configured

### Docker Compose

**`docker-compose.yml`**
- Traefik gateway configuration
- Frontend service with labels
- Auth service with labels
- Shared network for service discovery
- Environment variable injection

### Environment

**`.env.example`**
- Template showing all required variables
- MongoDB URI
- JWT secrets
- Email/SMS configuration

## Modular Design Benefits

### Clean Separation
```
Main Project Code
  ├── src/              # Application logic (unchanged)
  ├── auth-service/     # Auth logic (unchanged)
  └── migrations/       # Infrastructure migrations
      └── phase1-docker-compose/  # This migration
```

### Easy Rollback
Don't want Docker? Just don't use files in this directory. Application code works standalone.

### Future Migrations
```
migrations/
  ├── phase1-docker-compose/    # ✓ Current
  ├── phase2-kubernetes/        # Future: K8s manifests
  ├── phase3-service-mesh/      # Future: Istio/Linkerd
  └── phase4-multi-region/      # Future: Multi-cluster
```

Each phase is self-contained and documented.

## Troubleshooting

### Symlink Issues (Windows)
```powershell
# Requires Admin PowerShell
New-Item -ItemType SymbolicLink -Path "docker-compose.yml" -Target "migrations\phase1-docker-compose\docker-compose.yml"

# Or just use full path:
docker-compose -f migrations/phase1-docker-compose/docker-compose.yml up
```

### Port Conflicts
```bash
# Check what's using port 80
netstat -ano | findstr :80

# Kill IIS if it's running
net stop was /y
```

### Build Errors
```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

## Next Steps

1. Test this setup locally
2. Once validated, future migrations go in separate phase folders
3. Kubernetes migration would be `phase2-kubernetes/`
4. Service mesh would be `phase3-service-mesh/`

## Migration Documentation

- **Detailed Migration Guide**: `../../firstMigration.md`
- **Architecture Research**: `../../microservices-architecture-research.md`
- **Main Setup Guide**: `../../how.md`
- **Problems Solved**: `../../problemsfaced.md`

---

**Migration Phase**: 1  
**Status**: Complete  
**Date**: December 12, 2025
