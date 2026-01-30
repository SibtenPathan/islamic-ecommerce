'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/products/ProductCard';
import { colorOptions, sizeOptions, categories } from '@/data/products';
import './products.css';

interface Product {
  _id: string;
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
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
}

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState('newest');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (selectedColors.length > 0 && product.colors) {
      const hasMatchingColor = product.colors.some(c => selectedColors.includes(c));
      if (!hasMatchingColor) return false;
    }
    if (selectedSizes.length > 0 && product.sizes) {
      const hasMatchingSize = product.sizes.some(s => selectedSizes.includes(s));
      if (!hasMatchingSize) return false;
    }
    return true;
  });

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedCategory('');
    setPriceRange([0, 200]);
  };

  return (
    <div className="catalog-page">
      <section className="catalog-hero">
        <Image src="/images/ProductCatlog/rachelle-magpayo-YtVsAUt5ubs-unsplash 1-16.png" alt="Product Catalog" fill style={{ objectFit: 'cover' }} priority />
        <div className="catalog-hero-overlay">
          <h1>Women&apos;s Catalog</h1>
          <p>Discover our complete collection of modest fashion</p>
        </div>
      </section>

      <div className="catalog-container">
        <button className="filter-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6" />
          </svg>
          Filters
        </button>

        <div className="catalog-layout">
          <aside className={`catalog-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="close-filters" onClick={() => setIsSidebarOpen(false)}>✕</button>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Category</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input type="radio" name="category" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} />
                  <span>All Categories</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="filter-option">
                    <input type="radio" name="category" checked={selectedCategory === cat.slug} onChange={() => setSelectedCategory(cat.slug)} />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Color</h4>
              <div className="color-options">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={`color-option ${selectedColors.includes(color.value) ? 'selected' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => toggleColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Size</h4>
              <div className="size-options">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSizes.includes(size) ? 'selected' : ''}`}
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Price Range</h4>
              <div className="price-inputs">
                <input type="number" placeholder="Min" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="price-input" />
                <span>-</span>
                <input type="number" placeholder="Max" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="price-input" />
              </div>
            </div>

            <button className="clear-filters" onClick={clearFilters}>Clear All Filters</button>
          </aside>

          <main className="catalog-main">
            <div className="catalog-header">
              <p className="results-count">{filteredProducts.length} Products</p>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            <div className="products-grid">
              {loading ? (
                <div className="loading-state">
                  <p>Loading products...</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>

            {filteredProducts.length === 0 && (
              <div className="no-results">
                <p>No products found matching your filters.</p>
                <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
