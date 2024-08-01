import React from 'react';

interface PaginationProps {
    termsPerPage: number;
    totalTerms: number;
    paginate: (pageNumber: number) => void;
    currentPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({ termsPerPage, totalTerms, paginate, currentPage }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalTerms / termsPerPage);
    const maxPagesToShow = 5;

    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
                for (let i = 1; i < maxPagesToShow; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage > totalPages - Math.floor(maxPagesToShow / 2)) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - Math.floor(maxPagesToShow / 2) + 1; i <= currentPage + Math.floor(maxPagesToShow / 2) - 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <nav className="mt-4">
            <ul className="inline-flex -space-x-px">
                <li>
                    <button
                        onClick={() => paginate(Math.max(currentPage - 1, 1))}
                        className="px-3 py-2 leading-tight text-text bg-background border border-gray-300 hover:bg-gray-200 hover:text-gray-700 rounded-lg shadow-md"
                        disabled={currentPage === 1}
                    >
                        &laquo;
                    </button>
                </li>
                {getPageNumbers().map((number, index) => (
                    <li key={index}>
                        {typeof number === 'number' ? (
                            <button
                                onClick={() => paginate(number)}
                                className={`px-3 py-2 leading-tight text-text bg-background border border-gray-300 hover:bg-gray-200 hover:text-gray-700 rounded-lg shadow-md ${currentPage === number ? 'bg-gray-300' : ''}`}
                            >
                                {number}
                            </button>
                        ) : (
                            <span className="px-3 py-2 leading-tight text-text bg-background border border-gray-300 rounded-lg shadow-md flex items-center justify-center">
                                {number}
                            </span>
                        )}
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                        className="px-3 py-2 leading-tight text-text bg-background border border-gray-300 hover:bg-gray-200 hover:text-gray-700 rounded-lg shadow-md"
                        disabled={currentPage === totalPages}
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};
