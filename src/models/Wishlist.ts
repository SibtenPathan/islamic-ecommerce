import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWishlist extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        products: [{
            type: Schema.Types.ObjectId,
            ref: 'Product',
        }],
    },
    {
        timestamps: true,
    }
);

// Index for user lookup
WishlistSchema.index({ user: 1 });

const Wishlist: Model<IWishlist> = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;
