'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './profile.css';

interface Address {
    _id: string;
    label: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    newsletter: boolean;
    addresses: Address[];
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile form
    const [profileForm, setProfileForm] = useState({
        name: '',
        phone: '',
        newsletter: false,
    });

    // Password form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Address form
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressForm, setAddressForm] = useState({
        label: '',
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false,
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status, router]);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/user/profile');
            const data = await response.json();
            if (data.user) {
                setProfile(data.user);
                setProfileForm({
                    name: data.user.name || '',
                    phone: data.user.phone || '',
                    newsletter: data.user.newsletter || false,
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileForm),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setProfile(data.user);
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to change password' });
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const url = '/api/user/addresses';
            const method = editingAddress ? 'PUT' : 'POST';
            const body = editingAddress
                ? { addressId: editingAddress._id, ...addressForm }
                : addressForm;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: `Address ${editingAddress ? 'updated' : 'added'} successfully!` });
                setProfile(prev => prev ? { ...prev, addresses: data.addresses } : null);
                resetAddressForm();
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save address' });
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const response = await fetch(`/api/user/addresses?addressId=${addressId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(prev => prev ? { ...prev, addresses: data.addresses } : null);
                setMessage({ type: 'success', text: 'Address deleted successfully!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete address' });
        }
    };

    const resetAddressForm = () => {
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressForm({
            label: '',
            fullName: '',
            phone: '',
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India',
            isDefault: false,
        });
    };

    const editAddress = (address: Address) => {
        setEditingAddress(address);
        setAddressForm({
            label: address.label,
            fullName: address.fullName,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state || '',
            postalCode: address.postalCode,
            country: address.country,
            isDefault: address.isDefault,
        });
        setShowAddressForm(true);
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h1>My Account</h1>

                <div className="profile-layout">
                    <nav className="profile-nav">
                        <button
                            className={activeTab === 'profile' ? 'active' : ''}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                        <button
                            className={activeTab === 'password' ? 'active' : ''}
                            onClick={() => setActiveTab('password')}
                        >
                            Password
                        </button>
                        <button
                            className={activeTab === 'addresses' ? 'active' : ''}
                            onClick={() => setActiveTab('addresses')}
                        >
                            Addresses
                        </button>
                        <Link href="/orders">My Orders</Link>
                        <Link href="/wishlist">Wishlist</Link>
                    </nav>

                    <div className="profile-content">
                        {message.text && (
                            <div className={`message ${message.type}`}>{message.text}</div>
                        )}

                        {activeTab === 'profile' && (
                            <form className="profile-form" onSubmit={handleProfileSubmit}>
                                <h2>Profile Information</h2>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" value={profile?.email || ''} disabled />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={profileForm.phone}
                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    />
                                </div>

                                <div className="form-group checkbox">
                                    <input
                                        type="checkbox"
                                        id="newsletter"
                                        checked={profileForm.newsletter}
                                        onChange={(e) => setProfileForm({ ...profileForm, newsletter: e.target.checked })}
                                    />
                                    <label htmlFor="newsletter">Subscribe to newsletter</label>
                                </div>

                                <button type="submit" className="submit-btn">Save Changes</button>
                            </form>
                        )}

                        {activeTab === 'password' && (
                            <form className="profile-form" onSubmit={handlePasswordSubmit}>
                                <h2>Change Password</h2>

                                <div className="form-group">
                                    <label htmlFor="currentPassword">Current Password</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>

                                <button type="submit" className="submit-btn">Change Password</button>
                            </form>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="addresses-section">
                                <div className="section-header">
                                    <h2>Saved Addresses</h2>
                                    {!showAddressForm && (
                                        <button className="add-btn" onClick={() => setShowAddressForm(true)}>
                                            Add New Address
                                        </button>
                                    )}
                                </div>

                                {showAddressForm && (
                                    <form className="address-form" onSubmit={handleAddressSubmit}>
                                        <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="label">Label</label>
                                                <input
                                                    type="text"
                                                    id="label"
                                                    placeholder="e.g., Home, Work"
                                                    value={addressForm.label}
                                                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="fullName">Full Name</label>
                                                <input
                                                    type="text"
                                                    id="fullName"
                                                    value={addressForm.fullName}
                                                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="addressPhone">Phone</label>
                                            <input
                                                type="tel"
                                                id="addressPhone"
                                                value={addressForm.phone}
                                                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="street">Street Address</label>
                                            <input
                                                type="text"
                                                id="street"
                                                value={addressForm.street}
                                                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="city">City</label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    value={addressForm.city}
                                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="state">State</label>
                                                <input
                                                    type="text"
                                                    id="state"
                                                    value={addressForm.state}
                                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="postalCode">Postal Code</label>
                                                <input
                                                    type="text"
                                                    id="postalCode"
                                                    value={addressForm.postalCode}
                                                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="country">Country</label>
                                                <input
                                                    type="text"
                                                    id="country"
                                                    value={addressForm.country}
                                                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group checkbox">
                                            <input
                                                type="checkbox"
                                                id="isDefault"
                                                checked={addressForm.isDefault}
                                                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                            />
                                            <label htmlFor="isDefault">Set as default address</label>
                                        </div>

                                        <div className="form-actions">
                                            <button type="button" className="cancel-btn" onClick={resetAddressForm}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="submit-btn">
                                                {editingAddress ? 'Update' : 'Add'} Address
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="addresses-list">
                                    {profile?.addresses && profile.addresses.length > 0 ? (
                                        profile.addresses.map((address) => (
                                            <div key={address._id} className="address-card">
                                                <div className="address-header">
                                                    <span className="address-label">{address.label}</span>
                                                    {address.isDefault && (
                                                        <span className="default-badge">Default</span>
                                                    )}
                                                </div>
                                                <p className="address-name">{address.fullName}</p>
                                                <p className="address-text">{address.street}</p>
                                                <p className="address-text">
                                                    {address.city}{address.state ? `, ${address.state}` : ''} {address.postalCode}
                                                </p>
                                                <p className="address-text">{address.country}</p>
                                                <p className="address-phone">{address.phone}</p>
                                                <div className="address-actions">
                                                    <button onClick={() => editAddress(address)}>Edit</button>
                                                    <button onClick={() => handleDeleteAddress(address._id)} className="delete">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-addresses">No saved addresses yet.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
