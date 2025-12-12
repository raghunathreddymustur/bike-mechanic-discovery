# Problems Faced and Solutions

This document tracks all issues encountered during development and their solutions.

---

## Table of Contents
1. [OTP Sending Failure - CORS Issue](#problem-1-otp-sending-failure---cors-issue)
2. [Auth Service Won't Start - Missing Scripts](#problem-2-auth-service-wont-start---missing-scripts)
3. [TypeScript Runtime Issues](#problem-3-typescript-runtime-issues)

---

## Problem 1: OTP Sending Failure - CORS Issue

### Date
December 12, 2025

### Symptom
- Users clicking "Send OTP" on registration page received error: **"Failed to send OTP"**
- No OTP code appeared in auth service terminal
- Application appeared to fail silently

### Investigation Process

#### Step 1: Verified Auth Service Functionality
Tested the `/api/auth/send-otp` endpoint directly using PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/auth/send-otp" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"identity":"test@gmail.com"}' `
  -UseBasicParsing
```

**Result**: ✅ **Success (200 OK)**
- Response: `{"success":true,"message":"OTP sent to email","identity":"test@gmail.com"}`
- OTP was generated: `890649`
- OTP appeared in auth service console

**Conclusion**: The auth service endpoint was working perfectly.

#### Step 2: Checked CORS Headers
Noticed in the response headers:
```
Access-Control-Allow-Origin: http://localhost:5174
```

But frontend was running on:
```
http://localhost:5173
```

**ROOT CAUSE IDENTIFIED**: CORS port mismatch!

#### Step 3: Checked Browser Console
Would have shown (if checked):
```
Access to fetch at 'http://localhost:3001/api/auth/send-otp' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### Root Cause
**CORS Configuration Mismatch**

The auth service was configured to allow requests from `http://localhost:5174`, but the Vite development server (frontend) was running on port `5173`.

This caused the browser to block all API requests from the frontend due to CORS (Cross-Origin Resource Sharing) policy.

### Why This Happened
- The `.env` file had been configured with the wrong port number at some point
- Services had been running fine "yesterday" because they were likely on the same configuration
- Either the frontend port changed, or the CORS setting was incorrect from a previous session

### Solution

#### Step 1: Update CORS Configuration
**File**: `auth-service/.env`

Changed:
```diff
- CORS_ORIGIN=http://localhost:5174
+ CORS_ORIGIN=http://localhost:5173
```

#### Step 2: Restart Auth Service
The auth service needed to be restarted to pick up the new environment variable:

1. Stopped the running `tsx src/server.ts` process (Ctrl+C)
2. Started it again: `tsx src/server.ts`

#### Step 3: Verify Configuration
Checked auth service console output:
```
✅ Database loaded: 11 users
🔐 Authentication Service running on http://localhost:3001
📊 Environment: development
🌐 CORS enabled for: http://localhost:5173 ✅
```

**Confirmed**: CORS now correctly configured for port 5173.

### Verification
Tested OTP registration flow:

1. Navigated to http://localhost:5173/register
2. Entered email: `networktest@gmail.com`
3. Entered password: `test123456`
4. Clicked "Send OTP"

**Result**: ✅ **Success**
- Page transitioned to "Enter Verification Code" screen
- OTP appeared in auth service terminal: `600438`
- No CORS errors in browser console

### Key Learnings

1. **Always check CORS configuration** when frontend can't reach backend
2. **Direct API testing** (curl/Invoke-WebRequest) helps isolate if issue is in backend or communication
3. **Port numbers must match** between CORS_ORIGIN and actual frontend port
4. **.env changes require service restart** to take effect
5. **Browser console** shows CORS errors clearly (if checked)

### Prevention
- Document the correct port numbers in `.env.example`
- Add a health check that verifies CORS configuration on startup
- Consider using `CORS_ORIGIN=http://localhost:*` for development (though less secure)

---

## Problem 2: Auth Service Won't Start - Missing Scripts

### Date  
December 12, 2025

### Symptom
Running `npm run dev` in the `auth-service` directory failed with:
```
npm ERR! Missing script: "dev"
```

### Investigation
Checked `auth-service/package.json` and found the scripts section only had:
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

No `dev` script was defined to run the server.

### Root Cause
The original `package.json` was minimal and didn't include development scripts for running the TypeScript server.

### Solution
Added development scripts to `auth-service/package.json`:

```json
"scripts": {
  "dev": "npx tsx src/server.ts",
  "start": "node src/server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

Now you can run:
- `npm run dev` - Runs the TypeScript source directly using tsx
- `npm start` - Would run compiled JavaScript (if you build it)

### Verification
```bash
cd auth-service
npm run dev
```

Service started successfully! ✅

---

## Problem 3: TypeScript Runtime Issues

### Date
December 12, 2025

### Symptom
Attempted to run TypeScript files with various methods, encountering:
- `node --loader ts-node/esm src/server.ts` → Module resolution errors
- `ts-node-esm src/server.ts` → ESM loader failures
- `npx tsx src/server.ts` → MODULE_NOT_FOUND (tsx not installed)

### Investigation
The auth service uses:
- TypeScript
- ES Modules (`type: "module"` in package.json)
- Modern import syntax with `.js` extensions in imports

This requires a TypeScript runtime that supports ESM properly.

### Root Cause
Multiple issues:
1. `tsx` was not installed (neither locally nor globally)
2. Old `ts-node` versions don't handle ESM well
3. `npx tsx` tried to download tsx but failed due to package compatibility

### Solution

#### Step 1: Install tsx Globally
```bash
npm install -g tsx
```

This installs `tsx` as a global command-line tool.

#### Step 2: Run Server with tsx
```bash
tsx src/server.ts
```

Or use the npm script:
```bash
npm run dev
```

### Why tsx?
- **Fast**: Directly executes TypeScript without pre-compilation
- **ESM Support**: Handles ES Modules perfectly
- **No Configuration**: Works out of the box with `tsconfig.json`
- **Good DX**: Better error messages than ts-node

### Alternative Solutions Attempted

| Method | Result | Reason for Failure |
|--------|--------|-------------------|
| `node --import tsx` | ❌ Failed | Node version too old for --import flag |
| `ts-node --esm` | ❌ Failed | ESM loader issues with .js imports |
| `npx tsx` | ❌ Failed | tsx not in cache, download failed |
| `npm install tsx` locally | ❌ Failed | Package compatibility warnings |
| **`npm install -g tsx`** | ✅ **Success** | Global install worked |

### Verification
```bash
tsx src/server.ts
```

Output:
```
✅ Database loaded: 11 users
🔐 Authentication Service running on http://localhost:3001
📊 Environment: development
🌐 CORS enabled for: http://localhost:5173
```

Service running successfully! ✅

### Key Learnings
1. **tsx is the best tool** for running TypeScript ESM projects
2. **Global installation** is sometimes more reliable than local
3. **npx** can fail if packages aren't cached and network has issues

---

## Problem 4: Frontend Not Loading - Routing Issue

### Date
December 12, 2025

### Symptom
Browser trying to access http://localhost:5173/otp-test showed blank page.

Browser console showed:
```
No routes matched location "/otp-test"
```

### Root Cause
The route `/otp-test` was not defined in the React Router configuration. This was a test page that may not have been fully integrated into the app routing.

### Solution
Users should use the proper registration page:
- **Register**: http://localhost:5173/register
- **Login**: http://localhost:5173/login
- **Home**: http://localhost:5173/

The `/otp-test` page exists as a standalone component but may not be routed in App.tsx.

### Note
The OTP functionality works correctly on the main registration page at `/register`.

---

## Common Issues & Quick Fixes

### Issue: "Port already in use"
**Solution**:
```powershell
# Find process
netstat -ano | findstr :3001

# Kill it
taskkill /PID <PID> /F
```

### Issue: "MongoDB connection failed"
**Solutions**:
1. Check internet connection
2. Verify MongoDB Atlas credentials in `.env`
3. Whitelist your IP in MongoDB Atlas

### Issue: "Cannot find module"
**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Changes to .env not reflecting
**Solution**:
Restart the service! Environment variables are loaded on startup.

### Issue: OTP not appearing in terminal
**Check**:
1. Is auth service running? (should show timestamp logs)
2. Did "Send OTP" request succeed? (check Network tab)
3. Is EMAIL_ENABLED=false? (should be for console mode)

---

## Best Practices Learned

1. ✅ **Always check CORS** when frontend can't reach backend
2. ✅ **Test endpoints directly** to isolate backend vs communication issues
3. ✅ **Restart services** after .env changes
4. ✅ **Check browser console** for client-side errors
5. ✅ **Check server terminal** for backend errors
6. ✅ **Use tsx** for TypeScript ESM projects
7. ✅ **Document all configuration** for future reference
8. ✅ **Keep .env.example** up to date as a template

---

## Future Improvements

### Monitoring & Logging
- Add structured logging (winston, pino)
- Log request/response details for debugging
- Add health check endpoint with dependency status

### Error Handling
- Add better error messages for common issues
- Create error code system for frontend-backend communication
- Add retry logic for transient failures

### Development Experience
- Add nodemon/tsx --watch for auto-restart on file changes
- Create docker-compose for one-command startup
- Add pre-commit hooks to check .env validity

---

**Last Updated**: December 12, 2025
