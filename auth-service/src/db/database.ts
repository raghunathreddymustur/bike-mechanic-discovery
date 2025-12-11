import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { UserModel } from '../models/UserModel.js';
import { connectToDatabase } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '../../users.json');

/**
 * Initializes the MongoDB database
 */
export async function initDatabase(): Promise<void> {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        // Check if we need to migrate from JSON file
        if (fs.existsSync(DB_FILE)) {
            await migrateFromJSON();
        }

        const count = await UserModel.countDocuments();
        console.log(`✅ Database loaded: ${count} users`);
    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        throw error;
    }
}

/**
 * Migrate users from JSON file to MongoDB
 */
async function migrateFromJSON(): Promise<void> {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const jsonDb = JSON.parse(data);

        if (!jsonDb.users || jsonDb.users.length === 0) {
            console.log('No users to migrate');
            return;
        }

        // Check if users already exist in MongoDB
        const existingCount = await UserModel.countDocuments();
        if (existingCount > 0) {
            console.log('⚠️  MongoDB already has users, skipping migration');
            return;
        }

        // Migrate users
        for (const user of jsonDb.users) {
            await UserModel.create({
                id: user.id,
                identity: user.identity.toLowerCase(),
                passwordHash: user.passwordHash,
                roles: user.roles || ['customer'],
            });
        }

        console.log(`✅ Migrated ${jsonDb.users.length} users from JSON to MongoDB`);

        // Rename the JSON file as backup
        fs.renameSync(DB_FILE, DB_FILE + '.backup');
        console.log('✅ JSON file backed up as users.json.backup');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
}

/**
 * Gets all users (internal use)
 */
export async function getAllUsers(): Promise<User[]> {
    const users = await UserModel.find().lean();
    return users.map(u => ({
        id: u.id,
        identity: u.identity,
        passwordHash: u.passwordHash,
        roles: u.roles,
    }));
}

/**
 * Finds a user by identity
 */
export async function findUserByIdentity(identity: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ identity: identity.toLowerCase() }).lean();
    if (!user) return undefined;

    return {
        id: user.id,
        identity: user.identity,
        passwordHash: user.passwordHash,
        roles: user.roles,
    };
}

/**
 * Finds a user by ID
 */
export async function findUserById(id: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ id }).lean();
    if (!user) return undefined;

    return {
        id: user.id,
        identity: user.identity,
        passwordHash: user.passwordHash,
        roles: user.roles,
    };
}

/**
 * Creates a new user
 */
export async function createUser(user: User): Promise<void> {
    await UserModel.create({
        id: user.id,
        identity: user.identity.toLowerCase(),
        passwordHash: user.passwordHash,
        roles: user.roles || ['customer'],
    });
}

/**
 * Updates a user
 */
export async function updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    const result = await UserModel.updateOne({ id }, updates);
    return result.modifiedCount > 0;
}

/**
 * Deletes a user
 */
export async function deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ id });
    return result.deletedCount > 0;
}

/**
 * Closes database connection
 */
export function closeDatabase(): void {
    console.log('Database connection will close on app shutdown');
}
