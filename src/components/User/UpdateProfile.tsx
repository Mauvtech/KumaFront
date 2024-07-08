import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../services/userService';
import { useAuth } from '../../contexts/authContext';

const UpdateProfile: React.FC = () => {
    const { user, setUser,logout } = useAuth();
    const [username, setUsername] = useState<string>(user?.username || '');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const updatedUser = await updateUserProfile({ username, password }, navigate);
            setUser(updatedUser); // Mettre à jour le contexte utilisateur avec les nouvelles informations
            logout();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil', error);
            setError('Une erreur est survenue lors de la mise à jour du profil.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleUpdateProfile} className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Mettre à jour le profil</h2>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <div className="mb-4">
                <label className="block mb-2" htmlFor="username">Nom d'utilisateur</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="password">Mot de passe</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md" disabled={loading}>
                {loading ? 'Chargement...' : 'Mettre à jour'}
            </button>
        </form>
    );
};

export default UpdateProfile;
