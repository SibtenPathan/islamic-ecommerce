import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

// Helper to create slug from name
function createSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// GET - List all categories
export async function GET() {
    const auth = await verifyAdmin();
    if (!auth.isAdmin) return auth.response;

    try {
        await connectDB();

        const categories = await Category.find({})
            .sort({ name: 1 });

        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST - Create new category
export async function POST(request: NextRequest) {
    const auth = await verifyAdmin();
    if (!auth.isAdmin) return auth.response;

    try {
        const { name, image, description, isActive } = await request.json();

        if (!name || !image) {
            return NextResponse.json(
                { error: 'Name and image are required' },
                { status: 400 }
            );
        }

        await connectDB();

        const slug = createSlug(name);

        // Check if category with same slug exists
        const existing = await Category.findOne({ slug });
        if (existing) {
            return NextResponse.json(
                { error: 'Category with this name already exists' },
                { status: 400 }
            );
        }

        const category = await Category.create({
            name,
            slug,
            image,
            description,
            isActive: isActive !== false,
        });

        return NextResponse.json({
            message: 'Category created successfully',
            category,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
