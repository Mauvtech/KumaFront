import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTermById, addComment } from '../../services/termService';
import { AxiosError } from 'axios';
import { handleAuthError } from '../../utils/handleAuthError';
import { ErrorResponse } from '../../utils/types';
import { useAuth } from '../../contexts/authContext';
import { Term } from '../../models/termModel';

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
        return <p>Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
            <h2 className="text-2xl font-bold mb-4">{term.term}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-200 text-blue-800 text-xs px-2 rounded-full">
                    {term.grammaticalCategory.name}
                </span>
                <span className="bg-green-200 text-green-800 text-xs px-2 rounded-full">
                    {term.theme.name}
                </span>
                <span className="bg-purple-200 text-purple-800 text-xs px-2 rounded-full">
                    {term.language.name} (Code: {term.language.code})
                </span>
            </div>
            <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                <p className="font-semibold text-gray-800">Definition</p>
                <p>{term.definition}</p>
            </div>
            <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                <p className="font-semibold text-gray-800">Translation</p>
                <p>{term.translation}</p>
            </div>
            <button onClick={() => navigate(-1)} className="mt-4 p-3 bg-gray-400 text-white rounded-lg shadow-[5px_5px_10px_#b3b3b3,-5px_-5px_10px_#ffffff] hover:bg-gray-500 focus:outline-none">
                Retour
            </button>
            {user && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Add comment</h3>
                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-3 rounded-lg shadow-inner bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
                        placeholder="Votre commentaire"
                    ></textarea>
                    <button
                        onClick={handleAddComment}
                        className="p-3 bg-gray-400 text-white rounded-lg shadow-[5px_5px_10px_#b3b3b3,-5px_-5px_10px_#ffffff] hover:bg-gray-500 focus:outline-none"
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
                        <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                            <p className="text-sm text-gray-600"> {comment.author}</p>
                            <p>{comment.text}</p>
                            <p className="text-xs text-gray-600"> {new Date(comment.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No comments. Be the first!</p>
                )}
            </div>
        </div>
    );
};

export default TermDetails;
