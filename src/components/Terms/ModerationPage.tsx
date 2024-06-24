import React, { useEffect, useState } from 'react';
import { getAllTerms, approveTerm, rejectTerm } from '../../services/termService';
import { getCurrentUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const ModerationPage: React.FC = () => {
    const [terms, setTerms] = useState<any[]>([]);
    const user = getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const data = await getAllTerms(user.token, navigate);
                setTerms(data);
            } catch (error) {
                console.error('Erreur de chargement des termes', error);
            }
        };

        fetchTerms();
    }, [user.token, navigate]);

    const handleApprove = async (termId: string) => {
        try {
            await approveTerm(termId, user.token, navigate);
            // Mettre à jour la liste des termes
            setTerms(terms.filter((term: any) => term._id !== termId));
        } catch (error) {
            console.error('Erreur d\'approbation du terme', error);
        }
    };

    const handleReject = async (termId: string) => {
        try {
            await rejectTerm(termId, user.token, navigate);
            // Mettre à jour la liste des termes
            setTerms(terms.filter((term: any) => term._id !== termId));
        } catch (error) {
            console.error('Erreur de rejet du terme', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Modération des Termes</h2>
            <ul>
                {terms.map((term: any) => (
                    <li key={term._id} className="mb-4">
                        <h3 className="text-xl">{term.term}</h3>
                        <p>{term.definition}</p>
                        <div>
                            <button
                                onClick={() => handleApprove(term._id)}
                                className="mr-2 p-2 bg-green-500 text-white rounded-md"
                            >
                                Approuver
                            </button>
                            <button
                                onClick={() => handleReject(term._id)}
                                className="p-2 bg-red-500 text-white rounded-md"
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

export default ModerationPage;
