import React, { useEffect, useState } from 'react';
import { getStats } from '../../services/statsService';
import { useAuth } from '../../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';

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
                const data = await getStats( navigate);
                setStats(data);
            } catch (error) {
                console.error('Erreur de chargement des statistiques', error);
            }
        };

        if (!loading) {
            fetchStats();
        }
    }, [user, loading, navigate]);

    if (loading|| !stats) {
        return <p>Chargement...</p>;
    }

    const isAdmin = user?.role === 'admin';
    const isModerator = user?.role === 'moderator';

    return (
        <div className="max-w-6xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-200 rounded-md shadow-md">
                    <h3 className="text-lg font-bold">Total Users</h3>
                    <p className="text-2xl">{stats.userCount}</p>
                </div>
                <div className="p-4 bg-green-200 rounded-md shadow-md">
                    <h3 className="text-lg font-bold">Total Terms</h3>
                    <p className="text-2xl">{stats.termCount}</p>
                </div>
                <div className="p-4 bg-yellow-200 rounded-md shadow-md">
                    <h3 className="text-lg font-bold">Approved Terms</h3>
                    <p className="text-2xl">{stats.approvedTermCount}</p>
                </div>
                <div className="p-4 bg-red-200 rounded-md shadow-md">
                    <h3 className="text-lg font-bold">Rejected Terms</h3>
                    <p className="text-2xl">{stats.rejectedTermCount}</p>
                </div>
                <div className="p-4 bg-purple-200 rounded-md shadow-md">
                    <h3 className="text-lg font-bold">Pending Terms</h3>
                    <p className="text-2xl">{stats.pendingTermCount}</p>
                </div>
                <div className="p-4 bg-orange-200 rounded-md shadow-md">
                    <h3 className="text-lg font-bold">Banned Users</h3>
                    <p className="text-2xl">{stats.bannedUserCount}</p>
                </div>
                {isAdmin && (
                    <>
                        <div className="p-4 bg-teal-200 rounded-md shadow-md">
                            <h3 className="text-lg font-bold">Admin Count</h3>
                            <p className="text-2xl">{stats.adminCount}</p>
                        </div>
                        <div className="p-4 bg-pink-200 rounded-md shadow-md">
                            <h3 className="text-lg font-bold">Moderator Count</h3>
                            <p className="text-2xl">{stats.moderatorCount}</p>
                        </div>
                    </>
                )}
            </div>

            {isAdmin && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Admin Functions</h3>
                    <Link to="/users" className="text-blue-500">Manage Users</Link>
                </div>
            )}

            {isModerator && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Moderator Functions</h3>
                    <Link to="/moderation" className="text-blue-500">Moderate Terms</Link>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
