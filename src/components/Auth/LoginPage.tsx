import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { login as loginService } from '../../services/authService';
import { AxiosError } from 'axios';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ username?: string, password?: string, general?: string }>({});
    const navigate = useNavigate();
    const { login } = useAuth();

    const validateForm = () => {
        let formErrors: { username?: string, password?: string } = {};

        if (!username) {
            formErrors.username = 'Username is required';
        }

        if (!password) {
            formErrors.password = 'Password is required';
        }

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const userData = await loginService({ username, password });
            if (userData) {
                login(userData);
                navigate('/');
            } else {
                setErrors({ general: 'Login failed' });
                console.error('Login failed');
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    setErrors({ general: "Invalid credentials" });
                } else { setErrors({ general: 'Registration failed' }); }
            } else { console.error('Login error', error); }
            console.error('Login eror', error);
        }
    };

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
            {errors.general && <div className="mb-4 text-red-500">{errors.general}</div>}
            <div className="mb-4">
                <label htmlFor="username" className="block mb-2 text-gray-800">Username</label>
                <input
                    id="username"
                    placeholder="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full p-3 rounded-lg shadow-inner bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.username ? 'border-red-500' : ''}`}
                    required
                />
                {errors.username && <div className="text-red-500">{errors.username}</div>}
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-gray-800">Password</label>
                <input
                    placeholder="password"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-3 rounded-lg shadow-inner bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.password ? 'border-red-500' : ''}`}
                    required
                />
                {errors.password && <div className="text-red-500">{errors.password}</div>}
            </div>
            <button type="submit" className="w-full p-3 text-white rounded-lg bg-gray-400 shadow-[3px_3px_6px_#b3b3b3,-3px_-3px_6px_#ffffff] hover:bg-gray-500 focus:outline-none">
                Login
            </button>
        </form>
    );
};

export default LoginPage;
