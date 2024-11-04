import React from 'react';
import {usePaginatedApprovedTerms} from "../../services/term/termService";

export default function ApprovedTermsPage() {
    const {data: approvedTerms} = usePaginatedApprovedTerms({page: {number: 1, size: 50}, filter: {}});

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Termes approuvés</h2>
            <ul>
                {approvedTerms?.content.map((term: any) => (
                    <li key={term._id}
                        className="mb-4 p-4 border border-gray-200 rounded-md transition transform hover:scale-105">
                        <h3 className="text-xl font-bold">{term.term}</h3>
                        <p>{term.definition}</p>
                        <div className="mt-2">
                            <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 rounded-full">
                                {term.grammaticalCategory}
                            </span>
                            <span className="inline-block bg-green-200 text-green-800 text-xs px-2 rounded-full">
                                {term.language?.name} (Code: {term.language?.code})
                            </span>
                            {term.themes.map((theme: string) => (
                                <span key={theme}
                                      className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 rounded-full mr-2">
                                    {theme}
                                </span>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};