import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Fetch user's wishlist
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const wishlist = await Wishlist.findOne({ user: session.user.id })
            .populate('products', 'name category price originalPrice image');

        return NextResponse.json({
            products: wishlist?.products || [],
        });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json(
            { error: 'Failed to fetch wishlist' },
            { status: 500 }
        );
    }
}

// POST - Add product to wishlist
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        let wishlist = await Wishlist.findOne({ user: session.user.id });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: session.user.id,
                products: [productId],
            });
        } else if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
        }

        await wishlist.save();

        return NextResponse.json({
            message: 'Product added to wishlist',
            wishlist,
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return NextResponse.json(
            { error: 'Failed to add to wishlist' },
            { status: 500 }
        );
    }
}

// DELETE - Remove product from wishlist
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        await connectDB();

        if (productId) {
            // Remove specific product
            await Wishlist.updateOne(
                { user: session.user.id },
                { $pull: { products: productId } }
            );
        } else {
            // Clear entire wishlist
            await Wishlist.deleteOne({ user: session.user.id });
        }

        return NextResponse.json({
            message: productId ? 'Product removed from wishlist' : 'Wishlist cleared',
        });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return NextResponse.json(
            { error: 'Failed to remove from wishlist' },
            { status: 500 }
        );
    }
}
