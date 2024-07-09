import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../services/userService';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !user.token) {
                navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
                return;
            }
            try {
                console.log("Utilisateur dans ProfilePage:", user);
                const data = await getUserProfile(navigate); // Utilisation du token
                setUserProfile(data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur de chargement du profil utilisateur', error);
                setError('Erreur de chargement du profil utilisateur.');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, navigate]);

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-200 rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff]">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">User Profile</h2>
            <div className="space-y-6">
                <div className="p-4 bg-gray-200 rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff]">
                    <span className="block text-lg font-semibold text-gray-700">Username</span>
                    <span className="block mt-2 text-xl text-gray-900">{userProfile.username}</span>
                </div>
                <div className="p-4 bg-gray-200 rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff]">
                    <span className="block text-lg font-semibold text-gray-700">Role</span>
                    <span className="block mt-2 text-xl text-gray-900">{userProfile.role}</span>
                </div>
                <button
                    onClick={() => navigate('/update-profile')}
                    className="w-full mt-6 py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] hover:bg-gray-400 transform hover:scale-105 transition-transform duration-200"
                >
                    Modify profile
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
