import React, { useEffect, useState } from 'react';
import { getPendingTerms, approveTerm, rejectTerm } from '../../services/termService';
import { getCurrentUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { handleAuthError } from '../../utils/handleAuthError';

const PendingTermsPage: React.FC = () => {
    const [terms, setTerms] = useState<any[]>([]);
    const user = getCurrentUser();
    const navigate = useNavigate();
    const [language, setLanguage] = useState('');
    const [languageCode, setLanguageCode] = useState('');
    const [grammaticalCategory, setGrammaticalCategory] = useState('');
    const [theme, setTheme] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTerms = async () => {
            if (!user || !user.token) {
                navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
                return;
            }

            try {
                const response = await getPendingTerms();
                setTerms(response);
            } catch (error) {
                console.error('Erreur de chargement des termes en attente', error);
                if (error instanceof AxiosError) {
                    handleAuthError(error);
                }
            }
        };

        fetchTerms();
    }, [user.token]);

    const handleApprove = async (termId: string) => {
        try {
            setLoading(true);
            const approveData = {
                language,
                languageCode,
                grammaticalCategory,
                theme
            };

            await approveTerm(termId, approveData);
            setTerms(terms.filter((term: any) => term._id !== termId));
        } catch (error) {
            console.error('Erreur d\'approbation du terme', error);
            if (error instanceof AxiosError) {
                handleAuthError(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (termId: string) => {
        try {
            setLoading(true);
            await rejectTerm(termId);
            setTerms(terms.filter((term: any) => term._id !== termId));
        } catch (error) {
            console.error('Erreur de rejet du terme', error);
            if (error instanceof AxiosError) {
                handleAuthError(error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Termes en attente</h2>
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
    );
};

export default PendingTermsPage;
