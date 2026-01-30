import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';

// GET - Dashboard statistics
export async function GET() {
    const auth = await verifyAdmin();
    if (!auth.isAdmin) return auth.response;

    try {
        await connectDB();

        // Get counts
        const [
            totalOrders,
            pendingOrders,
            confirmedOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            totalUsers,
            totalProducts,
            revenueResult,
            recentOrders,
        ] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ status: 'pending' }),
            Order.countDocuments({ status: 'confirmed' }),
            Order.countDocuments({ status: 'shipped' }),
            Order.countDocuments({ status: 'delivered' }),
            Order.countDocuments({ status: 'cancelled' }),
            User.countDocuments(),
            Product.countDocuments(),
            Order.aggregate([
                { $match: { status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$total' } } },
            ]),
            Order.find()
                .populate('user', 'name email')
                .sort({ createdAt: -1 })
                .limit(5),
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;

        // Get monthly revenue for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    status: { $ne: 'cancelled' },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        return NextResponse.json({
            stats: {
                totalOrders,
                totalUsers,
                totalProducts,
                totalRevenue,
                ordersByStatus: {
                    pending: pendingOrders,
                    confirmed: confirmedOrders,
                    shipped: shippedOrders,
                    delivered: deliveredOrders,
                    cancelled: cancelledOrders,
                },
            },
            monthlyRevenue,
            recentOrders,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
