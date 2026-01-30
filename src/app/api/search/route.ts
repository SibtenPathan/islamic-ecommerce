import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - Search products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const limit = parseInt(searchParams.get('limit') || '10');
        const autocomplete = searchParams.get('autocomplete') === 'true';

        if (!query.trim()) {
            return NextResponse.json({ products: [], suggestions: [] });
        }

        await connectDB();

        if (autocomplete) {
            // Return quick suggestions for autocomplete
            const products = await Product.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } },
                ]
            })
                .select('name category image price')
                .limit(5);

            const suggestions = products.map(p => ({
                _id: p._id,
                name: p.name,
                category: p.category,
                image: p.image,
                price: p.price,
            }));

            return NextResponse.json({ suggestions });
        }

        // Full search with text search
        const products = await Product.find({
            $or: [
                { $text: { $search: query } },
                { name: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ]
        })
            .limit(limit)
            .sort({ score: { $meta: 'textScore' } });

        return NextResponse.json({
            products,
            total: products.length,
            query,
        });
    } catch (error) {
        console.error('Error searching products:', error);

        // Fallback to regex search if text search fails
        try {
            const { searchParams } = new URL(request.url);
            const query = searchParams.get('q') || '';
            const limit = parseInt(searchParams.get('limit') || '10');

            await connectDB();

            const products = await Product.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                ]
            }).limit(limit);

            return NextResponse.json({
                products,
                total: products.length,
                query,
            });
        } catch (fallbackError) {
            return NextResponse.json(
                { error: 'Failed to search products' },
                { status: 500 }
            );
        }
    }
}
