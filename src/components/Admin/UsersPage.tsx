import React, { useEffect, useState } from 'react';
import { getUsers, promoteUser, banUser } from '../../services/userService';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            if (!user || !user.token) {
                navigate('/login');
                return;
            }

            try {
                const data = await getUsers( navigate);
                setUsers(data);
            } catch (error) {
                console.error('Erreur de chargement des utilisateurs', error);
            }
        };

        fetchUsers();
    }, [user, navigate]);

    const handlePromote = async (userId: string) => {
        try {
            await promoteUser(userId,  navigate);
            // Mettre à jour la liste des utilisateurs après promotion
            setUsers(users.map(u => u._id === userId ? { ...u, role: 'admin' } : u));
        } catch (error) {
            console.error('Erreur de promotion de l\'utilisateur', error);
        }
    };

    const handleBan = async (userId: string) => {
        try {
            await banUser(userId, navigate);
            // Mettre à jour la liste des utilisateurs après bannissement
            setUsers(users.map(u => u._id === userId ? { ...u, banned: true } : u));
        } catch (error) {
            console.error('Erreur de bannissement de l\'utilisateur', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Nom d'utilisateur</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Rôle</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td className="py-2 px-4 border-b">{user.username}</td>
                            <td className="py-2 px-4 border-b">{user.email}</td>
                            <td className="py-2 px-4 border-b">{user.role}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handlePromote(user._id)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                                >
                                    Promouvoir
                                </button>
                                <button
                                    onClick={() => handleBan(user._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                                >
                                    Bannir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;
