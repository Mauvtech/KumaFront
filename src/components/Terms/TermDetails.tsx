import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTermById, addComment } from '../../services/termService';
import { AxiosError } from 'axios';
import { handleAuthError } from '../../utils/handleAuthError';
import { Term } from './HomePage';
import { ErrorResponse } from '../../utils/types';
import { useAuth } from '../../contexts/authContext';

const TermDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [term, setTerm] = useState<Term | null>(null);
    const [commentText, setCommentText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
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

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await addComment(id!, { text: commentText, createdAt: new Date() }, navigate);
            setCommentText('');
            // Re-fetch the term to update the comments
            const updatedTerm = await getTermById(id!, navigate);
            setTerm(updatedTerm);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du commentaire', error);
            setError('Une erreur est survenue lors de l\'ajout du commentaire.');
        } finally {
            setLoading(false);
        }
    };

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
            {user && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Ajouter un commentaire</h3>
                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        placeholder="Votre commentaire"
                    ></textarea>
                    <button
                        onClick={handleAddComment}
                        className="p-2 bg-blue-500 text-white rounded-md"
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : 'Ajouter Commentaire'}
                    </button>
                </div>
            )}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Commentaires</h3>
                {term.comments && term.comments.length > 0 ? (
                    term.comments.map((comment, index) => (
                        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                            <p className="text-sm text-gray-600">Auteur: {comment.author}</p>
                            <p className="text-sm text-gray-600">Date: {new Date(comment.createdAt).toLocaleDateString()}</p>
                            <p>{comment.text}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Aucun commentaire pour ce terme.</p>
                )}
            </div>
        </div>
    );
};

export default TermDetails;
