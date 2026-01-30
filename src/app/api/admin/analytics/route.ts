import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || '30'; // days

        await connectDB();

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // Get overview stats
        const [totalOrders, totalRevenue, totalProducts, totalUsers] = await Promise.all([
            Order.countDocuments({ createdAt: { $gte: startDate } }),
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            Product.countDocuments(),
            User.countDocuments(),
        ]);

        // Sales by day for chart
        const salesByDay = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 },
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top selling products
        const topProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 1,
                    totalSold: 1,
                    revenue: 1,
                    name: '$product.name',
                    image: '$product.image',
                }
            }
        ]);

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Sales by category
        const salesByCategory = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    count: { $sum: '$items.quantity' },
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        // Recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Calculate growth percentages
        const previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - parseInt(period));

        const [previousRevenue, previousOrders] = await Promise.all([
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: previousStartDate, $lt: startDate },
                        status: { $ne: 'cancelled' }
                    }
                },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            Order.countDocuments({
                createdAt: { $gte: previousStartDate, $lt: startDate }
            }),
        ]);

        const currentRevenue = totalRevenue[0]?.total || 0;
        const prevRevenue = previousRevenue[0]?.total || 0;
        const revenueGrowth = prevRevenue > 0
            ? ((currentRevenue - prevRevenue) / prevRevenue) * 100
            : 0;

        const ordersGrowth = previousOrders > 0
            ? ((totalOrders - previousOrders) / previousOrders) * 100
            : 0;

        return NextResponse.json({
            overview: {
                totalOrders,
                totalRevenue: currentRevenue,
                totalProducts,
                totalUsers,
                revenueGrowth: Math.round(revenueGrowth * 10) / 10,
                ordersGrowth: Math.round(ordersGrowth * 10) / 10,
            },
            salesByDay,
            topProducts,
            ordersByStatus,
            salesByCategory,
            recentOrders,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
