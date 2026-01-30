'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './events.css';

interface Event {
    _id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    endDate?: string;
    link?: string;
    isActive: boolean;
    createdAt: string;
}

const initialFormData = {
    title: '',
    description: '',
    image: '',
    date: '',
    endDate: '',
    link: '',
    isActive: true,
};

export default function EventsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchEvents();
        }
    }, [status, router]);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/admin/events?admin=true');
            const data = await response.json();
            setEvents(data.events || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const url = '/api/admin/events';
            const method = editingEvent ? 'PUT' : 'POST';
            const body = editingEvent ? { id: editingEvent._id, ...formData } : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: `Event ${editingEvent ? 'updated' : 'created'} successfully!` });
                fetchEvents();
                resetForm();
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save event' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Event deleted successfully!' });
                fetchEvents();
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete event' });
        }
    };

    const toggleActive = async (event: Event) => {
        try {
            await fetch('/api/admin/events', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: event._id, isActive: !event.isActive }),
            });
            fetchEvents();
        } catch (error) {
            console.error('Error toggling event:', error);
        }
    };

    const editEvent = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            image: event.image,
            date: new Date(event.date).toISOString().split('T')[0],
            endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
            link: event.link || '',
            isActive: event.isActive,
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingEvent(null);
        setFormData(initialFormData);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="events-page">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="events-page">
            <div className="page-header">
                <h1>Event Management</h1>
                {!showForm && (
                    <button className="add-btn" onClick={() => setShowForm(true)}>
                        + Create Event
                    </button>
                )}
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
            )}

            {showForm && (
                <form className="event-form" onSubmit={handleSubmit}>
                    <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>

                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Event Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date (optional)</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Link (optional)</label>
                            <input
                                type="text"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            />
                        </div>
                        <div className="form-group checkbox">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                            <label htmlFor="isActive">Active</label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                        <button type="submit" className="submit-btn">
                            {editingEvent ? 'Update' : 'Create'} Event
                        </button>
                    </div>
                </form>
            )}

            <div className="events-list">
                {events.length === 0 ? (
                    <p className="no-data">No events found. Create your first event!</p>
                ) : (
                    events.map((event) => (
                        <div key={event._id} className={`event-card ${!event.isActive ? 'inactive' : ''}`}>
                            {event.image && (
                                <div className="event-image">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            <div className="event-content">
                                <div className="event-header">
                                    <h3>{event.title}</h3>
                                    <span className={`status-badge ${event.isActive ? 'active' : 'inactive'}`}>
                                        {event.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="event-date">📅 {formatDate(event.date)}</p>
                                <p className="event-description">{event.description}</p>
                                <div className="event-actions">
                                    <button onClick={() => toggleActive(event)}>
                                        {event.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button onClick={() => editEvent(event)}>Edit</button>
                                    <button className="delete" onClick={() => handleDelete(event._id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
