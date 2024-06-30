import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { FaUser,FaSpinner, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHome, FaChevronDown, FaPlus, FaTachometerAlt, FaListAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        console.log('User:', user); // Debugging
    });

    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold flex items-center">
                    <FaHome className="mr-2" />
                    WikiLang
                </Link>
                <div className="flex items-center">
                    {loading ? (
                        <div className="text-white flex items-center">
                            <FaSpinner className="animate-spin mr-2" />
                            Chargement...
                        </div>
                    ) : user ? (
                        <>
                            <Link to="/new-term" className="text-white mr-4 flex items-center">
                                <FaPlus className="mr-2" />
                                Nouveau Terme
                            </Link>
                            {(user.role === 'admin' || user.role === 'moderator') && (
                                <>
                                    <Link to="/dashboard" className="text-white mr-4 flex items-center">
                                        <FaTachometerAlt className="mr-2" />
                                        Dashboard
                                    </Link>
                                    <Link to="/terms" className="text-white mr-4 flex items-center">
                                        <FaListAlt className="mr-2" />
                                        Gérer les Termes
                                    </Link>
                                </>
                            )}
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="text-white flex items-center focus:outline-none"
                                >
                                    <FaUser className="mr-2" />
                                    <span>{user.username}</span>
                                    <FaChevronDown className="ml-2" />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                                        >
                                            <FaUser className="mr-2" />
                                            Profil
                                        </Link>
                                        {user.role === 'moderator' && (
                                            <Link
                                                to="/moderation"
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                                            >
                                                Modération
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                                        >
                                            <FaSignOutAlt className="mr-2" />
                                            Déconnexion
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white mr-4 flex items-center">
                                <FaSignInAlt className="mr-2" />
                                Connexion
                            </Link>
                            <Link to="/register" className="text-white flex items-center">
                                <FaUserPlus className="mr-2" />
                                Inscription
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
