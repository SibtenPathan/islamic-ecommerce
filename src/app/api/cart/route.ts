import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';

// Get user's cart
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

        const cart = await Cart.findOne({ user: (session.user as { id: string }).id })
            .populate('items.product');

        if (!cart) {
            return NextResponse.json({ items: [], total: 0 }, { status: 200 });
        }

        // Calculate total
        const total = cart.items.reduce((sum, item) => {
            const product = item.product as unknown as { price: number };
            return sum + (product.price * item.quantity);
        }, 0);

        return NextResponse.json({
            items: cart.items,
            total: Math.round(total * 100) / 100
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cart' },
            { status: 500 }
        );
    }
}

// Add item to cart
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { productId, quantity = 1, selectedColor, selectedSize } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check stock
        if (product.stock < quantity) {
            return NextResponse.json(
                { error: 'Not enough stock' },
                { status: 400 }
            );
        }

        const userId = (session.user as { id: string }).id;
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart
            cart = await Cart.create({
                user: userId,
                items: [{
                    product: productId,
                    quantity,
                    selectedColor,
                    selectedSize,
                }],
            });
        } else {
            // Check if product already in cart
            const existingItemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (existingItemIndex > -1) {
                // Update quantity
                cart.items[existingItemIndex].quantity += quantity;
                if (selectedColor) cart.items[existingItemIndex].selectedColor = selectedColor;
                if (selectedSize) cart.items[existingItemIndex].selectedSize = selectedSize;
            } else {
                // Add new item
                cart.items.push({
                    product: productId,
                    quantity,
                    selectedColor,
                    selectedSize,
                });
            }
            await cart.save();
        }

        // Populate and return updated cart
        await cart.populate('items.product');

        const total = cart.items.reduce((sum, item) => {
            const prod = item.product as unknown as { price: number };
            return sum + (prod.price * item.quantity);
        }, 0);

        return NextResponse.json({
            message: 'Item added to cart',
            items: cart.items,
            total: Math.round(total * 100) / 100
        }, { status: 200 });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { error: 'Failed to add to cart' },
            { status: 500 }
        );
    }
}

// Update item quantity
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { productId, quantity } = await request.json();

        if (!productId || quantity === undefined) {
            return NextResponse.json(
                { error: 'Product ID and quantity are required' },
                { status: 400 }
            );
        }

        await connectDB();

        const userId = (session.user as { id: string }).id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return NextResponse.json(
                { error: 'Cart not found' },
                { status: 404 }
            );
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return NextResponse.json(
                { error: 'Item not in cart' },
                { status: 404 }
            );
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items.splice(itemIndex, 1);
        } else {
            // Verify stock
            const product = await Product.findById(productId);
            if (product && product.stock < quantity) {
                return NextResponse.json(
                    { error: 'Not enough stock' },
                    { status: 400 }
                );
            }
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.product');

        const total = cart.items.reduce((sum, item) => {
            const prod = item.product as unknown as { price: number };
            return sum + (prod.price * item.quantity);
        }, 0);

        return NextResponse.json({
            message: 'Cart updated',
            items: cart.items,
            total: Math.round(total * 100) / 100
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json(
            { error: 'Failed to update cart' },
            { status: 500 }
        );
    }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
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

        const userId = (session.user as { id: string }).id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return NextResponse.json(
                { error: 'Cart not found' },
                { status: 404 }
            );
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate('items.product');

        const total = cart.items.reduce((sum, item) => {
            const prod = item.product as unknown as { price: number };
            return sum + (prod.price * item.quantity);
        }, 0);

        return NextResponse.json({
            message: 'Item removed from cart',
            items: cart.items,
            total: Math.round(total * 100) / 100
        }, { status: 200 });
    } catch (error) {
        console.error('Error removing from cart:', error);
        return NextResponse.json(
            { error: 'Failed to remove from cart' },
            { status: 500 }
        );
    }
}
