import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { FaUser, FaSpinner, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaPlus, FaTachometerAlt, FaListAlt, FaCommentDots, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setMenuOpen(false);
        navigate('/login');
    };

    function toggleDropdown() {
        setDropdownOpen(!dropdownOpen);
    };

    function toggleMenu() {
        setMenuOpen(!menuOpen);
    };

    function handleClickOutside(event: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setMenuOpen(false);
        }
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
        <nav className="bg-gray-200 p-4 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-gray-700 text-xl font-bold flex items-center">
                    <FaCommentDots className="mr-2" />
                    KUMA
                </Link>
                <button className="md:hidden text-gray-700" onClick={toggleMenu}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
                <div ref={menuRef} className={`md:flex ${menuOpen ? 'block' : 'hidden'} md:items-center md:space-x-4 absolute md:relative top-0 left-0 w-full md:w-auto bg-gray-200 md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none z-10`}>
                    {loading ? (
                        <div className="text-gray-700 flex items-center mt-4 md:mt-0">
                            <FaSpinner className="animate-spin mr-2" />
                            Loading...
                        </div>
                    ) : user ? (
                        <>
                            <Link to="/new-term" className="text-gray-700 flex items-center mt-4 md:mt-0">
                                <FaPlus className="mr-2" />
                                New Term
                            </Link>
                            <Link to="/terms/quiz" className="text-gray-700 flex items-center mt-4 md:mt-0">
                                <FaListAlt className="mr-2" />
                                Quiz
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/dashboard" className="text-gray-700 flex items-center mt-4 md:mt-0">
                                    <FaTachometerAlt className="mr-2" />
                                    Dashboard
                                </Link>
                            )}
                            {(user.role === 'admin' || user.role === 'moderator') && (
                                <Link to="/terms" className="text-gray-700 flex items-center mt-4 md:mt-0">
                                    <FaListAlt className="mr-2" />
                                    Term Management
                                </Link>
                            )}
                            <div className="relative mt-4 md:mt-0" ref={dropdownRef}>
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
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                                        >
                                            <FaSignOutAlt className="mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 flex items-center mt-4 md:mt-0">
                                <FaSignInAlt className="mr-2" />
                                Login
                            </Link>
                            <Link to="/register" className="text-gray-700 flex items-center mt-4 md:mt-0">
                                <FaUserPlus className="mr-2" />
                                Signin
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
