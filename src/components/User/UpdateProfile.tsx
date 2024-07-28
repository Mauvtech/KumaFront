import React, { useState } from 'react';
import { updateUserProfile } from '../../services/userService';
import { useAuth } from '../../contexts/authContext';

const UpdateProfile: React.FC = () => {
    const { user, setUser, logout } = useAuth();
    const [username, setUsername] = useState<string>(user?.username || '');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const updatedUser = await updateUserProfile({ username, password });
            setUser(updatedUser); 
            logout();
        } catch (error) {
            console.error('Error while updating profile', error);
            setError('Error while updating profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleUpdateProfile} className="max-w-md mx-auto mt-10 p-6 bg-background rounded-lg shadow-neumorphic">
            <h2 className="text-2xl font-bold mb-4 text-text">Update Profile</h2>
            {error && <div className="mb-4 text-error">{error}</div>}
            <div className="mb-4">
                <label className="block mb-2 text-text" htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 rounded-lg shadow-inner bg-backgroundHover focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-text" htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg shadow-inner bg-backgroundHover focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <button
                type="submit"
                className="w-full p-3 text-white rounded-lg bg-primary shadow-neumorphic hover:bg-primaryLight focus:outline-none"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Update'}
            </button>
        </form>
    );
};

export default UpdateProfile;
