import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User, { IAddress } from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Fetch user's addresses
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(session.user.id).select('addresses');

        return NextResponse.json({
            addresses: user?.addresses || [],
        });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch addresses' },
            { status: 500 }
        );
    }
}

// POST - Add new address
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const address = await request.json();

        await connectDB();

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If this is the first address or set as default, set as default
        if (user.addresses.length === 0 || address.isDefault) {
            // Reset all other addresses' default status
            user.addresses.forEach((addr: IAddress) => {
                addr.isDefault = false;
            });
            address.isDefault = true;
        }

        user.addresses.push(address);
        await user.save();

        return NextResponse.json({
            message: 'Address added successfully',
            addresses: user.addresses,
        });
    } catch (error) {
        console.error('Error adding address:', error);
        return NextResponse.json(
            { error: 'Failed to add address' },
            { status: 500 }
        );
    }
}

// PUT - Update address
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { addressId, ...addressData } = await request.json();

        if (!addressId) {
            return NextResponse.json(
                { error: 'Address ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const addressIndex = user.addresses.findIndex(
            (addr: IAddress) => addr._id?.toString() === addressId
        );

        if (addressIndex === -1) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            );
        }

        // If setting as default, reset others
        if (addressData.isDefault) {
            user.addresses.forEach((addr: IAddress) => {
                addr.isDefault = false;
            });
        }

        user.addresses[addressIndex] = {
            ...user.addresses[addressIndex],
            ...addressData,
        } as IAddress;

        await user.save();

        return NextResponse.json({
            message: 'Address updated successfully',
            addresses: user.addresses,
        });
    } catch (error) {
        console.error('Error updating address:', error);
        return NextResponse.json(
            { error: 'Failed to update address' },
            { status: 500 }
        );
    }
}

// DELETE - Remove address
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const addressId = searchParams.get('addressId');

        if (!addressId) {
            return NextResponse.json(
                { error: 'Address ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findByIdAndUpdate(
            session.user.id,
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        );

        return NextResponse.json({
            message: 'Address deleted successfully',
            addresses: user?.addresses || [],
        });
    } catch (error) {
        console.error('Error deleting address:', error);
        return NextResponse.json(
            { error: 'Failed to delete address' },
            { status: 500 }
        );
    }
}
