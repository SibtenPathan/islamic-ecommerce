import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    image: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a category name'],
            trim: true,
            unique: true,
            maxlength: [50, 'Category name cannot be more than 50 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Please provide a category image'],
        },
        description: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Add indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1 });

// Virtual for product count (will need aggregation for actual count)
CategorySchema.virtual('productCount', {
    ref: 'Product',
    localField: 'slug',
    foreignField: 'category',
    count: true,
});

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
