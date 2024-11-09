import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getAuthoredTerms} from "../../services/term/termService";
import Skeleton from "react-loading-skeleton";
import {Pagination} from "../../components/Common/Pagination";
import TermCard from "../../components/Terms/TermCard";

export function UserTerms() {
    const [pagination, setPagination] = useState({page: 1, pageSize: 10});

    const {data: terms, isLoading: termLoading} = useQuery(
        {
            queryKey: ["terms", "authored"],
            queryFn: () => getAuthoredTerms(0, pagination.pageSize),
        }
    )

    console.log(terms)

    if (termLoading) {
        return (
            <div className="mt-10 w-full">
                <h3 className="text-2xl font-bold mb-4 text-center text-text">Authored Terms</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((_, index) => (
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
            </div>
        )
    }


    if (!terms || terms.content.length === 0) {
        return (
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-background rounded-lg shadow-neumorphic">
                <div className="mt-10 w-full">
                    <h3 className="text-2xl font-bold mb-4 text-center text-text">Authored Terms</h3>
                    <p className="text-center text-text">No terms found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-10 w-full">
            <h3 className="text-2xl font-bold mb-4 text-center text-text">Authored Terms</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {terms.content.map(term => (
                    <TermCard
                        isFeed={false}
                        term={term}
                        key={term.id}
                    />
                ))}
            </ul>
            <Pagination
                currentPage={pagination.page}
                totalPages={terms.totalPages}
                paginate={(value) => setPagination({...pagination, page: value})}
            />
        </div>
    )

}