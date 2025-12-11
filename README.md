# Bike Mechanic Discovery - Setup Guide

A production-ready bike mechanic discovery application with modular architecture, location autocomplete, and distance-based sorting.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation Steps

1. **Copy the project folder** to your new computer
   - Copy the entire `bikeMechanic` folder
   - Or use Git if you have it in a repository

2. **Open terminal** in the project directory
   ```bash
   cd path/to/bikeMechanic
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   This will install all required packages (React, TypeScript, Vite, Leaflet, etc.)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - The terminal will show the URL (usually `http://localhost:5173` or `http://localhost:5174`)
   - Open that URL in your browser

## 📁 Project Structure

```
bikeMechanic/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── LocationAutocomplete.tsx
│   │   ├── MapComponent.tsx
│   │   ├── MechanicList.tsx
│   │   ├── SearchBar.tsx
│   │   └── Sidebar.tsx
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── RegisterPage/    # Modular registration
│   │       ├── index.tsx
│   │       ├── steps/       # Multi-step form components
│   │       └── components/
│   ├── services/            # Business logic layer
│   │   ├── MechanicService.ts
│   │   └── GeocodingService.ts
│   ├── repositories/        # Data access layer
│   │   └── MechanicRepository.ts
│   ├── db/                  # In-memory database
│   │   ├── schema.ts
│   │   └── store.ts
│   ├── utils/               # Utility functions
│   │   └── geocoding.ts
│   ├── context/             # React Context
│   │   └── AppContext.tsx
│   └── data/                # Static data
│       └── mechanics.ts
├── public/                  # Static assets
├── package.json             # Dependencies
└── vite.config.ts          # Vite configuration
```

## ✨ Features

- **Location Autocomplete** - Google Maps-style search for shops
- **Distance Sorting** - Mechanics sorted by proximity
- **Real-time Updates** - New mechanics appear instantly on map
- **Geocoding** - Uses Nominatim (OpenStreetMap) API
- **Geolocation** - Browser GPS detection
- **Modular Architecture** - SOLID principles, ready for microservices
- **Multi-step Registration** - Easy mechanic onboarding

## 🛠️ Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

## 🌐 Environment

No environment variables needed! The app uses:
- **Nominatim API** (OpenStreetMap) - No API key required
- **Browser Geolocation** - Automatic permission request

## 📦 Dependencies

Main dependencies (auto-installed with `npm install`):
- **React** 18.x - UI framework
- **TypeScript** 5.x - Type safety
- **Vite** 4.x - Build tool
- **React Router** 6.x - Navigation
- **Leaflet** - Interactive maps
- **Lucide React** - Icons

## 🐛 Troubleshooting

### Port already in use
If you see "Port 5173 is already in use":
```bash
# Kill the process using the port (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or let Vite use a different port automatically
npm run dev -- --port 3000
```

### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Map not showing
- Check if Leaflet CSS is loaded
- Verify internet connection (for map tiles)
- Check browser console for errors

## 🚢 Deploying to Production

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to:
   - **Vercel** (recommended): `vercel deploy`
   - **Netlify**: Drag & drop `dist` folder
   - **GitHub Pages**: Use `gh-pages` package
   - Any static hosting service

## 📝 Notes

- **In-memory database**: Data resets on page refresh (by design for demo)
- **API rate limiting**: Nominatim has 1 req/sec limit (debounced automatically)
- **No backend needed**: Fully client-side application

## 🤝 Contributing

To make changes:
1. Make your edits in `src/`
2. Test with `npm run dev`
3. Build with `npm run build` to verify no errors
4. Share the updated project folder

## 📄 License

This project is for educational/demo purposes.

---

**Need help?** Check the browser console (F12) for any errors.
