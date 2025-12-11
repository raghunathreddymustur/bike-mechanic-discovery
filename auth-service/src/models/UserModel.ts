import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    id: string;
    identity: string; // Email or phone number
    passwordHash: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        identity: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        roles: {
            type: [String],
            default: ['customer'],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create index on identity for fast lookups
userSchema.index({ identity: 1 });

export const UserModel = mongoose.model<IUser>('User', userSchema);
