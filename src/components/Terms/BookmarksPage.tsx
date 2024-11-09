import React, {useState} from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TermCard from "./TermCard";
import Pagination from "./Pagination";
import {usePaginatedApprovedTerms} from "../../services/term/termService";
import {DEFAULT_TERM_PER_PAGE, TermPageAndFilter} from "../../pages/homePage/HomePage";

const termsPerPage: number = 9;

export default function BookmarksPage() {
    const [pageAndFilter, setPageAndFilter] = useState<TermPageAndFilter>({
        page: {number: 0, size: DEFAULT_TERM_PER_PAGE},
        filter: {
            bookmarked: true
        }
    });

    const {data, isLoading} = usePaginatedApprovedTerms(pageAndFilter)

    const bookmarkedTerms = data?.content;


    function paginate() {
        setPageAndFilter({
            ...pageAndFilter,
            page: {number: data!!.number + 1, size: DEFAULT_TERM_PER_PAGE},
        });
    }

    return (
        <div className="mt-10 flex flex-col justify-center items-center w-full">
            <div className="mt-10 w-full px-4 md:px-0 max-w-screen-xl">
                <h3 className="text-2xl font-bold mb-4 text-center text-text">
                    Bookmarked Terms
                </h3>
                {isLoading ? (
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
                ) : data && bookmarkedTerms!!.length === 0 ? (
                    <p className="text-center text-text">No bookmarks found.</p>
                ) : (
                    <>
                        <ul className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {bookmarkedTerms?.map((term) => (
                                <TermCard
                                    isFeed={false}
                                    term={term.term}
                                    key={term.term.id}
                                />
                            ))}
                        </ul>
                        <Pagination
                            currentPage={data?.number ?? 0}
                            totalPages={data?.totalPages ?? 0}
                            paginate={paginate}
                        />
                    </>

                )}

            </div>
        </div>
    );
};
