import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const Sidebar: React.FC = () => {
    const { user} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="w-64 bg-gray-800 text-white h-full fixed">
            <div className="px-4 py-2 text-2xl font-bold">WikiLang Dashboard</div>
            <div className="mt-4">
                <nav>
                    <Link to="/" className="block px-4 py-2 hover:bg-gray-700">Accueil</Link>
                    <Link to="/moderation/pending" className="block px-4 py-2 hover:bg-gray-700">Termes en attente</Link>
                    <Link to="/moderation/approved" className="block px-4 py-2 hover:bg-gray-700">Termes approuvés</Link>
                    <Link to="/users" className="block px-4 py-2 hover:bg-gray-700">Utilisateurs</Link>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700">Profil</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-700">Déconnexion</button>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
