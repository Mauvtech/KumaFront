import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {addComment, getTermById} from '../../services/term/termService';
import {useAuth} from '../../contexts/authContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {TermForUser} from "../../services/term/termModel";

function useComments(id: string) {
    return {
        data: [
            {
                id: '1',
                text: 'This is a comment',
                createdAt: new Date(),
                author: {
                    id: '1',
                    username: 'User1',
                },
            }
        ]
    }
}

const TermDetails: React.FC = () => {
    const {id} = useParams<{
        id: string
    }>();


    const [termForUser, setTermForUser] = useState<TermForUser | null>(null);
    const [commentText, setCommentText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [termLoading, setTermLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTerm = async () => {
            if (id) {
                const data = await getTermById(id);
                setTermForUser(data);
                setTermLoading(false);
            }
        };

        fetchTerm();
    }, [id]);


    const {data: fetchedComments} = useComments(id!!);


    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await addComment(id!, {text: commentText, createdAt: new Date()});
            setCommentText('');
            const updatedTerm = await getTermById(id!);
            setTermForUser(updatedTerm);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du commentaire', error);
            setError('Une erreur est survenue lors de l\'ajout du commentaire.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCommentClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            handleAddComment();
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-background rounded-lg shadow-neumorphic">
            {termLoading ? (
                <div>
                    <Skeleton height={32} width="60%" className="mb-4"/>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Skeleton width={100} height={20} className="rounded-full"/>
                        <Skeleton width={100} height={20} className="rounded-full"/>
                        <Skeleton width={100} height={20} className="rounded-full"/>
                    </div>
                    <div className="mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic">
                        <Skeleton height={20}/>
                        <Skeleton height={20} width="80%"/>
                    </div>
                    <div className="mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic">
                        <Skeleton height={20}/>
                        <Skeleton height={20} width="80%"/>
                    </div>
                    <Skeleton height={40} width="30%"/>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-4 text-text">{termForUser?.term.term}</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-primaryLight text-primary text-xs px-2 rounded-full">
                            {termForUser?.term.grammaticalCategory.name}
                        </span>
                        <span className="bg-secondaryLight text-secondary text-xs px-2 rounded-full">
                            {termForUser?.term.tags[0].name}
                        </span>
                        <span className="bg-accentLight text-accent text-xs px-2 rounded-full">
                            {termForUser?.term.language.name} (Code: {termForUser?.term.language.code})
                        </span>
                    </div>
                    <div className="mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic">
                        <p className="font-semibold text-text">Definition</p>
                        <p>{termForUser?.term.definition}</p>
                    </div>
                    <div className="mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic">
                        <p className="font-semibold text-text">Translation</p>
                        <p>{termForUser?.term.translation}</p>
                    </div>
                    <button onClick={() => navigate(-1)}
                            className="mt-4 p-3 bg-primary text-white rounded-lg shadow-neumorphic hover:bg-primaryLight focus:outline-none">
                        Retour
                    </button>
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4 text-text">Add comment</h3>
                        {error && <div className="mb-4 text-error">{error}</div>}
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full p-3 rounded-lg shadow-inner bg-backgroundHover focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                            placeholder="Votre commentaire"
                        ></textarea>
                        <button
                            onClick={handleAddCommentClick}
                            className="p-3 bg-primary text-white rounded-lg shadow-neumorphic hover:bg-primaryLight focus:outline-none"
                            disabled={loading}
                        >
                            {loading ? 'Chargement...' : 'Ajouter Commentaire'}
                        </button>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4 text-text">Commentaires</h3>
                        {fetchedComments && fetchedComments.length > 0 ? (
                            fetchedComments.map((comment, index) => (
                                <div key={index} className="mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic">
                                    <p className="text-sm text-secondary">{comment.author.username}</p>
                                    <p>{comment.text}</p>
                                    <p className="text-xs text-text">{comment.createdAt.toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-text">No comments. Be the first!</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default TermDetails;
