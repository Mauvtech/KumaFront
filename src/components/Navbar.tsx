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
import { motion, AnimatePresence } from "framer-motion";
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

    // Framer Motion Variants for Dropdown
    const dropdownVariants = {
        closed: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.2 },
            display: "none",
        },
        open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
            display: "block",
        },
    };

    // Framer Motion Variants for Menu
    const menuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.3 },
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: { duration: 0.5 },
        },
    };

    return (
        <nav className="bg-transparent text-lg absolute z-20 w-full max-w-screen">
            <div className="container mx-auto flex justify-between items-center h-16 px-4">
                <Link to="/" className="text-primary text-xl font-bold flex items-center">
                    <FaCommentDots className="mr-2" />
                    KUMA
                </Link>
                <button className="md:hidden text-primary focus:outline-none" onClick={toggleMenu}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
                <div className="hidden md:flex items-center space-x-4">
                    {loading ? (
                        <div className="text-text flex items-center">
                            <Skeleton circle={true} height={40} width={40} />
                            <Skeleton height={40} width={100} className="ml-2" />
                        </div>
                    ) : (
                        <>
                            <Link to="/new-term" className="text-text flex items-center">
                                <FaPlus className="mr-2" />
                                New Term
                            </Link>
                            <Link to="/terms/flashcard-serie" className="text-text flex items-center">
                                <FaQuestion className="mr-2" />
                                Quiz
                            </Link>
                            {user && (
                                <>
                                    {user.role === "admin" && (
                                        <Link to="/dashboard" className="text-text flex items-center">
                                            <FaTachometerAlt className="mr-2" />
                                            Dashboard
                                        </Link>
                                    )}
                                    {(user.role === "admin" || user.role === "moderator") && (
                                        <Link to="/terms" className="text-text flex items-center">
                                            <FaListAlt className="mr-2" />
                                            Term Management
                                        </Link>
                                    )}
                                    <Link to="/bookmarks" className="text-text flex items-center">
                                        <FaBookmark className="mr-2" />
                                        Bookmarks
                                    </Link>
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={toggleDropdown}
                                            className="text-text flex items-center focus:outline-none"
                                        >
                                            <FaUser className="mr-2" />
                                            <span>{user.username}</span>
                                            <FaChevronDown className="ml-2" />
                                        </button>
                                        <AnimatePresence>
                                            {dropdownOpen && (
                                                <motion.div
                                                    className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-neumorphic py-2 z-20"
                                                    initial="closed"
                                                    animate="open"
                                                    exit="closed"
                                                    variants={dropdownVariants}
                                                >
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
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </>
                            )}
                            {!user && (
                                <>
                                    <Link to="/login" className="text-text flex items-center">
                                        <FaSignInAlt className="mr-2" />
                                        Login
                                    </Link>
                                    <Link to="/register" className="text-text flex items-center">
                                        <FaUserPlus className="mr-2" />
                                        Signin
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>
                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            ref={menuRef}
                            className="md:hidden absolute top-16 left-0 w-full bg-background p-4 z-10"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                        >
                            {loading ? (
                                <div className="text-text flex items-center">
                                    <Skeleton circle={true} height={40} width={40} />
                                    <Skeleton height={40} width={100} className="ml-2" />
                                </div>
                            ) : (
                                <>
                                    <Link to="/new-term" className="text-text flex items-center mt-4">
                                        <FaPlus className="mr-2" />
                                        New Term
                                    </Link>
                                    <Link to="/terms/flashcard-serie" className="text-text flex items-center mt-4">
                                        <FaQuestion className="mr-2" />
                                        Quiz
                                    </Link>
                                    {user && (
                                        <>
                                            {user.role === "admin" && (
                                                <Link to="/dashboard" className="text-text flex items-center mt-4">
                                                    <FaTachometerAlt className="mr-2" />
                                                    Dashboard
                                                </Link>
                                            )}
                                            {(user.role === "admin" || user.role === "moderator") && (
                                                <Link to="/terms" className="text-text flex items-center mt-4">
                                                    <FaListAlt className="mr-2" />
                                                    Term Management
                                                </Link>
                                            )}
                                            <Link to="/bookmarks" className="text-text flex items-center mt-4">
                                                <FaBookmark className="mr-2" />
                                                Bookmarks
                                            </Link>
                                            <div className="relative mt-4" ref={dropdownRef}>
                                                <button
                                                    onClick={toggleDropdown}
                                                    className="text-text flex items-center focus:outline-none"
                                                >
                                                    <FaUser className="mr-2" />
                                                    <span>{user.username}</span>
                                                    <FaChevronDown className="ml-2" />
                                                </button>
                                                <AnimatePresence>
                                                    {dropdownOpen && (
                                                        <motion.div
                                                            className="mt-2 bg-background rounded-md shadow-neumorphic py-2 z-20"
                                                            initial="closed"
                                                            animate="open"
                                                            exit="closed"
                                                            variants={dropdownVariants}
                                                        >
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
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </>
                                    )}
                                    {!user && (
                                        <>
                                            <Link to="/login" className="text-text flex items-center mt-4">
                                                <FaSignInAlt className="mr-2" />
                                                Login
                                            </Link>
                                            <Link to="/register" className="text-text flex items-center mt-4">
                                                <FaUserPlus className="mr-2" />
                                                Signin
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

export default Navbar;
