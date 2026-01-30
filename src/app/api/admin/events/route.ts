import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Fetch all events
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('admin') === 'true';

        await connectDB();

        if (isAdmin) {
            const session = await getServerSession(authOptions);
            if (!session?.user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const events = await Event.find().sort({ date: -1 });
            return NextResponse.json({ events });
        }

        // Public: only active upcoming events
        const now = new Date();
        const events = await Event.find({
            isActive: true,
            date: { $gte: now },
        }).sort({ date: 1 }).limit(10);

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

// POST - Create new event
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        await connectDB();

        const event = await Event.create(body);

        return NextResponse.json({ message: 'Event created', event });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}

// PUT - Update event
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, ...updateData } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        await connectDB();

        const event = await Event.findByIdAndUpdate(id, updateData, { new: true });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Event updated', event });
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}

// DELETE - Delete event
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        await connectDB();

        await Event.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Event deleted' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
