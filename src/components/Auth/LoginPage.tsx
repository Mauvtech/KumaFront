import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { login as loginService } from '../../services/authService';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = await loginService({ username, password });
            if (userData) {
                login(userData);
                navigate('/');
            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Erreur de connexion', error);
        }
    };

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Connexion</h2>
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
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
                Connexion
            </button>
        </form>
    );
};

export default LoginPage;
