import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTermById } from '../../services/termService';
import { AxiosError } from 'axios';
import { handleAuthError } from '../../utils/handleAuthError';
import { Term } from './HomePage';
import { ErrorResponse } from '../../utils/types';

const TermDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [term, setTerm] = useState<Term | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTerm = async () => {
            if (id) {
                try {
                    const data = await getTermById(id, navigate);
                    setTerm(data);
                } catch (error) {
                    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
                }
            }
        };

        fetchTerm();
    }, [id, navigate]);

    if (!term) {
        return <p>Chargement...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">{term.term}</h2>
            <p><strong>Définition: </strong>{term.definition}</p>
            <p><strong>Traduction: </strong>{term.translation}</p>
            <p><strong>Catégorie grammaticale: </strong>{term.grammaticalCategory.name}</p>
            <p><strong>Thème: </strong>{term.theme.name}</p>
            <p><strong>Langue: </strong>{term.language.name} (Code: {term.language.code})</p>
            <p><strong>Status: </strong>{term.status}</p>
            <button onClick={() => navigate(-1)} className="mt-4 p-2 bg-blue-500 text-white rounded-md">
                Retour
            </button>
        </div>
    );
};

export default TermDetails;
