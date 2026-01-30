import mongoose from 'mongoose';
import Product from '../src/models/Product';

const MONGODB_URI = 'mongodb://localhost:27017/islamic-ecommerce';

// Products data from the existing static file
const products = [
    {
        name: 'Turkey Pashmina',
        category: 'Hijab',
        price: 25.00,
        originalPrice: 35.00,
        image: '/images/ProductCatlog/image 88-1.png',
        colors: ['#F5E6D3', '#D4A574', '#8B7355', '#2D2D2D'],
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'Premium Pashmina',
        description: 'Elegant Turkey Pashmina hijab with soft texture and beautiful drape.',
        specifications: [
            'The material is soft',
            'Not easy to wrinkle',
            'Quality materials',
            'Comfortable to wear everyday'
        ],
        stock: 100,
        isBestSeller: true,
    },
    {
        name: 'Young Pashmina Maroon',
        category: 'Hijab',
        price: 22.00,
        image: '/images/ProductCatlog/image 87-2.png',
        colors: ['#8B2942', '#D4A574', '#F5E6D3'],
        stock: 100,
        isBestSeller: true,
    },
    {
        name: 'Young Pashmina Grey',
        category: 'Hijab',
        price: 22.00,
        image: '/images/ProductCatlog/image 86-3.png',
        colors: ['#6B6B6B', '#2D2D2D'],
        stock: 100,
        isBestSeller: true,
    },
    {
        name: 'Young Pashmina Dusty Pink Milk',
        category: 'Hijab',
        price: 24.00,
        image: '/images/ProductCatlog/image 85-4.png',
        colors: ['#E8D4D4', '#D4A574'],
        stock: 100,
        isBestSeller: true,
    },
    {
        name: 'Muslimah Cotton Satin',
        category: 'Hijab',
        price: 18.00,
        image: '/images/ProductCatlog/image 84-5.png',
        colors: ['#2E5A3A', '#D4A574', '#2D2D2D'],
        stock: 100,
        isNewArrival: true,
    },
    {
        name: 'Women Dress Abaya Black',
        category: 'Abaya',
        price: 65.00,
        originalPrice: 80.00,
        image: '/images/ProductCatlog/image 83-6.png',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 100,
        isTrending: true,
    },
    {
        name: 'Women Gamis Dress Mocha',
        category: 'Gamis',
        price: 58.00,
        image: '/images/ProductCatlog/image 82-7.png',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 100,
        isTrending: true,
    },
    {
        name: 'Muslimah Dress Mocc Green',
        category: 'Dress',
        price: 45.00,
        image: '/images/ProductCatlog/image 81-8.png',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 100,
    },
    {
        name: 'Outwear Pashmina Choco Milky',
        category: 'Outerwear',
        price: 35.00,
        originalPrice: 45.00,
        image: '/images/ProductCatlog/image 80-9.png',
        stock: 100,
    },
    {
        name: 'Muslimah Dress Mosc Green',
        category: 'Dress',
        price: 35.00,
        image: '/images/ProductCatlog/image 79-10.png',
        stock: 100,
    },
    {
        name: 'Outwear Pashmina Choco with Straps',
        category: 'Outerwear',
        price: 40.00,
        image: '/images/ProductCatlog/image 78-11.png',
        stock: 100,
    },
    {
        name: 'Outwear Gamis with Straps',
        category: 'Gamis',
        price: 40.00,
        image: '/images/ProductCatlog/image 77-12.png',
        stock: 100,
    },
];

async function seed() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});

        // Insert products
        console.log('📦 Inserting products...');
        const insertedProducts = await Product.insertMany(products);
        console.log(`✅ Inserted ${insertedProducts.length} products`);

        // Log product IDs for reference
        console.log('\n📋 Product IDs:');
        insertedProducts.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.name}: ${p._id}`);
        });

        console.log('\n🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

seed();
