import mongoose, { Schema, Document, Model } from 'mongoose';

export type CouponType = 'percentage' | 'fixed';

export interface ICoupon extends Document {
    _id: mongoose.Types.ObjectId;
    code: string;
    type: CouponType;
    value: number;
    minPurchase: number;
    maxDiscount?: number;
    maxUses: number;
    usedCount: number;
    isActive: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
    {
        code: {
            type: String,
            required: [true, 'Please provide a coupon code'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: [true, 'Please specify coupon type'],
        },
        value: {
            type: Number,
            required: [true, 'Please provide a discount value'],
            min: [0, 'Value cannot be negative'],
        },
        minPurchase: {
            type: Number,
            default: 0,
            min: [0, 'Minimum purchase cannot be negative'],
        },
        maxDiscount: {
            type: Number,
            min: [0, 'Maximum discount cannot be negative'],
        },
        maxUses: {
            type: Number,
            default: -1, // -1 means unlimited
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
            required: [true, 'Please provide an expiration date'],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1 });
CouponSchema.index({ expiresAt: 1 });

const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
