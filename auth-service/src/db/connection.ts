import mongoose from 'mongoose';
import { config } from '../config/config.js';

let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
    if (isConnected) {
        console.log('✅ Using existing MongoDB connection');
        return;
    }

    try {
        const mongoUri = config.mongoUri || 'mongodb://localhost:27017/bike-mechanic-auth';

        await mongoose.connect(mongoUri, {
            // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
            // These options are now the default
        });

        isConnected = true;
        console.log('✅ Connected to MongoDB:', mongoUri);

        // Handle connection events
        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
            isConnected = false;
        });

    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        throw error;
    }
};

export const disconnectFromDatabase = async (): Promise<void> => {
    if (!isConnected) {
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('👋 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error);
        throw error;
    }
};
