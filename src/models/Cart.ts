import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
}

export interface ICart extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
    updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
            default: 1,
        },
        selectedColor: String,
        selectedSize: String,
    },
    { _id: false }
);

const CartSchema = new Schema<ICart>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // Each user has one cart
        },
        items: [CartItemSchema],
    },
    {
        timestamps: true,
    }
);

// Add index for user lookup
CartSchema.index({ user: 1 });

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
