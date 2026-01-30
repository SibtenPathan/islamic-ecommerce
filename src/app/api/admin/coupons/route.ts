import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Fetch all coupons
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const coupons = await Coupon.find().sort({ createdAt: -1 });

        return NextResponse.json({ coupons });
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

// POST - Create new coupon
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        await connectDB();

        const coupon = await Coupon.create({
            code: body.code.toUpperCase(),
            type: body.type,
            value: body.value,
            minPurchase: body.minPurchase || 0,
            maxDiscount: body.maxDiscount,
            maxUses: body.maxUses || -1,
            expiresAt: body.expiresAt,
            isActive: body.isActive !== undefined ? body.isActive : true,
        });

        return NextResponse.json({ message: 'Coupon created', coupon });
    } catch (error: unknown) {
        console.error('Error creating coupon:', error);
        if ((error as { code?: number }).code === 11000) {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }
}

// PUT - Update coupon
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, ...updateData } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
        }

        await connectDB();

        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase();
        }

        const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });

        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Coupon updated', coupon });
    } catch (error) {
        console.error('Error updating coupon:', error);
        return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
    }
}

// DELETE - Delete coupon
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
        }

        await connectDB();

        await Coupon.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Coupon deleted' });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}
