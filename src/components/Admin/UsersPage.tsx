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
                const data = await getUsers(navigate);
                setUsers(data);
            } catch (error) {
                console.error('Erreur de chargement des utilisateurs', error);
            }
        };

        fetchUsers();
    }, [user, navigate]);

    const handlePromote = async (userId: string) => {
        try {
            await promoteUser(userId, navigate);
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
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Gestion des Utilisateurs</h2>
            <table className="min-w-full bg-gray-100 rounded-lg shadow-[3px_3px_6px_#b8b8b8,-3px_-3px_6px_#ffffff]">
                <thead>
                    <tr className="text-left">
                        <th className="py-2 px-4 border-b">Nom d'utilisateur</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Rôle</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} className="text-left">
                            <td className="py-2 px-4 border-b">{user.username}</td>
                            <td className="py-2 px-4 border-b">{user.email}</td>
                            <td className="py-2 px-4 border-b">{user.role}</td>
                            <td className="py-2 px-4 border-b flex gap-2">
                                <button
                                    onClick={() => handlePromote(user._id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-[5px_5px_10px_#a0a0a0,-5px_-5px_10px_#ffffff] transition-transform transform hover:scale-105 focus:outline-none"
                                >
                                    Promouvoir
                                </button>
                                <button
                                    onClick={() => handleBan(user._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-[5px_5px_10px_#a0a0a0,-5px_-5px_10px_#ffffff] transition-transform transform hover:scale-105 focus:outline-none"
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
