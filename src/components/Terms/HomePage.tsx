import React, { useEffect, useState } from 'react';
import { getAllTerms } from '../../services/termService';
import { getCurrentUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { handleAuthError } from '../../utils/handleAuthError';
import { AxiosError } from 'axios';

const HomePage: React.FC = () => {
    const [terms, setTerms] = useState<any[]>([]);
    const user = getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenValidity = async () => {
            if (!user || !user.token) {
                navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
                return;
            }

            try {
                const data = await getAllTerms(user.token, navigate);
                if (data) {
                    setTerms(data);
                }
            } catch (error) {
                console.error('Erreur de vérification du token ou de chargement des termes', error);
                if (error instanceof AxiosError) {
                    handleAuthError(error, navigate); // Gérer les erreurs d'authentification
                }
            }
        };

        checkTokenValidity();
    }, [user, navigate]);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Liste des Termes</h2>
            <ul>
                {terms.map((term) => (
                    <li key={term._id} className="mb-4">
                        <h3 className="text-xl">{term.term}</h3>
                        <p>{term.definition}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
