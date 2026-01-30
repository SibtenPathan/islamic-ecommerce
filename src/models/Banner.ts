import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
    buttonText?: string;
    isActive: boolean;
    order: number;
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
    {
        title: {
            type: String,
            required: [true, 'Please provide a banner title'],
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Please provide a banner image'],
        },
        link: {
            type: String,
            trim: true,
        },
        buttonText: {
            type: String,
            trim: true,
            default: 'Shop Now',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for active banners query
BannerSchema.index({ isActive: 1, order: 1 });

const Banner: Model<IBanner> = mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;
