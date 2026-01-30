import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export interface AdminSession {
    user: {
        id: string;
        name: string;
        email: string;
        role: 'admin';
    };
}

export async function verifyAdmin(): Promise<{ isAdmin: true; session: AdminSession } | { isAdmin: false; response: NextResponse }> {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return {
            isAdmin: false,
            response: NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            ),
        };
    }

    await connectDB();

    const user = await User.findById((session.user as { id: string }).id).select('role');

    if (!user || user.role !== 'admin') {
        return {
            isAdmin: false,
            response: NextResponse.json(
                { error: 'Access denied. Admin privileges required.' },
                { status: 403 }
            ),
        };
    }

    return {
        isAdmin: true,
        session: {
            user: {
                id: user._id.toString(),
                name: session.user.name || '',
                email: session.user.email || '',
                role: 'admin',
            },
        },
    };
}
