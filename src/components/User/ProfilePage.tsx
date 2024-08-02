import React, { useEffect, useState, useCallback } from "react";
import { getUserProfile } from "../../services/userService";
import { downvoteTerm, getAuthoredTerms, upvoteTerm } from "../../services/termService";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TermItem from "../Terms/TermItem";
import { Pagination } from "../Common/Pagination";

const ProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [authoredTerms, setAuthoredTerms] = useState<any[]>([]);
    const [termsLoading, setTermsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalTerms, setTotalTerms] = useState<number>(0);
    const { user } = useAuth();
    const navigate = useNavigate();
    const termsPerPage: number = 10;

    const fetchAuthoredTerms = useCallback(
        async (page: number) => {
            setTermsLoading(true);
            try {
                const data = await getAuthoredTerms(page.toString(), termsPerPage.toString());
                setAuthoredTerms(data.terms);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                setTotalTerms(data.totalTerms);
            } catch (error) {
                console.error("Erreur de chargement des termes de l'auteur", error);
            } finally {
                setTermsLoading(false);
            }
        },
        [termsPerPage]
    );

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !user.token) {
                navigate("/login");
                return;
            }
            try {
                const data = await getUserProfile();
                setUserProfile(data);
            } catch (error) {
                console.error("Erreur de chargement du profil utilisateur", error);
                setError("Erreur de chargement du profil utilisateur.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, navigate]);

    useEffect(() => {
        if (user) {
            fetchAuthoredTerms(currentPage);
        }
    }, [user, currentPage, fetchAuthoredTerms]);

    const handleUpvote = async (id: string) => {
        try {
            await upvoteTerm(id);
            setAuthoredTerms((prevTerms) =>
                prevTerms.map((term) => {
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
            console.error("Erreur lors de l'upvote", error);
        }
    };

    const handleDownvote = async (id: string) => {
        try {
            await downvoteTerm(id);
            setAuthoredTerms((prevTerms) =>
                prevTerms.map((term) => {
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
            console.error("Erreur lors de l'downvote", error);
        }
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-background rounded-lg shadow-neumorphic">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {loading ? (
                    <>
                        <Skeleton height={80} width="100%" />
                        <Skeleton height={80} width="100%" />
                        <Skeleton height={50} width="100%" />
                    </>
                ) : (
                    <>
                        <div className="p-4 bg-background w-full text-center rounded-lg shadow-neumorphic">
                            <span className="block text-lg font-semibold text-text">Username</span>
                            <span className="block mt-2 text-xl text-text">{userProfile.username}</span>
                        </div>
                        <div className="p-4 bg-background rounded-lg w-full text-center shadow-neumorphic">
                            <span className="block text-lg font-semibold text-text">Role</span>
                            <span className="block mt-2 text-xl text-text">{userProfile.role}</span>
                        </div>
                        <button
                            onClick={() => navigate("/update-profile")}
                            className="w-full mt-6 py-2 px-4 bg-primary text-white font-semibold rounded-lg shadow-neumorphic hover:bg-primaryLight transform hover:scale-105 transition-transform duration-200 md:col-span-2"
                        >
                            Modify profile
                        </button>
                    </>
                )}
            </div>
            <div className="mt-10 w-full">
                <h3 className="text-2xl font-bold mb-4 text-center text-text">Authored Terms</h3>
                {termsLoading ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: termsPerPage }).map((_, index) => (
                            <li
                                key={index}
                                className="flex flex-col justify-between mb-4 p-4 bg-backgroundHover rounded-lg shadow-neumorphic"
                            >
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
                ) : authoredTerms.length === 0 ? (
                    <p className="text-center text-text">No terms found.</p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {authoredTerms.map((term) => (
                            <TermItem
                                isFeed={false}
                                key={term._id}
                                term={term}
                                user={user}
                                handleUpvote={handleUpvote}
                                handleDownvote={handleDownvote}
                                handleBookmark={() => { }}
                                handleUnbookmark={() => { }}
                            />
                        ))}
                    </ul>
                )}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                    termsPerPage={termsPerPage}
                    totalTerms={totalTerms}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
