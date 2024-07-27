import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserApprovedTerms } from '../../services/termService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import TermItem from '../Terms/TermItem';

interface UserProfilePageParams extends Record<string, string | undefined> {
    username: string;
}

const UserProfilePage: React.FC = () => {
    const { username } = useParams<UserProfilePageParams>();
    const [approvedTerms, setApprovedTerms] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const navigate = useNavigate();
    const termsPerPage: number = 10;

    const fetchApprovedTerms = useCallback(async (username: string, page: number) => {
        setLoading(true);
        try {
            const data = await getUserApprovedTerms(username, page.toString(), termsPerPage.toString());
            setApprovedTerms(data.terms);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Erreur de chargement des termes approuvés de l\'utilisateur', error);
        } finally {
            setLoading(false);
        }
    }, [termsPerPage]);

    useEffect(() => {
        if (username) {
            fetchApprovedTerms(username, currentPage);
        } else {
            navigate('/');
        }
    }, [username, currentPage, fetchApprovedTerms, navigate]);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="max-w-7xl mx-auto mt-10 p-6 flex flex-col bg-gray-200 justify-center items-center rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff]">
            <div className="mt-10 w-full">
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Approved Terms by {username}</h3>
                {loading ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                ) : approvedTerms.length === 0 ? (
                    <p className="text-center text-gray-500">No terms found.</p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {approvedTerms.map(term => (
                            <TermItem
                                key={term._id}
                                term={term}
                                user={null} // Passer null car ce n'est pas le profil de l'utilisateur connecté
                                handleUpvote={() => { }} // Vous pouvez gérer les upvotes si nécessaire
                                handleDownvote={() => { }} // Vous pouvez gérer les downvotes si nécessaire
                                handleBookmark={() => { }} // Vous pouvez gérer les bookmarks si nécessaire
                                handleUnbookmark={() => { }} // Vous pouvez gérer les unbookmarks si nécessaire
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

export default UserProfilePage;
