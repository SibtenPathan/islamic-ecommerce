import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - List all products with pagination
export async function GET(request: NextRequest) {
    const auth = await verifyAdmin();
    if (!auth.isAdmin) return auth.response;

    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';

        const query: Record<string, unknown> = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(query),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST - Create new product
export async function POST(request: NextRequest) {
    const auth = await verifyAdmin();
    if (!auth.isAdmin) return auth.response;

    try {
        const body = await request.json();
        const {
            name,
            category,
            price,
            originalPrice,
            image,
            colors,
            sizes,
            material,
            description,
            specifications,
            stock,
            isNewArrival,
            isBestSeller,
            isTrending,
        } = body;

        if (!name || !category || !price || !image) {
            return NextResponse.json(
                { error: 'Name, category, price, and image are required' },
                { status: 400 }
            );
        }

        await connectDB();

        const product = await Product.create({
            name,
            category,
            price,
            originalPrice,
            image,
            colors: colors || [],
            sizes: sizes || [],
            material,
            description,
            specifications: specifications || [],
            stock: stock || 100,
            isNewArrival: isNewArrival || false,
            isBestSeller: isBestSeller || false,
            isTrending: isTrending || false,
        });

        return NextResponse.json({
            message: 'Product created successfully',
            product,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
