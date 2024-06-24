import React, { useState } from 'react';
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Par défaut, le rôle est 'user'
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ username, password, role });
            navigate('/login'); // Redirection vers la page de connexion après inscription réussie
        } catch (error) {
            console.error('Erreur d\'inscription', error);
        }
    };

    return (
        <form onSubmit={handleRegister} className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Inscription</h2>
            <div className="mb-4">
                <label className="block mb-2">Nom d'utilisateur</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Mot de passe</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Rôle</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                >
                    <option value="user">Utilisateur</option>
                    <option value="moderator">Modérateur</option>
                    <option value="admin">Administrateur</option>
                </select>
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
                Inscription
            </button>
        </form>
    );
};

export default RegisterPage;
