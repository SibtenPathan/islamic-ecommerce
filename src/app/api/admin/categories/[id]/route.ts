import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import mongoose from 'mongoose';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT - Update category
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const auth = await verifyAdmin();
    if (!auth.isAdmin) return auth.response;

    try {
        const { id } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid category ID' },
                { status: 400 }
            );
        }

        await connectDB();

        // If name is being updated, update slug too
        if (body.name) {
            body.slug = body.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Category updated successfully',
            category,
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const auth = await verifyAdmin();
    if (!auth.isAdmin) return auth.response;

    try {
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid category ID' },
                { status: 400 }
            );
        }

        await connectDB();

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Category deleted successfully',
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
