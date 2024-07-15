import React, { useEffect, useState, useCallback } from 'react';
import { getUserProfile } from '../../services/userService';
import { bookmarkTerm, downvoteTerm, getBookmarks, unbookmarkTerm, upvoteTerm } from '../../services/termService';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import TermItem from '../Terms/TermItem';

const ProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [bookmarkedTerms, setBookmarkedTerms] = useState<any[]>([]);
    const [bookmarksLoading, setBookmarksLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const { user } = useAuth();
    const navigate = useNavigate();
    const termsPerPage: number = 10;

    const fetchBookmarks = useCallback(async (page: number) => {
        setBookmarksLoading(true);
        try {
            const data = await getBookmarks(page.toString(), termsPerPage.toString());
            setBookmarkedTerms(data.bookmarks);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Erreur de chargement des bookmarks', error);
        } finally {
            setBookmarksLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !user.token) {
                navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
                return;
            }
            try {
                const data = await getUserProfile();
                setUserProfile(data);
            } catch (error) {
                console.error('Erreur de chargement du profil utilisateur', error);
                setError('Erreur de chargement du profil utilisateur.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, navigate]);

    useEffect(() => {
        if (user) {
            fetchBookmarks(currentPage);
        }
    }, [user, currentPage, fetchBookmarks]);

    const handleUpvote = async (id: string) => {
        try {
            await upvoteTerm(id);
            setBookmarkedTerms(prevTerms =>
                prevTerms.map(term => {
                    if (term._id === id) {
                        const isUpvoted = term.upvotedBy.includes(user!._id);
                        const upvotedBy = isUpvoted
                            ? term.upvotedBy.filter((userId: string) => userId !== user!._id)
                            : [...term.upvotedBy, user!._id];
                        const downvotedBy = term.downvotedBy.filter((userId: string) => userId !== user!._id);
                        return { ...term, upvotedBy, downvotedBy };
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error('Erreur lors de l\'upvote', error);
        }
    };

    const handleDownvote = async (id: string) => {
        try {
            await downvoteTerm(id);
            setBookmarkedTerms(prevTerms =>
                prevTerms.map(term => {
                    if (term._id === id) {
                        const isDownvoted = term.downvotedBy.includes(user!._id);
                        const downvotedBy = isDownvoted
                            ? term.downvotedBy.filter((userId: string) => userId !== user!._id)
                            : [...term.downvotedBy, user!._id];
                        const upvotedBy = term.upvotedBy.filter((userId: string) => userId !== user!._id);
                        return { ...term, upvotedBy, downvotedBy };
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error('Erreur lors de l\'downvote', error);
        }
    };

    const handleBookmark = async (id: string) => {
        try {
            await bookmarkTerm(id);
            setBookmarkedTerms(prevTerms =>
                prevTerms.map(term => {
                    if (term._id === id) {
                        return { ...term, bookmarkedBy: [...term.bookmarkedBy, user!._id] };
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error('Erreur lors de l\'bookmark', error);
        }
    };

    const handleUnbookmark = async (id: string) => {
        try {
            await unbookmarkTerm(id);
            setBookmarkedTerms(prevTerms =>
                prevTerms.map(term => {
                    if (term._id === id) {
                        return { ...term, bookmarkedBy: term.bookmarkedBy.filter((userId: string) => userId !== user!._id) };
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error('Erreur lors de l\'unbookmark', error);
        }
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-200 rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff]">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">User Profile</h2>
            <div className="space-y-6">
                <div className="p-4 bg-gray-200 rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff]">
                    <span className="block text-lg font-semibold text-gray-700">Username</span>
                    <span className="block mt-2 text-xl text-gray-900">{userProfile.username}</span>
                </div>
                <div className="p-4 bg-gray-200 rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff]">
                    <span className="block text-lg font-semibold text-gray-700">Role</span>
                    <span className="block mt-2 text-xl text-gray-900">{userProfile.role}</span>
                </div>
                <button
                    onClick={() => navigate('/update-profile')}
                    className="w-full mt-6 py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] hover:bg-gray-400 transform hover:scale-105 transition-transform duration-200"
                >
                    Modify profile
                </button>
            </div>
            <div className="mt-10">
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Bookmarked Terms</h3>
                {bookmarksLoading ? (
                    <ul>
                        {Array.from({ length: termsPerPage }).map((_, index) => (
                            <li key={index} className="flex flex-col justify-between mb-4 p-4 bg-gray-100 rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff]">
                                <Skeleton height={30} width="80%" />
                                <Skeleton height={20} width="60%" />
                                <Skeleton height={20} width="100%" />
                                <Skeleton height={20} width="90%" />
                                <div className="mt-2">
                                    <Skeleton height={20} width="30%" />
                                    <Skeleton height={20} width="40%" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : bookmarkedTerms.length === 0 ? (
                    <p className="text-center text-gray-500">No bookmarks found.</p>
                ) : (
                    <ul>
                        {bookmarkedTerms.map(term => (
                            <TermItem
                                key={term._id}
                                term={term}
                                user={user}
                                handleUpvote={handleUpvote}
                                handleDownvote={handleDownvote}
                                handleBookmark={handleBookmark}
                                handleUnbookmark={handleUnbookmark}
                            />
                        ))}
                    </ul>
                )}
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            </div>
        </div>
    );
};

const Pagination: React.FC<{ currentPage: number; totalPages: number; paginate: (pageNumber: number) => void }> = ({ currentPage, totalPages, paginate }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="mt-4">
            <ul className="inline-flex -space-x-px">
                {pageNumbers.map(number => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className={`px-3 py-2 leading-tight text-gray-500 bg-gray-100 border border-gray-300 hover:bg-gray-200 hover:text-gray-700 rounded-lg shadow-lg ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default ProfilePage;
