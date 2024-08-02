import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import {
    FaUser,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
    FaPlus,
    FaTachometerAlt,
    FaListAlt,
    FaCommentDots,
    FaChevronDown,
    FaBars,
    FaTimes,
    FaQuestion,
    FaBookmark,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
        navigate("/login");
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-transparent text-lg fixed z-20 w-full shadow-lg">
            <div className="container mx-auto flex justify-between items-center h-16 px-4">
                <Link to="/" className="text-primary text-xl font-bold flex items-center">
                    <FaCommentDots className="mr-2" />
                    KUMA
                </Link>
                <button className="md:hidden text-primary focus:outline-none" onClick={toggleMenu}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
                <div
                    ref={menuRef}
                    className={`md:flex ${menuOpen ? "block" : "hidden"
                        } md:items-center md:space-x-4 absolute md:static top-16 left-0 w-full md:w-auto bg-background md:bg-transparent p-4 md:p-0 z-10 transition-all duration-200 ease-in-out`}
                >
                    {loading ? (
                        <div className="text-text flex items-center mt-4 md:mt-0">
                            <Skeleton circle={true} height={40} width={40} />
                            <Skeleton height={40} width={100} className="ml-2" />
                        </div>
                    ) : (
                        <>
                            <Link to="/new-term" className="text-text flex items-center mt-4 md:mt-0">
                                <FaPlus className="mr-2" />
                                New Term
                            </Link>
                            <Link to="/terms/flashcard-serie" className="text-text flex items-center mt-4 md:mt-0">
                                <FaQuestion className="mr-2" />
                                Quiz
                            </Link>
                            {user && (
                                <>
                                    {user.role === "admin" && (
                                        <Link to="/dashboard" className="text-text flex items-center mt-4 md:mt-0">
                                            <FaTachometerAlt className="mr-2" />
                                            Dashboard
                                        </Link>
                                    )}
                                    {(user.role === "admin" || user.role === "moderator") && (
                                        <Link to="/terms" className="text-text flex items-center mt-4 md:mt-0">
                                            <FaListAlt className="mr-2" />
                                            Term Management
                                        </Link>
                                    )}
                                    <Link to="/bookmarks" className="text-text flex items-center mt-4 md:mt-0">
                                        <FaBookmark className="mr-2" />
                                        Bookmarks
                                    </Link>
                                    <div className="relative mt-4 md:mt-0" ref={dropdownRef}>
                                        <button
                                            onClick={toggleDropdown}
                                            className="text-text flex items-center focus:outline-none"
                                        >
                                            <FaUser className="mr-2" />
                                            <span>{user.username}</span>
                                            <FaChevronDown className="ml-2" />
                                        </button>
                                        {dropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-neumorphic py-2 z-20">
                                                <Link
                                                    onClick={toggleDropdown}
                                                    to="/profile"
                                                    className="block px-4 py-2 text-text hover:bg-secondary hover:text-background flex items-center"
                                                >
                                                    <FaUser className="mr-2" />
                                                    Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-text hover:bg-secondary hover:text-background flex items-center"
                                                >
                                                    <FaSignOutAlt className="mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            {!user && (
                                <>
                                    <Link to="/login" className="text-text flex items-center mt-4 md:mt-0">
                                        <FaSignInAlt className="mr-2" />
                                        Login
                                    </Link>
                                    <Link to="/register" className="text-text flex items-center mt-4 md:mt-0">
                                        <FaUserPlus className="mr-2" />
                                        Signin
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
