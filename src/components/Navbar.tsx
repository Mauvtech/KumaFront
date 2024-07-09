import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { FaUser, FaSpinner, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaPlus, FaTachometerAlt, FaListAlt, FaCommentDots, FaChevronDown } from 'react-icons/fa';

const Navbar: React.FC = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        toggleDropdown();
        navigate('/login');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-gray-100 p-4 shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff]">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-gray-700 text-xl font-bold flex items-center">
                    <FaCommentDots className="mr-2" />
                    KUMA
                </Link>
                <div className="flex items-center">
                    {loading ? (
                        <div className="text-gray-700 flex items-center">
                            <FaSpinner className="animate-spin mr-2" />
                            Chargement...
                        </div>
                    ) : user ? (
                        <>
                            <Link to="/new-term" className="text-gray-700 mr-4 flex items-center">
                                <FaPlus className="mr-2" />
                                Nouveau Terme
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/dashboard" className="text-gray-700 mr-4 flex items-center">
                                    <FaTachometerAlt className="mr-2" />
                                    Dashboard
                                </Link>
                            )}
                            {(user.role === 'admin' || user.role === 'moderator') && (
                                <Link to="/terms" className="text-gray-700 mr-4 flex items-center">
                                    <FaListAlt className="mr-2" />
                                    Gérer les Termes
                                </Link>
                            )}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    className="text-gray-700 flex items-center focus:outline-none"
                                >
                                    <FaUser className="mr-2" />
                                    <span>{user.username}</span>
                                    <FaChevronDown className="ml-2" />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                                        <Link
                                            onClick={toggleDropdown}
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                                        >
                                            <FaUser className="mr-2" />
                                            Profil
                                        </Link>
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
                            <Link to="/login" className="text-gray-700 mr-4 flex items-center">
                                <FaSignInAlt className="mr-2" />
                                Connexion
                            </Link>
                            <Link to="/register" className="text-gray-700 flex items-center">
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
