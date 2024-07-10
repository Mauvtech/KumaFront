import React, { useState } from 'react';
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role is 'user'
    const [errors, setErrors] = useState<{ username?: string, password?: string, confirmPassword?: string, general?: string }>({});
    const navigate = useNavigate();

    const validateForm = () => {
        let formErrors: { username?: string, password?: string, confirmPassword?: string } = {};

        if (!username) {
            formErrors.username = 'Username is required';
        }

        if (!password) {
            formErrors.password = 'Password is required';
        }

        if (!confirmPassword) {
            formErrors.confirmPassword = 'Password confirmation is required';
        } else if (password !== confirmPassword) {
            formErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await register({ username, password, role });
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    setErrors({ general: "Invalid credentials" }   );
                } else { setErrors({ general: 'Registration failed' }); }
            } else { console.error('Registration error', error); }

        }
    };

    return (
        <form onSubmit={handleRegister} className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Sign Up</h2>
            {errors.general && <div className="mb-4 text-red-500">{errors.general}</div>}
            <div className="mb-4">
                <label className="block mb-2 text-gray-800">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full p-3 rounded-lg shadow-inner bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.username ? 'border-red-500' : ''}`}
                    required
                />
                {errors.username && <div className="text-red-500">{errors.username}</div>}
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-800">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-3 rounded-lg shadow-inner bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.password ? 'border-red-500' : ''}`}
                    required
                />
                {errors.password && <div className="text-red-500">{errors.password}</div>}
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-800">Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full p-3 rounded-lg shadow-inner bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    required
                />
                {errors.confirmPassword && <div className="text-red-500">{errors.confirmPassword}</div>}
            </div>
            <button type="submit" className="w-full p-3 text-white rounded-lg bg-gray-400 shadow-[3px_3px_6px_#b3b3b3,-3px_-3px_6px_#ffffff] hover:bg-gray-500 focus:outline-none">
                Sign Up
            </button>
        </form>
    );
};

export default RegisterPage;
