import React, {useCallback, useEffect, useState} from "react";
import {downvoteTerm, upvoteTerm,} from "../../services/termService/termService";
import {useAuth} from "../../contexts/authContext";
import {useNavigate} from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TermItem from "../Terms/TermItem";
import {getBookmarks, unbookmarkTerm} from "../../services/termService/bookmarkService";

const BookmarksPage: React.FC = () => {
    const [bookmarkedTerms, setBookmarkedTerms] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const {user} = useAuth();
    const navigate = useNavigate();
    const termsPerPage: number = 9;

    const fetchBookmarks = useCallback(
        async (page: number) => {
            setLoading(true);
            try {
                const data = await getBookmarks(
                    page.toString(),
                    termsPerPage.toString()
                );
                setBookmarkedTerms(data.bookmarks);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Erreur de chargement des bookmarks", error);
            } finally {
                setLoading(false);
            }
        },
        [termsPerPage]
    );

    useEffect(() => {
        if (user) {
            fetchBookmarks(currentPage);
        } else {
            navigate("/login");
        }
    }, [user, currentPage, fetchBookmarks, navigate]);

    const handleUpvote = async (id: string) => {
        try {
            await upvoteTerm(id);
            setBookmarkedTerms((prevTerms) =>
                prevTerms.map((term) => {
                    if (term._id === id) {
                        const isUpvoted = term.upvotedBy.includes(user!._id);
                        const upvotedBy = isUpvoted
                            ? term.upvotedBy.filter((userId: string) => userId !== user!._id)
                            : [...term.upvotedBy, user!._id];
                        const downvotedBy = term.downvotedBy.filter(
                            (userId: string) => userId !== user!._id
                        );
                        return {...term, upvotedBy, downvotedBy};
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error("Erreur lors de l'upvote", error);
        }
    };

    const handleDownvote = async (id: string) => {
        try {
            await downvoteTerm(id);
            setBookmarkedTerms((prevTerms) =>
                prevTerms.map((term) => {
                    if (term._id === id) {
                        const isDownvoted = term.downvotedBy.includes(user!._id);
                        const downvotedBy = isDownvoted
                            ? term.downvotedBy.filter((userId: string) => userId !== user!._id)
                            : [...term.downvotedBy, user!._id];
                        const upvotedBy = term.upvotedBy.filter(
                            (userId: string) => userId !== user!._id
                        );
                        return {...term, upvotedBy, downvotedBy};
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error("Erreur lors de l'downvote", error);
        }
    };

    const handleUnbookmark = async (id: string) => {
        try {
            await unbookmarkTerm(id);
            setBookmarkedTerms((prevTerms) =>
                prevTerms.filter((term) => term._id !== id)
            );
        } catch (error) {
            console.error("Erreur lors de l'unbookmark", error);
        }
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-10 flex flex-col justify-center items-center w-full">
            <div className="mt-10 w-full px-4 md:px-0 max-w-screen-xl">
                <h3 className="text-2xl font-bold mb-4 text-center text-text">
                    Bookmarked Terms
                </h3>
                {loading ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({length: termsPerPage}).map((_, index) => (
                            <li
                                key={index}
                                className="flex flex-col justify-between mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic"
                            >
                                <Skeleton height={30} width="80%"/>
                                <Skeleton height={20} width="60%"/>
                                <Skeleton height={20} width="100%"/>
                                <Skeleton height={20} width="90%"/>
                                <div className="mt-2">
                                    <Skeleton height={20} width="30%"/>
                                    <Skeleton height={20} width="40%"/>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : bookmarkedTerms.length === 0 ? (
                    <p className="text-center text-text">No bookmarks found.</p>
                ) : (
                    <ul className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bookmarkedTerms.map((term) => (
                            <TermItem
                                isFeed={false}
                                key={term._id}
                                term={term}
                                user={user}
                                handleUpvote={handleUpvote}
                                handleDownvote={handleDownvote}
                                handleBookmark={() => {
                                }}
                                handleUnbookmark={handleUnbookmark}
                            />
                        ))}
                    </ul>
                )}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />
            </div>
        </div>
    );
};

const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    paginate: (pageNumber: number) => void;
}> = ({currentPage, totalPages, paginate}) => {
    const pageNumbers = Array.from({length: totalPages}, (_, i) => i + 1);

    return (
        <nav className="mt-4">
            <ul className="inline-flex -space-x-px">
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className={`px-3 py-2 leading-tight text-text bg-backgroundHover border border-background hover:bg-background focus:outline-none transition duration-200 rounded-lg shadow-lg ${currentPage === number ? "bg-primary text-white" : ""
                            }`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BookmarksPage;
