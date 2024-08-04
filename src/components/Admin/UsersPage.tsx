import React, { useEffect, useState } from "react";
import { getUsers, promoteUser, banUser } from "../../services/userService";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!user || !user.token) {
                navigate("/login");
                return;
            }

            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error("Error loading users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user, navigate]);

    const handlePromote = async (userId: string) => {
        try {
            await promoteUser(userId);
            // Update the user list after promotion
            setUsers(users.map((u) => (u._id === userId ? { ...u, role: "admin" } : u)));
        } catch (error) {
            console.error("Error promoting user", error);
        }
    };

    const handleBan = async (userId: string) => {
        try {
            await banUser(userId);
            // Update the user list after banning
            setUsers(users.map((u) => (u._id === userId ? { ...u, banned: true } : u)));
        } catch (error) {
            console.error("Error banning user", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 p-4 md:p-6 bg-background rounded-lg shadow-neumorphic overflow-x-auto">
            <h2 className="text-3xl font-bold mb-6 text-text">Users</h2>
            <table className="min-w-full bg-background text-sm md:text-base border-collapse">
                <thead>
                    <tr className="text-left">
                        <th className="py-2 px-2 md:px-4 border-b text-text">Username</th>
                        <th className="py-2 px-2 md:px-4 border-b text-text hidden md:table-cell">Email</th>
                        <th className="py-2 px-2 md:px-4 border-b text-text">Role</th>
                        <th className="py-2 px-2 md:px-4 border-b text-text">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <tr
                                key={index}
                                className="hover:bg-primaryLight transition-colors duration-300"
                            >
                                <td className="py-2 px-2 md:px-4 border-b">
                                    <Skeleton height={20} width={100} />
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b hidden md:table-cell">
                                    <Skeleton height={20} width={200} />
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b">
                                    <Skeleton height={20} width={150} />
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b">
                                    <Skeleton height={40} width={100} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        users.map((user) => (
                            <motion.tr
                                key={user._id}
                                className="hover:bg-primaryLight transition-colors duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <td className="py-2 px-2 md:px-4 border-b">{user.username}</td>
                                <td className="py-2 px-2 md:px-4 border-b hidden md:table-cell">{user.email}</td>
                                <td className="py-2 px-2 md:px-4 border-b">{user.role}</td>
                                <td className="py-2 px-2 md:px-4 border-b flex gap-2">
                                    <button
                                        onClick={() => handlePromote(user._id)}
                                        className="bg-success text-white p-2 rounded-full shadow-neumorphic"
                                        title="Promote"
                                    >
                                        <FaArrowUp />
                                    </button>
                                    <button
                                        onClick={() => handleBan(user._id)}
                                        className="bg-error text-white p-2 rounded-full shadow-neumorphic"
                                        title="Ban"
                                    >
                                        <FaTimes />
                                    </button>
                                </td>
                            </motion.tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;
