# Bike Mechanic Discovery - Documentation Index

Welcome to the Bike Mechanic Discovery project documentation. All documentation is organized in this directory for easy navigation.

## 📁 Directory Structure

```
docs/
├── setup/                      # Installation and setup guides
│   └── how.md                 # Complete setup instructions
│
├── migrations/                 # Infrastructure migration documentation
│   └── firstMigration.md      # Docker Compose migration guide
│
├── architecture/               # Architecture and design documentation
│   └── microservices-research.md  # Scaling and microservices research
│
└── troubleshooting/            # Problem solving and debugging
    └── problemsfaced.md       # Issues encountered and solutions
```

## 🚀 Quick Start

**New to this project?** Start here:
1. Read [Setup Guide](./setup/how.md) - How to install and run the application
2. Review [First Migration](./migrations/firstMigration.md) - Understanding the Docker architecture
3. Check [Problems Faced](./troubleshooting/problemsfaced.md) - Common issues and solutions

## 📚 Documentation Categories

### Setup & Installation
- **[How to Set Up and Run](./setup/how.md)**
  - Prerequisites and dependencies
  - npm development mode
  - Docker Compose mode (recommended)
  - Configuration files
  - Testing OTP flow

### Migrations
- **[First Migration: Docker Compose + Traefik](./migrations/firstMigration.md)**
  - Problems with original architecture
  - Why we migrated
  - How the new architecture works
  - Before vs After comparison
  - Running instructions

### Architecture
- **[Microservices Research & Roadmap](./architecture/microservices-research.md)**
  - Service discovery patterns
  - API gateway comparison (Kong, Nginx, Traefik)
  - Service mesh options (Istio, Linkerd)
  - Zero-downtime deployment strategies
  - Scaling recommendations
  - Future migration phases

### Troubleshooting
- **[Problems Faced and Solutions](./troubleshooting/problemsfaced.md)**
  - OTP sending failure (CORS issue)
  - Auth service startup issues
  - TypeScript runtime problems
  - Common Docker issues
  - Best practices learned

## 🎯 Common Tasks

### I want to...

**...set up the project for the first time**
→ Read [how.md](./setup/how.md)

**...understand why we use Docker Compose**
→ Read [firstMigration.md](./migrations/firstMigration.md)

**...plan future scaling**
→ Read [microservices-research.md](./architecture/microservices-research.md)

**...fix an error I'm seeing**
→ Check [problemsfaced.md](./troubleshooting/problemsfaced.md)

**...add a new microservice**
→ See "Adding Services" section in [how.md](./setup/how.md#running-with-docker-compose-recommended)

## 🏗️ Architecture Overview

Current architecture uses Docker Compose with Traefik for:
- Automatic service discovery
- API gateway routing
- Zero configuration scaling
- Health monitoring
- Production-like local development

See [firstMigration.md](./migrations/firstMigration.md) for detailed architecture diagrams.

## 📖 Reading Order for New Developers

1. **Start**: [how.md](./setup/how.md) - Get the app running
2. **Understanding**: [firstMigration.md](./migrations/firstMigration.md) - Learn the architecture
3. **Troubleshooting**: [problemsfaced.md](./troubleshooting/problemsfaced.md) - Common issues
4. **Future**: [microservices-research.md](./architecture/microservices-research.md) - Scaling plans

## 🔗 Related Resources

- **Project Root**: `../` - Source code
- **Migrations**: `../migrations/` - Infrastructure configurations
- **Workflows**: `../.agent/workflows/` - Automation scripts

## 📝 Documentation Standards

All documentation in this project follows these principles:

1. **Modular**: Each doc focuses on one topic
2. **Complete**: Includes examples and expected outputs
3. **Maintained**: Updated when architecture changes
4. **Accessible**: Written for developers of all levels

## 🤝 Contributing

When adding new documentation:
- Place in appropriate subdirectory
- Update this README index
- Link from related documents
- Use clear headings and code examples
- Include troubleshooting sections

---

**Last Updated**: December 12, 2025  
**Documentation Version**: 1.0
