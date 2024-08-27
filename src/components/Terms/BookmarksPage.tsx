import React, {useState} from "react";
import {useAuth} from "../../contexts/authContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TermItem from "../Terms/TermItem";
import Pagination from "./Pagination";

const termsPerPage: number = 9;

export default function BookmarksPage() {
    const [bookmarkedTerms, setBookmarkedTerms] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const {user} = useAuth();

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
                                termForUser={term}
                                key={term.id}
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
