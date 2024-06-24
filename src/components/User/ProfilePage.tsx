import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../services/userService';
import { getCurrentUser } from '../../services/authService';

const ProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<any>(null);
    const user = getCurrentUser();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const data = await getUserProfile(user.token);
                setUserProfile(data);
            } catch (error) {
                console.error('Erreur de chargement du profil utilisateur', error);
            }
        };

        fetchUserProfile();
    }, [user.token]);

    if (!userProfile) {
        return <p>Chargement...</p>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Profil de l'utilisateur</h2>
            <p><strong>Nom d'utilisateur:</strong> {userProfile.username}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
        </div>
    );
};

export default ProfilePage;
