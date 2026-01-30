'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './EventsSection.css';

interface Event {
    _id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    link?: string;
}

// Fallback events when no events in database
const fallbackEvents: Event[] = [
    {
        _id: '1',
        title: 'Eid Collection',
        description: 'Exclusive Eid collection',
        image: '/images/Home1/image 84.png',
        date: new Date().toISOString(),
    },
    {
        _id: '2',
        title: 'Ramadan Special',
        description: 'Special Ramadan offers',
        image: '/images/Home1/image 85.png',
        date: new Date().toISOString(),
    },
    {
        _id: '3',
        title: 'New Arrivals',
        description: 'Fresh styles just arrived',
        image: '/images/Home1/image 86.png',
        date: new Date().toISOString(),
    },
];

export default function EventsSection() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/admin/events');
                const data = await response.json();
                if (data.events && data.events.length > 0) {
                    setEvents(data.events);
                } else {
                    setEvents(fallbackEvents);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents(fallbackEvents);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <section className="event-banner">
                <div className="event-container">
                    <div className="events-loading">
                        <div className="loading-card"></div>
                        <div className="loading-card"></div>
                        <div className="loading-card"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="event-banner">
            <div className="event-container">
                <div className="event-content">
                    <div className="islamic-divider-sm light">
                        <span className="islamic-pattern">❋</span>
                    </div>
                    <h2 className="event-title">Upcoming Events</h2>
                    <p className="event-subtitle">
                        Discover special events and exclusive offers
                    </p>
                    <div className="event-cards">
                        {events.slice(0, 4).map((event) => (
                            <div key={event._id} className="event-card">
                                {event.link ? (
                                    <Link href={event.link} className="event-card-link">
                                        <div className="event-card-image">
                                            {event.image ? (
                                                <Image
                                                    src={event.image}
                                                    alt={event.title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="event-placeholder">📅</div>
                                            )}
                                        </div>
                                        <h4 className="event-card-title">{event.title}</h4>
                                    </Link>
                                ) : (
                                    <>
                                        <div className="event-card-image">
                                            {event.image ? (
                                                <Image
                                                    src={event.image}
                                                    alt={event.title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="event-placeholder">📅</div>
                                            )}
                                        </div>
                                        <h4 className="event-card-title">{event.title}</h4>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
