import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            required: [true, 'Please provide a review title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        comment: {
            type: String,
            required: [true, 'Please provide a review comment'],
            trim: true,
            maxlength: [1000, 'Comment cannot be more than 1000 characters'],
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
ReviewSchema.index({ product: 1 });
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
ReviewSchema.index({ rating: 1 });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
