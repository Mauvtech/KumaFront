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
        <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
            <div className="mb-4">
                <label className="block mb-2 text-gray-800">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 rounded-lg shadow-inner bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-800">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg shadow-inner bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                />
            </div>
            <button type="submit" className="w-full p-3 text-white rounded-lg bg-gray-400 shadow-[3px_3px_6px_#b3b3b3,-3px_-3px_6px_#ffffff] hover:bg-gray-500 focus:outline-none">
                Login
            </button>
        </form>
    );
};

export default LoginPage;
