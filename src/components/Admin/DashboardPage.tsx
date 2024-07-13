import React, { useEffect, useState } from 'react';
import { getStats } from '../../services/statsService';
import { useAuth } from '../../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            if (!user || !user.token) {
                navigate('/login');
                return;
            }

            try {
                const data = await getStats(navigate);
                setStats(data);
            } catch (error) {
                console.error('Erreur de chargement des statistiques', error);
            }
        };

        if (!loading) {
            fetchStats();
        }
    }, [user, loading, navigate]);

    if (loading || !stats) {
        return (
            <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6).fill("Number").map((_, index) => (
                        <div key={index} className="p-4 bg-blue-200 rounded-lg shadow-[3px_3px_6px_#b0c4de,-3px_-3px_6px_#ffffff]">
                            <h3 className="text-lg font-bold text-gray-800"><Skeleton width={100} /></h3>
                            <p className="text-2xl text-gray-700"><Skeleton width={50} /></p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const isAdmin = user?.role === 'admin';
    const isModerator = user?.role === 'moderator';

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-200 rounded-lg shadow-[3px_3px_6px_#b0c4de,-3px_-3px_6px_#ffffff]">
                    <h3 className="text-lg font-bold text-gray-800">Total Users</h3>
                    <p className="text-2xl text-gray-700">{stats.userCount}</p>
                </div>
                <div className="p-4 bg-green-200 rounded-lg shadow-[3px_3px_6px_#98fb98,-3px_-3px_6px_#ffffff]">
                    <h3 className="text-lg font-bold text-gray-800">Total Terms</h3>
                    <p className="text-2xl text-gray-700">{stats.termCount}</p>
                </div>
                <div className="p-4 bg-yellow-200 rounded-lg shadow-[3px_3px_6px_#fffacd,-3px_-3px_6px_#ffffff]">
                    <h3 className="text-lg font-bold text-gray-800">Approved Terms</h3>
                    <p className="text-2xl text-gray-700">{stats.approvedTermCount}</p>
                </div>
                <div className="p-4 bg-red-200 rounded-lg shadow-[3px_3px_6px_#ffcccb,-3px_-3px_6px_#ffffff]">
                    <h3 className="text-lg font-bold text-gray-800">Rejected Terms</h3>
                    <p className="text-2xl text-gray-700">{stats.rejectedTermCount}</p>
                </div>
                <div className="p-4 bg-purple-200 rounded-lg shadow-[3px_3px_6px_#dda0dd,-3px_-3px_6px_#ffffff]">
                    <h3 className="text-lg font-bold text-gray-800">Pending Terms</h3>
                    <p className="text-2xl text-gray-700">{stats.pendingTermCount}</p>
                </div>
                <div className="p-4 bg-orange-200 rounded-lg shadow-[3px_3px_6px_#ffdab9,-3px_-3px_6px_#ffffff]">
                    <h3 className="text-lg font-bold text-gray-800">Banned Users</h3>
                    <p className="text-2xl text-gray-700">{stats.bannedUserCount}</p>
                </div>
                {isAdmin && (
                    <>
                        <div className="p-4 bg-teal-200 rounded-lg shadow-[3px_3px_6px_#afeeee,-3px_-3px_6px_#ffffff]">
                            <h3 className="text-lg font-bold text-gray-800">Admin Count</h3>
                            <p className="text-2xl text-gray-700">{stats.adminCount}</p>
                        </div>
                        <div className="p-4 bg-pink-200 rounded-lg shadow-[3px_3px_6px_#ffb6c1,-3px_-3px_6px_#ffffff]">
                            <h3 className="text-lg font-bold text-gray-800">Moderator Count</h3>
                            <p className="text-2xl text-gray-700">{stats.moderatorCount}</p>
                        </div>
                    </>
                )}
            </div>

            {isAdmin && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Admin Functions</h3>
                    <Link to="/users" className="text-blue-500">Manage Users</Link>
                </div>
            )}

            {isModerator && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Moderator Functions</h3>
                    <Link to="/moderation" className="text-blue-500">Moderate Terms</Link>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
