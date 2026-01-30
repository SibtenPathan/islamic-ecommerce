import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
    colors?: string[];
    sizes?: string[];
    material?: string;
    description?: string;
    specifications?: string[];
    stock: number;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    isTrending?: boolean;
    averageRating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a product name'],
            trim: true,
            maxlength: [100, 'Product name cannot be more than 100 characters'],
        },
        category: {
            type: String,
            required: [true, 'Please provide a category'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Please provide a price'],
            min: [0, 'Price cannot be negative'],
        },
        originalPrice: {
            type: Number,
            min: [0, 'Original price cannot be negative'],
        },
        image: {
            type: String,
            required: [true, 'Please provide an image URL'],
        },
        colors: [String],
        sizes: [String],
        material: String,
        description: String,
        specifications: [String],
        stock: {
            type: Number,
            required: true,
            default: 100,
            min: [0, 'Stock cannot be negative'],
        },
        isNewArrival: {
            type: Boolean,
            default: false,
        },
        isBestSeller: {
            type: Boolean,
            default: false,
        },
        isTrending: {
            type: Boolean,
            default: false,
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Add indexes for common queries
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isBestSeller: 1 });
ProductSchema.index({ isTrending: 1 });
ProductSchema.index({ name: 'text', description: 'text' }); // Text search index

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
