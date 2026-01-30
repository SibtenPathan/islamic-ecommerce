import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAddress {
    _id?: mongoose.Types.ObjectId;
    label: string; // e.g., 'Home', 'Work'
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

export type UserRole = 'user' | 'admin';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: IAddress; // Legacy single address
    addresses: IAddress[]; // Multiple addresses
    newsletter: boolean;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
    {
        label: { type: String, required: true, trim: true },
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        isDefault: { type: Boolean, default: false },
    }
);

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't include password in queries by default
        },
        phone: {
            type: String,
            trim: true,
        },
        address: AddressSchema,
        addresses: [AddressSchema],
        newsletter: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

// Add index for email lookup
UserSchema.index({ email: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
