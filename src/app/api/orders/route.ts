import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';

// Get user's orders
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const orders = await Order.find({ user: (session.user as { id: string }).id })
            .sort({ createdAt: -1 });

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// Create order (checkout)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { shippingAddress } = await request.json();

        // Validate shipping address
        if (!shippingAddress?.fullName || !shippingAddress?.address ||
            !shippingAddress?.city || !shippingAddress?.postalCode ||
            !shippingAddress?.country || !shippingAddress?.phone) {
            return NextResponse.json(
                { error: 'Please provide complete shipping address' },
                { status: 400 }
            );
        }

        await connectDB();

        const userId = (session.user as { id: string }).id;

        // Get user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { error: 'Cart is empty' },
                { status: 400 }
            );
        }

        // Build order items and calculate total
        const orderItems = [];
        let total = 0;

        for (const item of cart.items) {
            const product = item.product as unknown as {
                _id: string;
                name: string;
                price: number;
                stock: number;
                image: string;
            };

            // Verify stock
            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Not enough stock for ${product.name}` },
                    { status: 400 }
                );
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
            });

            total += product.price * item.quantity;

            // Reduce stock
            await Product.findByIdAndUpdate(product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // Create order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            total: Math.round(total * 100) / 100,
            status: 'pending',
        });

        // Clear cart
        cart.items = [];
        await cart.save();

        return NextResponse.json({
            message: 'Order placed successfully',
            order: {
                id: order._id,
                total: order.total,
                status: order.status,
                itemCount: orderItems.length,
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
