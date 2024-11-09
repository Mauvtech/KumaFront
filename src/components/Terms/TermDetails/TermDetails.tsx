import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {addComment, getTermById} from '../../../services/term/termService';
import {useAuth} from '../../../contexts/authContext';
import 'react-loading-skeleton/dist/skeleton.css';
import useTerms from "../../../services/term/termMutationService";
import {useQuery} from "@tanstack/react-query";
import TermDetailsSkeleton from "./TermDetailsSkeleton";

function useComments(id: string) { // TODO
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

export default function TermDetails() {
    const {id} = useParams<{
        id: string
    }>();


    const [commentText, setCommentText] = useState<string>('');
    const [commentLoading, setCommentLoading] = useState<boolean>(false);
    const {user} = useAuth();
    const navigate = useNavigate();


    const {getById} = useTerms()

    const {data: fetchedTerm, error, isLoading: termLoading} = useQuery({
            queryKey: ['terms', id],
            queryFn: () => getById(id!!)
        }
    );


    const {data: fetchedComments} = useComments(id!!);


    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        setCommentLoading(true);

        try {
            await addComment(id!, {text: commentText, createdAt: new Date()});
            setCommentText('');
            const updatedTerm = await getTermById(id!);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du commentaire', error);
        } finally {
            setCommentLoading(false);
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
                <TermDetailsSkeleton/>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-4 text-text">{fetchedTerm?.term.name}</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-primary-light text-primary text-xs px-2 rounded-full">
                            {fetchedTerm?.term.grammaticalCategory.name}
                        </span>
                        <span className="bg-secondary-light text-secondary text-xs px-2 rounded-full">
                            {fetchedTerm?.term.tags[0]?.name}
                        </span>
                        <span className="bg-accent-light text-accent text-xs px-2 rounded-full">
                            {fetchedTerm?.term.language.name} (Code: {fetchedTerm?.term.language.code})
                        </span>
                    </div>
                    <div className="mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic">
                        <p className="font-semibold text-text">Definition</p>
                        <p>{fetchedTerm?.term.definition}</p>
                    </div>
                    <div className="mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic">
                        <p className="font-semibold text-text">Translation</p>
                        <p>{fetchedTerm?.term.translation}</p>
                    </div>
                    <button onClick={() => navigate(-1)}
                            className="mt-4 p-3 bg-primary text-white rounded-lg shadow-neumorphic hover:bg-primary-light focus:outline-none">
                        Retour
                    </button>
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4 text-text">Add comment</h3>
                        {error && <div className="mb-4 text-error">{error.message}</div>}
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full p-3 rounded-lg shadow-inner bg-backgroundHover focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                            placeholder="Votre commentaire"
                        ></textarea>
                        <button
                            onClick={handleAddCommentClick}
                            className="p-3 bg-primary text-white rounded-lg shadow-neumorphic hover:bg-primary-light focus:outline-none"
                            disabled={commentLoading}
                        >
                            {commentLoading ? 'Chargement...' : 'Ajouter Commentaire'}
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

