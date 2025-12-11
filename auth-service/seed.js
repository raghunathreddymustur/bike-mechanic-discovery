import { createUser } from './src/db/database.js';
import { hashPassword } from './src/utils/passwordUtils.js';
import { v4 as uuidv4 } from 'uuid';

// Create admin user
const adminPassword = await hashPassword('admin123');
const adminUser = {
    id: uuidv4(),
    identity: 'admin@gmail.com',
    passwordHash: adminPassword,
    roles: JSON.stringify(['ADMIN']),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

createUser(adminUser);

console.log('✅ Admin user created successfully!');
console.log('Email: admin@gmail.com');
console.log('Password: admin123');
