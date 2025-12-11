import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { initDatabase, closeDatabase } from './db/database.js';
import { disconnectFromDatabase } from './db/connection.js';
import authRoutes from './routes/authRoutes.js';
import mechanicRoutes from './routes/mechanicRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app: Application = express();

// Middleware
app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mechanics', mechanicRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
    try {
        // Initialize MongoDB
        await initDatabase();

        // Start server
        const PORT = config.port;
        const server = app.listen(PORT, () => {
            console.log(`\n🔐 Authentication Service running on http://localhost:${PORT}`);
            console.log(`📊 Environment: ${config.nodeEnv}`);
            console.log(`🌐 CORS enabled for: ${config.corsOrigin}\n`);
        });

        // Graceful shutdown
        const shutdown = async () => {
            console.log('\n👋 Shutting down gracefully...');
            server.close(async () => {
                closeDatabase();
                await disconnectFromDatabase();
                console.log('✅ Server closed');
                process.exit(0);
            });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

export default app;
