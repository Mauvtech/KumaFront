import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/authContext";
import {
    FaBars,
    FaBookmark,
    FaChevronDown,
    FaLink,
    FaListAlt,
    FaPlus,
    FaQuestion,
    FaSignInAlt,
    FaSignOutAlt,
    FaTachometerAlt,
    FaTimes,
    FaUser,
    FaUserPlus,
} from "react-icons/fa";
import {AnimatePresence, motion} from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Navbar() {
    const {user, loading, logout} = useAuth();
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
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
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
            transition: {duration: 0.2},
            display: "none",
        },
        open: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.3},
            display: "block",
        },
    };

    // Framer Motion Variants for Menu
    const menuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {duration: 0.3},
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: {duration: 0.5},
        },
    };

    // Navbar styling with gradient and shadows
    return (
        <nav className="fixed top-0 left-0 w-full z-20 bg-gradient-to-r from-primary via-secondary to-accent shadow-lg">
            <div className=" mx-auto px-4 sm:px-6 lg:px-20">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            className="text-primary text-xl font-bold flex items-center"
                        >
                            <FaLink className="mr-2"/>
                            KUMA
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        {loading ? (
                            <div className="text-primary flex items-center">
                                <Skeleton circle={true} height={40} width={40}/>
                                <Skeleton height={40} width={100} className="ml-2"/>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/new-term"
                                    className="text-primary flex items-center hover:text-primary transition duration-300"
                                >
                                    <FaPlus className="mr-2"/>
                                    New Term
                                </Link>
                                <span hidden>
                                <Link
                                    to="/terms/flashcard-serie"
                                    className="text-primary flex items-center hover:text-primary transition duration-300"
                                >
                                    <FaQuestion className="mr-2"/>
                                    Quiz
                                </Link>
                                </span>

                                {user && (
                                    <>
                                        {user.role === "admin" && (
                                            <Link
                                                to="/dashboard"
                                                className="text-primary flex items-center hover:text-primary transition duration-300"
                                            >
                                                <FaTachometerAlt className="mr-2"/>
                                                Dashboard
                                            </Link>
                                        )}
                                        {(user.role === "admin" || user.role === "moderator") && (
                                            <Link
                                                to="/terms"
                                                className="text-primary flex items-center hover:text-primary transition duration-300"
                                            >
                                                <FaListAlt className="mr-2"/>
                                                Term Management
                                            </Link>
                                        )}
                                        <Link
                                            to="/bookmarks"
                                            className="text-primary flex items-center hover:text-primary transition duration-300"
                                        >
                                            <FaBookmark className="mr-2"/>
                                            Bookmarks
                                        </Link>
                                        <div className="relative" ref={dropdownRef}>
                                            <button
                                                onClick={toggleDropdown}
                                                className="text-primary flex items-center focus:outline-none hover:text-primary transition duration-300"
                                            >
                                                <FaUser className="mr-2"/>
                                                <span>{user.username}</span>
                                                <FaChevronDown className="ml-2"/>
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
                                                            className="px-4 py-2 text-text hover:bg-secondary hover:text-primary flex items-center"
                                                        >
                                                            <FaUser className="mr-2"/>
                                                            Profile
                                                        </Link>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full text-left px-4 py-2 text-text hover:bg-secondary hover:text-primary flex items-center"
                                                        >
                                                            <FaSignOutAlt className="mr-2"/>
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
                                        <Link
                                            to="/login"
                                            className="text-primary flex items-center hover:text-primary transition duration-300"
                                        >
                                            <FaSignInAlt className="mr-2"/>
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="text-primary flex items-center hover:text-primary transition duration-300"
                                        >
                                            <FaUserPlus className="mr-2"/>
                                            Signin
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            className="text-primary focus:outline-none"
                            onClick={toggleMenu}
                        >
                            {menuOpen ? <FaTimes/> : <FaBars/>}
                        </button>
                    </div>
                </div>
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
                                <Skeleton circle={true} height={40} width={40}/>
                                <Skeleton height={40} width={100} className="ml-2"/>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/new-term"
                                    className="text-text flex items-center mt-4 hover:bg-primary hover:text-primary transition duration-300"
                                >
                                    <FaPlus className="mr-2"/>
                                    New Term
                                </Link>
                                <Link
                                    to="/terms/flashcard-serie"
                                    className="text-text flex items-center mt-4 hover:bg-primary hover:text-primary transition duration-300"
                                >
                                    <FaQuestion className="mr-2"/>
                                    Quiz
                                </Link>
                                {user && (
                                    <>
                                        {user.role === "admin" && (
                                            <Link
                                                to="/dashboard"
                                                className="text-text flex items-center mt-4 hover:bg-primary hover:text-primary transition duration-300"
                                            >
                                                <FaTachometerAlt className="mr-2"/>
                                                Dashboard
                                            </Link>
                                        )}
                                        {(user.role === "admin" || user.role === "moderator") && (
                                            <Link
                                                to="/terms"
                                                className="text-text flex items-center mt-4 hover:bg-primary hover:text-primary transition duration-300"
                                            >
                                                <FaListAlt className="mr-2"/>
                                                Term Management
                                            </Link>
                                        )}
                                        <Link
                                            to="/bookmarks"
                                            className="text-text flex items-center mt-4 hover:bg-primary hover:text-primary transition duration-300"
                                        >
                                            <FaBookmark className="mr-2"/>
                                            Bookmarks
                                        </Link>
                                        <div className="relative mt-4" ref={dropdownRef}>
                                            <button
                                                onClick={toggleDropdown}
                                                className="text-text flex items-center focus:outline-none hover:bg-primary hover:text-primary transition duration-300"
                                            >
                                                <FaUser className="mr-2"/>
                                                <span>{user.username}</span>
                                                <FaChevronDown className="ml-2"/>
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
                                                            className=" px-4 py-2 text-text hover:bg-secondary hover:text-primary flex items-center"
                                                        >
                                                            <FaUser className="mr-2"/>
                                                            Profile
                                                        </Link>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full text-left px-4 py-2 text-text hover:bg-secondary hover:text-primary flex items-center"
                                                        >
                                                            <FaSignOutAlt className="mr-2"/>
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
                                        <Link
                                            to="/login"
                                            className="text-text flex items-center mt-4 hover:bg-primary hover:text-primary transition duration-300"
                                        >
                                            <FaSignInAlt className="mr-2"/>
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="text-text flex items-center mt-4 hover:bg-primary hover:text-primary transition duration-300"
                                        >
                                            <FaUserPlus className="mr-2"/>
                                            Signin
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default Navbar;
