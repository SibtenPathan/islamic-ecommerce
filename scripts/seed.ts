import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from '../src/models/Product.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Banner from '../src/models/Banner.js';
import Event from '../src/models/Event.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/islamic-ecommerce';

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

// Categories data
const categories = [
    { name: 'Hijab', slug: 'hijab', image: '/images/ProductCatlog/image 88-1.png', description: 'Beautiful hijab collection', isActive: true },
    { name: 'Abaya', slug: 'abaya', image: '/images/ProductCatlog/image 83-6.png', description: 'Elegant abaya designs', isActive: true },
    { name: 'Gamis', slug: 'gamis', image: '/images/ProductCatlog/image 82-7.png', description: 'Modest gamis dresses', isActive: true },
    { name: 'Dress', slug: 'dress', image: '/images/ProductCatlog/image 81-8.png', description: 'Muslimah dresses', isActive: true },
    { name: 'Outerwear', slug: 'outerwear', image: '/images/ProductCatlog/image 80-9.png', description: 'Outer garments', isActive: true },
];

// Banner data (for hero carousel)
const banners = [
    {
        title: 'Discount 30%',
        subtitle: 'Women Dress Maroon',
        image: '/images/Home1/fococlipping-20211228-164156 1-22.png',
        link: '/products',
        buttonText: 'Shop Now',
        order: 1,
        isActive: true,
    },
    {
        title: 'New Arrivals',
        subtitle: 'Explore Latest Collection',
        image: '/images/Home1/image 94-21.png',
        link: '/products?filter=new',
        buttonText: 'Discover',
        order: 2,
        isActive: true,
    },
    {
        title: 'Best Sellers',
        subtitle: 'Most Popular Items',
        image: '/images/Home1/image 95-17.png',
        link: '/products?filter=bestseller',
        buttonText: 'Shop Best',
        order: 3,
        isActive: true,
    },
];

// Events data
const events = [
    {
        title: 'Eid Collection',
        description: 'Exclusive Eid collection with special discounts',
        image: '/images/Home1/image 84.png',
        date: new Date('2026-04-01'),
        isActive: true,
    },
    {
        title: 'Ramadan Special',
        description: 'Special Ramadan offers on selected items',
        image: '/images/Home1/image 85.png',
        date: new Date('2026-03-01'),
        isActive: true,
    },
    {
        title: 'Summer Collection',
        description: 'Fresh summer styles just arrived',
        image: '/images/Home1/image 86.png',
        date: new Date('2026-05-01'),
        isActive: true,
    },
];

// Admin user data
const adminUser = {
    name: 'Admin',
    email: 'admin@musluman.com',
    password: 'admin123',
    role: 'admin',
};

async function seed() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Banner.deleteMany({});
        await Event.deleteMany({});

        // Create admin user if not exists
        console.log('👤 Creating admin user...');
        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminUser.password, 12);
            await User.create({
                name: adminUser.name,
                email: adminUser.email,
                password: hashedPassword,
                role: adminUser.role,
            });
            console.log('✅ Admin user created');
            console.log(`   Email: ${adminUser.email}`);
            console.log(`   Password: ${adminUser.password}`);
        } else {
            // Update role to admin if exists
            await User.findByIdAndUpdate(existingAdmin._id, { role: 'admin' });
            console.log('✅ Admin user already exists (role updated)');
        }

        // Insert categories
        console.log('🏷️  Inserting categories...');
        const insertedCategories = await Category.insertMany(categories);
        console.log(`✅ Inserted ${insertedCategories.length} categories`);

        // Insert products
        console.log('📦 Inserting products...');
        const insertedProducts = await Product.insertMany(products);
        console.log(`✅ Inserted ${insertedProducts.length} products`);

        // Insert banners
        console.log('🖼️  Inserting banners...');
        const insertedBanners = await Banner.insertMany(banners);
        console.log(`✅ Inserted ${insertedBanners.length} banners`);

        // Insert events
        console.log('📅 Inserting events...');
        const insertedEvents = await Event.insertMany(events);
        console.log(`✅ Inserted ${insertedEvents.length} events`);

        // Log product IDs for reference
        console.log('\n📋 Product IDs:');
        insertedProducts.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.name}: ${p._id}`);
        });

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📌 Sample Data Added:');
        console.log(`   - ${insertedProducts.length} Products`);
        console.log(`   - ${insertedCategories.length} Categories`);
        console.log(`   - ${insertedBanners.length} Banners (Hero Carousel)`);
        console.log(`   - ${insertedEvents.length} Events`);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

seed();

