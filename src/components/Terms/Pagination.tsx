import React from "react";

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       paginate,
                                   }: {
    currentPage: number;
    totalPages: number;
    paginate: (pageNumber: number) => void;
}) {
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
