import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Fetch all banners (admin) or active banners (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('admin') === 'true';

        await connectDB();

        if (isAdmin) {
            const session = await getServerSession(authOptions);
            if (!session?.user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
            return NextResponse.json({ banners });
        }

        // Public: only active banners within date range
        const now = new Date();
        const banners = await Banner.find({
            isActive: true,
            $or: [
                { startDate: { $lte: now }, endDate: { $gte: now } },
                { startDate: null, endDate: null },
                { startDate: { $lte: now }, endDate: null },
                { startDate: null, endDate: { $gte: now } },
            ]
        }).sort({ order: 1 });

        return NextResponse.json({ banners });
    } catch (error) {
        console.error('Error fetching banners:', error);
        return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
    }
}

// POST - Create new banner
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        await connectDB();

        const banner = await Banner.create(body);

        return NextResponse.json({ message: 'Banner created', banner });
    } catch (error) {
        console.error('Error creating banner:', error);
        return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
    }
}

// PUT - Update banner
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, ...updateData } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
        }

        await connectDB();

        const banner = await Banner.findByIdAndUpdate(id, updateData, { new: true });

        if (!banner) {
            return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Banner updated', banner });
    } catch (error) {
        console.error('Error updating banner:', error);
        return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
    }
}

// DELETE - Delete banner
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
        }

        await connectDB();

        await Banner.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Banner deleted' });
    } catch (error) {
        console.error('Error deleting banner:', error);
        return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
    }
}
