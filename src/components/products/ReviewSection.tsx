'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import './ReviewSection.css';

interface Review {
    _id: string;
    user: { name: string };
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: string;
}

interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
}

interface ReviewSectionProps {
    productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        comment: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews?productId=${productId}`);
            const data = await response.json();
            setReviews(data.reviews || []);
            setStats(data.stats);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    ...formData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setSuccess('Review submitted successfully!');
            setFormData({ rating: 5, title: '', comment: '' });
            setShowForm(false);
            fetchReviews();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating: number, interactive = false) => {
        return (
            <div className={`stars ${interactive ? 'interactive' : ''}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? 'button' : undefined}
                        className={`star ${star <= rating ? 'filled' : ''}`}
                        onClick={interactive ? () => setFormData({ ...formData, rating: star }) : undefined}
                        disabled={!interactive}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return <div className="review-section loading">Loading reviews...</div>;
    }

    return (
        <div className="review-section">
            <div className="review-header">
                <h2>Customer Reviews</h2>
                {stats && stats.totalReviews > 0 && (
                    <div className="review-summary">
                        <div className="average-rating">
                            <span className="rating-number">{stats.averageRating.toFixed(1)}</span>
                            {renderStars(Math.round(stats.averageRating))}
                            <span className="total-reviews">({stats.totalReviews} reviews)</span>
                        </div>
                        <div className="rating-bars">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="rating-bar">
                                    <span className="star-label">{star} ★</span>
                                    <div className="bar-container">
                                        <div
                                            className="bar-fill"
                                            style={{
                                                width: `${stats.totalReviews > 0
                                                    ? (stats.ratingDistribution[star] / stats.totalReviews) * 100
                                                    : 0}%`
                                            }}
                                        />
                                    </div>
                                    <span className="count">{stats.ratingDistribution[star]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {session ? (
                !showForm ? (
                    <button className="write-review-btn" onClick={() => setShowForm(true)}>
                        Write a Review
                    </button>
                ) : (
                    <form className="review-form" onSubmit={handleSubmit}>
                        <h3>Write Your Review</h3>

                        <div className="form-group">
                            <label>Rating</label>
                            {renderStars(formData.rating, true)}
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">Review Title</label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Summarize your experience"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="comment">Your Review</label>
                            <textarea
                                id="comment"
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                placeholder="Tell others about your experience..."
                                rows={4}
                                required
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                )
            ) : (
                <p className="login-prompt">Please <a href="/login">login</a> to write a review</p>
            )}

            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="review-card">
                            <div className="review-top">
                                <div className="reviewer-info">
                                    <span className="reviewer-name">{review.user.name}</span>
                                    {review.isVerifiedPurchase && (
                                        <span className="verified-badge">✓ Verified Purchase</span>
                                    )}
                                </div>
                                <span className="review-date">{formatDate(review.createdAt)}</span>
                            </div>
                            <div className="review-rating">
                                {renderStars(review.rating)}
                            </div>
                            <h4 className="review-title">{review.title}</h4>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
