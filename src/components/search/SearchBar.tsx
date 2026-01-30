'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import './SearchBar.css';

interface Suggestion {
    _id: string;
    name: string;
    category: string;
    image: string;
    price: number;
}

interface SearchBarProps {
    placeholder?: string;
    className?: string;
}

export default function SearchBar({ placeholder = 'Search products...', className = '' }: SearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&autocomplete=true`);
                const data = await response.json();
                setSuggestions(data.suggestions || []);
                setIsOpen(true);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    router.push(`/products/${suggestions[selectedIndex]._id}`);
                    setIsOpen(false);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <div className={`search-bar-container ${className}`} ref={containerRef}>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedIndex(-1);
                    }}
                    onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="search-input"
                />
                <button type="submit" className="search-button" aria-label="Search">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                </button>
            </form>

            {isOpen && (suggestions.length > 0 || loading) && (
                <div className="suggestions-dropdown">
                    {loading ? (
                        <div className="loading-item">Searching...</div>
                    ) : (
                        <>
                            {suggestions.map((suggestion, index) => (
                                <Link
                                    key={suggestion._id}
                                    href={`/products/${suggestion._id}`}
                                    className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="suggestion-image">
                                        <Image
                                            src={suggestion.image}
                                            alt={suggestion.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="suggestion-info">
                                        <span className="suggestion-name">{suggestion.name}</span>
                                        <span className="suggestion-category">{suggestion.category}</span>
                                    </div>
                                    <span className="suggestion-price">
                                        {formatCurrency(suggestion.price)}
                                    </span>
                                </Link>
                            ))}
                            {query.trim() && (
                                <button
                                    className="view-all-btn"
                                    onClick={() => {
                                        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                                        setIsOpen(false);
                                    }}
                                >
                                    View all results for "{query}"
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
