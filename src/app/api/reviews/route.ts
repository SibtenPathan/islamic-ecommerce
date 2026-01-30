import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Fetch reviews for a product
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const skip = (page - 1) * limit;

        const [reviews, total, stats] = await Promise.all([
            Review.find({ product: productId })
                .populate('user', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Review.countDocuments({ product: productId }),
            Review.aggregate([
                { $match: { product: productId } },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: '$rating' },
                        totalReviews: { $sum: 1 },
                        ratings: {
                            $push: '$rating'
                        }
                    }
                }
            ])
        ]);

        // Calculate rating distribution
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if (stats.length > 0 && stats[0].ratings) {
            stats[0].ratings.forEach((r: number) => {
                ratingDistribution[r as keyof typeof ratingDistribution]++;
            });
        }

        return NextResponse.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            stats: {
                averageRating: stats[0]?.averageRating || 0,
                totalReviews: stats[0]?.totalReviews || 0,
                ratingDistribution,
            },
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Please login to leave a review' },
                { status: 401 }
            );
        }

        const { productId, rating, title, comment } = await request.json();

        if (!productId || !rating || !title || !comment) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            user: session.user.id,
            product: productId,
        });

        if (existingReview) {
            return NextResponse.json(
                { error: 'You have already reviewed this product' },
                { status: 400 }
            );
        }

        // Check if user has purchased this product (verified purchase)
        const order = await Order.findOne({
            user: session.user.id,
            'items.product': productId,
            status: 'delivered',
        });

        const review = await Review.create({
            user: session.user.id,
            product: productId,
            rating,
            title,
            comment,
            isVerifiedPurchase: !!order,
        });

        // Update product's average rating
        const stats = await Review.aggregate([
            { $match: { product: productId } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    count: { $sum: 1 },
                }
            }
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: Math.round(stats[0].averageRating * 10) / 10,
                reviewCount: stats[0].count,
            });
        }

        return NextResponse.json({
            message: 'Review submitted successfully',
            review,
        });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            { error: 'Failed to submit review' },
            { status: 500 }
        );
    }
}
