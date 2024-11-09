import React, {useEffect, useState} from "react";
import {getStats} from "../../services/statsService";
import {useAuth} from "../../contexts/authContext";
import {Link, useNavigate} from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {motion} from "framer-motion";

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const {user, loading} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            if (!user || !user.token) {
                navigate("/login");
                return;
            }

            try {
                const data = await getStats();
                setStats(data);
            } catch (error) {
                console.error("Erreur de chargement des statistiques", error);
            }
        };

        if (!loading) {
            fetchStats();
        }
    }, [user, loading, navigate]);

    if (loading || !stats) {
        return (
            <div className="max-w-6xl mx-auto mt-10 p-6 bg-background rounded-lg shadow-neumorphic">
                <h2 className="text-3xl font-bold mb-6 text-text">Dashboard</h2>
                <div className="grid grid-cols-3 gap-4">
                    {Array(6)
                        .fill("Number")
                        .map((_, index) => (
                            <div
                                key={index}
                                className="p-4 bg-primary-light rounded-lg shadow-neumorphic"
                            >
                                <h3 className="sm:text-lg font-bold text-text">
                                    <Skeleton width={80}/>
                                </h3>
                                <p className="sm:text-xl text-text">
                                    <Skeleton width={40}/>
                                </p>
                            </div>
                        ))}
                </div>
            </div>
        );
    }

    const isAdmin = user?.role === "admin";
    const isModerator = user?.role === "moderator";

    return (
        <div className="max-w-full mx-auto mt-10 p-6 bg-background rounded-lg shadow-neumorphic">
            <h2 className="sm:text-4xl text-2xl font-bold mb-8 text-text">Dashboard</h2>
            <div className="grid grid-cols-3 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <motion.div
                    className="p-4 bg-primary-light rounded-lg shadow-neumorphic"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.1}}
                >
                    <h3 className="sm:text-lg text-base font-bold text-text">Total Users</h3>
                    <p className="sm:text-2xl text-lg text-text">{stats.userCount}</p>
                </motion.div>
                <motion.div
                    className="p-4 bg-successLight rounded-lg shadow-neumorphic"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.2}}
                >
                    <h3 className="sm:text-lg text-base font-bold text-text">Total Terms</h3>
                    <p className="sm:text-2xl text-lg text-text">{stats.termCount}</p>
                </motion.div>
                <motion.div
                    className="p-4 bg-yellow-200 rounded-lg shadow-neumorphic"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.3}}
                >
                    <h3 className="sm:text-lg text-base font-bold text-text">Approved Terms</h3>
                    <p className="sm:text-2xl text-lg text-text">{stats.approvedTermCount}</p>
                </motion.div>
                <motion.div
                    className="p-4 bg-errorLight rounded-lg shadow-neumorphic"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.4}}
                >
                    <h3 className="sm:text-lg text-base font-bold text-text">Rejected Terms</h3>
                    <p className="sm:text-2xl text-lg text-text">{stats.rejectedTermCount}</p>
                </motion.div>
                <motion.div
                    className="p-4 bg-purple-200 rounded-lg shadow-neumorphic"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.5}}
                >
                    <h3 className="sm:text-lg text-base font-bold text-text">Pending Terms</h3>
                    <p className="sm:text-2xl text-lg text-text">{stats.pendingTermCount}</p>
                </motion.div>
                <motion.div
                    className="p-4 bg-orange-200 rounded-lg shadow-neumorphic"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.6}}
                >
                    <h3 className="sm:text-lg text-base font-bold text-text">Banned Users</h3>
                    <p className="sm:text-2xl text-lg text-text">{stats.bannedUserCount}</p>
                </motion.div>
                {isAdmin && (
                    <>
                        <motion.div
                            className="p-4 bg-teal-200 rounded-lg shadow-neumorphic"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: 0.7}}
                        >
                            <h3 className="sm:text-lg text-base font-bold text-text">Admin Count</h3>
                            <p className="sm:text-2xl text-lg text-text">{stats.adminCount}</p>
                        </motion.div>
                        <motion.div
                            className="p-4 bg-pink-200 rounded-lg shadow-neumorphic"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: 0.8}}
                        >
                            <h3 className="sm:text-lg text-base font-bold text-text">Moderator Count</h3>
                            <p className="sm:text-2xl text-lg text-text">{stats.moderatorCount}</p>
                        </motion.div>
                    </>
                )}
            </div>

            {isAdmin && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 text-text">Admin Functions</h3>
                    <Link to="/users" className="text-primary">
                        Manage Users
                    </Link>
                </div>
            )}

            {isModerator && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 text-text">Moderator Functions</h3>
                    <Link to="/moderation" className="text-primary">
                        Moderate Terms
                    </Link>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
