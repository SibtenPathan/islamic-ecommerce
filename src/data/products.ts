// Mock data for the Islamic E-Commerce website

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  colors?: string[];
  sizes?: string[];
  material?: string;
  description?: string;
  specifications?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
}

export interface Category {
  id: number;
  name: string;
  productCount: number;
  image: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  author: string;
  date: string;
  category: string;
  slug: string;
  readTime: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// Categories - Using ListCollections images
export const categories: Category[] = [
  { id: 1, name: 'Hijab', productCount: 245, image: '/images/ListCollections/image 101-11.png', slug: 'hijab' },
  { id: 2, name: 'Abaya', productCount: 189, image: '/images/ListCollections/image 102-9.png', slug: 'abaya' },
  { id: 3, name: 'Gamis', productCount: 156, image: '/images/ListCollections/image 103-10.png', slug: 'gamis' },
  { id: 4, name: 'Baju Kurung', productCount: 98, image: '/images/ListCollections/image 104-7.png', slug: 'baju-kurung' },
  { id: 5, name: 'Atasan', productCount: 134, image: '/images/ListCollections/image 105-6.png', slug: 'atasan' },
  { id: 6, name: 'Dress', productCount: 112, image: '/images/ListCollections/image 106-5.png', slug: 'dress' },
];

// Products - Using ProductCatlog and DetailProdut images
export const products: Product[] = [
  {
    id: 1,
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
    isBestSeller: true,
  },
  {
    id: 2,
    name: 'Young Pashmina Maroon',
    category: 'Hijab',
    price: 22.00,
    image: '/images/ProductCatlog/image 87-2.png',
    colors: ['#8B2942', '#D4A574', '#F5E6D3'],
    isBestSeller: true,
  },
  {
    id: 3,
    name: 'Young Pashmina Grey',
    category: 'Hijab',
    price: 22.00,
    image: '/images/ProductCatlog/image 86-3.png',
    colors: ['#6B6B6B', '#2D2D2D'],
    isBestSeller: true,
  },
  {
    id: 4,
    name: 'Young Pashmina Dusty Pink Milk',
    category: 'Hijab',
    price: 24.00,
    image: '/images/ProductCatlog/image 85-4.png',
    colors: ['#E8D4D4', '#D4A574'],
    isBestSeller: true,
  },
  {
    id: 5,
    name: 'Muslimah Cotton Satin',
    category: 'Hijab',
    price: 18.00,
    image: '/images/ProductCatlog/image 84-5.png',
    colors: ['#2E5A3A', '#D4A574', '#2D2D2D'],
    isNew: true,
  },
  {
    id: 6,
    name: 'Women Dress Abaya Black',
    category: 'Abaya',
    price: 65.00,
    originalPrice: 80.00,
    image: '/images/ProductCatlog/image 83-6.png',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isTrending: true,
  },
  {
    id: 7,
    name: 'Women Gamis Dress Mocha',
    category: 'Gamis',
    price: 58.00,
    image: '/images/ProductCatlog/image 82-7.png',
    sizes: ['S', 'M', 'L', 'XL'],
    isTrending: true,
  },
  {
    id: 8,
    name: 'Muslimah Dress Mocc Green',
    category: 'Dress',
    price: 45.00,
    image: '/images/ProductCatlog/image 81-8.png',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 9,
    name: 'Outwear Pashmina Choco Milky',
    category: 'Outerwear',
    price: 35.00,
    originalPrice: 45.00,
    image: '/images/ProductCatlog/image 80-9.png',
  },
  {
    id: 10,
    name: 'Muslimah Dress Mosc Green',
    category: 'Dress',
    price: 35.00,
    image: '/images/ProductCatlog/image 79-10.png',
  },
  {
    id: 11,
    name: 'Outwear Pashmina Choco with Straps',
    category: 'Outerwear',
    price: 40.00,
    image: '/images/ProductCatlog/image 78-11.png',
  },
  {
    id: 12,
    name: 'Outwear Gamis with Straps',
    category: 'Gamis',
    price: 40.00,
    image: '/images/ProductCatlog/image 77-12.png',
  },
];

// Blog Posts - Using Blog images
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '7 of the Greatest Mosques in the World',
    excerpt: 'Discover the architectural wonders and spiritual significance of the world\'s most beautiful mosques.',
    image: '/images/Blog/image 55-1.png',
    author: 'Müslüman Editorial',
    date: 'January 15, 2024',
    category: 'Travel',
    slug: '7-greatest-mosques-in-the-world',
    readTime: '8 min read',
  },
  {
    id: 2,
    title: '8 Most Beautiful Mosques in the World',
    excerpt: 'A journey through the stunning architectural masterpieces of Islamic heritage.',
    image: '/images/Blog/image 58-2.png',
    author: 'Müslüman Editorial',
    date: 'January 12, 2024',
    category: 'Architecture',
    slug: '8-most-beautiful-mosques',
    readTime: '10 min read',
  },
  {
    id: 3,
    title: '4 Sunnah Practices to Commemorate on Birthday of the Prophet Muhammad SAW',
    excerpt: 'Learn about meaningful practices to honor the Prophet\'s birthday celebration.',
    image: '/images/Blog/image 51-3.png',
    author: 'Müslüman Editorial',
    date: 'January 10, 2024',
    category: 'Islamic Practices',
    slug: '4-sunnah-practices-maulid',
    readTime: '5 min read',
  },
  {
    id: 4,
    title: 'Muslim Fashion Trends To Look Stylish But Still Syar\'i',
    excerpt: 'Stay fashionable while maintaining modest dress codes with these trending styles.',
    image: '/images/Blog/image 56-4.png',
    author: 'Müslüman Editorial',
    date: 'January 8, 2024',
    category: 'Fashion',
    slug: 'muslim-fashion-trends-stylish-syari',
    readTime: '6 min read',
  },
  {
    id: 5,
    title: '11 Powerful Ways So Hijab Doesn\'t Smell Even If It\'s Used All Day',
    excerpt: 'Practical tips to keep your hijab fresh and fragrant throughout the day.',
    image: '/images/Blog/image 59-5.png',
    author: 'Müslüman Editorial',
    date: 'January 5, 2024',
    category: 'Tips',
    slug: '11-ways-hijab-doesnt-smell',
    readTime: '7 min read',
  },
  {
    id: 6,
    title: 'These are the Most Comfortable Hijab Models and Materials for Traveling',
    excerpt: 'Find the perfect hijab for your next travel adventure with comfort and style.',
    image: '/images/Blog/image 52-6.png',
    author: 'Müslüman Editorial',
    date: 'January 3, 2024',
    category: 'Travel',
    slug: 'comfortable-hijab-for-traveling',
    readTime: '5 min read',
  },
];

// Upcoming Events - Using ListCollections images
export const events: Event[] = [
  {
    id: 1,
    title: 'New Products',
    description: 'Discover our latest collection',
    image: '/images/ListCollections/Image-1.png',
    date: 'Coming Soon',
  },
  {
    id: 2,
    title: 'Big Sale',
    description: 'Up to 50% off on selected items',
    image: '/images/ListCollections/Image-2.png',
    date: 'This Weekend',
  },
  {
    id: 3,
    title: 'Flash Sale',
    description: 'Limited time offers',
    image: '/images/ListCollections/Image-3.png',
    date: 'Today Only',
  },
];

// Color options for filters
export const colorOptions = [
  { name: 'Cream', value: '#F5E6D3' },
  { name: 'Brown', value: '#D4A574' },
  { name: 'Dark Brown', value: '#8B7355' },
  { name: 'Black', value: '#2D2D2D' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Green', value: '#2E5A3A' },
  { name: 'Maroon', value: '#8B2942' },
  { name: 'Grey', value: '#6B6B6B' },
  { name: 'Pink', value: '#E8D4D4' },
  { name: 'Yellow', value: '#F5D26E' },
];

// Size options
export const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

// Price ranges for filters
export const priceRanges = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: Infinity },
];

// Navigation items
export const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Collections', href: '/collections', hasDropdown: true },
  { name: 'Sale', href: '/products?sale=true', isHighlighted: true },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
  { name: 'About us', href: '/about' },
];

// Collection dropdown items
export const collectionItems = [
  { name: 'Hijab', href: '/products?category=hijab' },
  { name: 'Abaya', href: '/products?category=abaya' },
  { name: 'Gamis', href: '/products?category=gamis' },
  { name: 'Baju Kurung', href: '/products?category=baju-kurung' },
  { name: 'Atasan', href: '/products?category=atasan' },
  { name: 'Dress', href: '/products?category=dress' },
  { name: 'Outerwear', href: '/products?category=outerwear' },
];

// Footer links
export const footerCollections = [
  { name: 'Hijab', href: '/products?category=hijab' },
  { name: 'Abaya', href: '/products?category=abaya' },
  { name: 'Gamis', href: '/products?category=gamis' },
  { name: 'Baju Kurung', href: '/products?category=baju-kurung' },
  { name: 'Atasan', href: '/products?category=atasan' },
  { name: 'Dress', href: '/products?category=dress' },
  { name: 'Outerwear', href: '/products?category=outerwear' },
];

export const footerInfo = [
  { name: 'Terms & Conditions', href: '/terms' },
  { name: 'About us', href: '/about' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Shop address', href: '/contact' },
];

// Social links
export const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
];

// Company stats for About page
export const companyStats = [
  { label: 'Total Orders', value: '10B+', color: '#C4A77D' },
  { label: 'Active Customers', value: '1B+', color: '#6B5344' },
  { label: 'Store Branch', value: '50+', color: '#C4A77D' },
];
