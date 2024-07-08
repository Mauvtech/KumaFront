import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../services/userService';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<any>(null);
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
            } catch (error) {
                console.error('Erreur de chargement du profil utilisateur', error);
            }
        };

        fetchUserProfile();
    }, [user, navigate]);

    if (!userProfile) {
        return <p>Chargement...</p>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Profil de l'utilisateur</h2>
            <p><strong>Nom d'utilisateur:</strong> {userProfile.username}</p>
            <p><strong>Rôle:</strong> {userProfile.role}</p>
            <button
                onClick={() => navigate('/update-profile')}
                className="mt-4 p-2 bg-blue-500 text-white rounded-md"
            >
                Modifier le profil
            </button>
        </div>
    );
};

export default ProfilePage;
