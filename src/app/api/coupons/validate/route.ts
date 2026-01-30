import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

// POST - Validate and apply coupon
export async function POST(request: NextRequest) {
    try {
        const { code, subtotal } = await request.json();

        if (!code) {
            return NextResponse.json(
                { error: 'Coupon code is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
        });

        if (!coupon) {
            return NextResponse.json(
                { error: 'Invalid coupon code' },
                { status: 404 }
            );
        }

        // Check expiration
        const now = new Date();
        if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
            return NextResponse.json(
                { error: 'This coupon has expired' },
                { status: 400 }
            );
        }

        // Check if usage limit is reached (maxUses = -1 means unlimited)
        if (coupon.maxUses !== -1 && coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json(
                { error: 'This coupon has reached its usage limit' },
                { status: 400 }
            );
        }

        // Check minimum order amount
        if (coupon.minPurchase && subtotal < coupon.minPurchase) {
            return NextResponse.json(
                { error: `Minimum order of ₹${coupon.minPurchase} required for this coupon` },
                { status: 400 }
            );
        }

        // Calculate discount
        let discount = 0;
        if (coupon.type === 'percentage') {
            discount = (subtotal * coupon.value) / 100;
            if (coupon.maxDiscount) {
                discount = Math.min(discount, coupon.maxDiscount);
            }
        } else {
            discount = coupon.value;
        }

        // Ensure discount doesn't exceed subtotal
        discount = Math.min(discount, subtotal);

        return NextResponse.json({
            valid: true,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
            },
            discount: Math.round(discount * 100) / 100,
        });
    } catch (error) {
        console.error('Error validating coupon:', error);
        return NextResponse.json(
            { error: 'Failed to validate coupon' },
            { status: 500 }
        );
    }
}
