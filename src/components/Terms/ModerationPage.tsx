import React, { useEffect, useState } from 'react';
import { getPendingTerms, approveTerm, rejectTerm } from '../../services/termService';
import { getCurrentUser, logout } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { handleAuthError } from '../../utils/handleAuthError';

const ModerationPage: React.FC = () => {
    const [terms, setTerms] = useState<any[]>([]);
    const user = getCurrentUser();
    const navigate = useNavigate();
    const [language, setLanguage] = useState('');
    const [languageCode, setLanguageCode] = useState('');
    const [grammaticalCategory, setGrammaticalCategory] = useState('');
    const [theme, setTheme] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTerms = async () => {
            if (!user || !user.token) {
                navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
                return;
            }

            try {
                const response = await getPendingTerms(navigate);
                setTerms(response);
            } catch (error) {
                console.error('Erreur de chargement des termes en attente', error);
                if (error instanceof AxiosError) {
                    handleAuthError(error, navigate);
                }
            }
        };

        fetchTerms();
    }, [user.token, navigate]);

    const handleApprove = async (termId: string) => {
        try {
            setLoading(true);
            const approveData = {
                language,
                languageCode,
                grammaticalCategory,
                theme
            };

            await approveTerm(termId, approveData, navigate);
            setTerms(terms.filter((term: any) => term._id !== termId));
        } catch (error) {
            console.error('Erreur d\'approbation du terme', error);
            if (error instanceof AxiosError) {
                handleAuthError(error, navigate);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (termId: string) => {
        try {
            setLoading(true);
            await rejectTerm(termId, navigate);
            setTerms(terms.filter((term: any) => term._id !== termId));
        } catch (error) {
            console.error('Erreur de rejet du terme', error);
            if (error instanceof AxiosError) {
                handleAuthError(error, navigate);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen">
            <div className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="px-4 py-2 text-2xl font-bold">WikiLang Dashboard</div>
                <div className="flex-1">
                    <nav>
                        <Link to="/moderation/pending" className="block px-4 py-2">Termes en attente</Link>
                        <Link to="/moderation/approved" className="block px-4 py-2">Termes approuvés</Link>
                        <Link to="/moderation/rejected" className="block px-4 py-2">Termes rejetés</Link>
                        <Link to="/users" className="block px-4 py-2">Utilisateurs</Link>
                    </nav>
                </div>
                <div className="px-4 py-2">
                    <button onClick={() => { logout(); navigate('/login'); }} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">Déconnexion</button>
                </div>
            </div>
            <div className="flex-1 p-4">
                <h2 className="text-2xl font-bold mb-4">Modération des Termes</h2>
                {loading && <p>Chargement...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-4">
                    <label className="block mb-2">Langue</label>
                    <input
                        type="text"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Code de la langue</label>
                    <input
                        type="text"
                        value={languageCode}
                        onChange={(e) => setLanguageCode(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Catégorie grammaticale</label>
                    <input
                        type="text"
                        value={grammaticalCategory}
                        onChange={(e) => setGrammaticalCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Thème</label>
                    <input
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <ul>
                    {terms.map((term: any) => (
                        <li key={term._id} className="mb-4 p-4 border border-gray-200 rounded-md transition transform hover:scale-105">
                            <h3 className="text-xl font-bold">{term.term}</h3>
                            <p>{term.definition}</p>
                            <div className="mt-2">
                                <button
                                    onClick={() => handleApprove(term._id)}
                                    className="mr-2 p-2 bg-green-500 text-white rounded-md"
                                    disabled={loading}
                                >
                                    Approuver
                                </button>
                                <button
                                    onClick={() => handleReject(term._id)}
                                    className="p-2 bg-red-500 text-white rounded-md"
                                    disabled={loading}
                                >
                                    Rejeter
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ModerationPage;
