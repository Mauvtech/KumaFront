import React, { useEffect, useState } from 'react';
import { getApprovedTerms } from '../../services/termService';
import { getCurrentUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { handleAuthError } from '../../utils/handleAuthError';

const ApprovedTermsPage: React.FC = () => {
    const [terms, setTerms] = useState<any[]>([]);
    const user = getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTerms = async () => {
            if (!user || !user.token) {
                navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
                return;
            }

            try {
                const response = await getApprovedTerms(navigate,{});
                setTerms(response?.terms || []);
            } catch (error) {
                console.error('Erreur de chargement des termes approuvés', error);
                if (error instanceof AxiosError) {
                    handleAuthError(error, navigate);
                }
            }
        };

        fetchTerms();
    }, [user.token, navigate]);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Termes approuvés</h2>
            <ul>
                {terms.map((term: any) => (
                    <li key={term._id} className="mb-4 p-4 border border-gray-200 rounded-md transition transform hover:scale-105">
                        <h3 className="text-xl font-bold">{term.term}</h3>
                        <p>{term.definition}</p>
                        <div className="mt-2">
                            <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 rounded-full">
                                {term.grammaticalCategory}
                            </span>
                            <span className="inline-block bg-green-200 text-green-800 text-xs px-2 rounded-full">
                                {term.language?.name} (Code: {term.language?.code})
                            </span>
                            {term.themes.map((theme: string) => (
                                <span key={theme} className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 rounded-full mr-2">
                                    {theme}
                                </span>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ApprovedTermsPage;
