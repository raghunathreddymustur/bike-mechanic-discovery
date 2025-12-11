# Authentication Service

Standalone authentication service for the Bike Mechanic Discovery application.

## Features

- ✅ Gmail and Indian phone number authentication
- ✅ JWT token-based sessions
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt
- ✅ Stateless authentication

## Quick Start

### Installation

```bash
cd auth-service
npm install
```

**Note:** If you encounter installation errors with native modules, try:
```bash
npm install --force
```

Or install dependencies individually:
```bash
npm install express bcryptjs jsonwebtoken cors dotenv uuid
npm install -D @types/express @types/bcryptjs @types/jsonwebtoken @types/cors @types/uuid @types/node typescript tsx
```

### Running the Service

```bash
npm run dev
```

The service will start on `http://localhost:3001`

### Create Admin User

After the service is running for the first time, create an admin user:

```bash
node seed.js
```

This creates:
- Email: `admin@gmail.com`
- Password: `admin123`
- Role: `ADMIN`

## API Endpoints

### POST /api/auth/register
Register a new user

**Request:**
```json
{
  "identity": "user@gmail.com",
  "password": "password123",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "identity": "user@gmail.com",
    "roles": ["customer"]
  }
}
```

### POST /api/auth/login
Authenticate user

**Request:**
```json
{
  "identity": "admin@gmail.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "identity": "admin@gmail.com",
    "roles": ["ADMIN"]
  }
}
```

### POST /api/auth/verify
Verify JWT token

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "identity": "admin@gmail.com",
    "roles": ["ADMIN"]
  }
}
```

### POST /api/auth/logout
Logout user

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /api/auth/health
Health check

**Response:**
```json
{
  "status": "ok",
  "service": "authentication-service",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Identity Validation

### Gmail
- Must end with `@gmail.com`
- Case insensitive

### Phone Number
- Must be valid Indian phone number
- 10 digits starting with 6-9
- Accepts formats: `9876543210`, `+919876543210`, `09876543210`

## Configuration

Environment variables (`.env`):

```env
PORT=3001
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Testing

### Using curl

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"identity":"test@gmail.com","password":"test123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identity":"admin@gmail.com","password":"admin123"}'

# Verify
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database

Uses JSON file storage (`users.json`) for simplicity. Data persists across restarts.

To reset the database, delete `users.json` and re-run the seed script.

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env file
PORT=3002
```

### CORS Errors
Check that `CORS_ORIGIN` in `.env` matches your frontend URL (default: `http://localhost:5173`)

### Token Errors
Verify that both services use the same `JWT_SECRET`
