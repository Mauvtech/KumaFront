import React, { useEffect, useState, useCallback } from 'react';
import { getApprovedTerms, upvoteTerm } from '../../services/termService';
import { getCategories } from '../../services/categoryService';
import { getThemes } from '../../services/themeService';
import { getLanguages } from '../../services/languageService';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { handleAuthError } from '../../utils/handleAuthError';
import FilterButtons from '../FilterButtons';
import { ErrorResponse } from '../../utils/types';
import { useAuth } from '../../contexts/authContext';
import { Theme } from '../../models/themeModel';
import { Category } from '../../models/categoryModel';
import { Language } from '../../models/languageModel';
import { Term } from '../../models/termModel';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const UpvoteIcon: React.FC<{ isUpvoted: boolean }> = ({ isUpvoted }) => (
    isUpvoted ? (
        <svg
            className="w-7 h-7 pointer-events-none text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path
                d="M13.234 3.395c.191.136.358.303.494.493l7.077 9.285a1.06 1.06 0 01-1.167 1.633l-4.277-1.284a1.06 1.06 0 00-1.355.866l-.814 5.701a1.06 1.06 0 01-1.05.911h-.281a1.06 1.06 0 01-1.05-.91l-.815-5.702a1.06 1.06 0 00-1.355-.866l-4.276 1.284a1.06 1.06 0 01-1.167-1.633l7.077-9.285a2.121 2.121 0 012.96-.493z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    ) : (
        <svg
            className="w-7 h-7 pointer-events-none text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path
                d="M9.456 4.216l-5.985 7.851c-.456.637-.583 1.402-.371 2.108l.052.155a2.384 2.384 0 002.916 1.443l2.876-.864.578 4.042a2.384 2.384 0 002.36 2.047h.234l.161-.006a2.384 2.384 0 002.2-2.041l.576-4.042 2.877.864a2.384 2.384 0 002.625-3.668L14.63 4.33a3.268 3.268 0 00-5.174-.115zm3.57.613c.16.114.298.253.411.411l5.897 7.736a.884.884 0 01-.973 1.36l-3.563-1.069a.884.884 0 00-1.129.722l-.678 4.75a.884.884 0 01-.875.759h-.234a.884.884 0 01-.875-.76l-.679-4.75a.884.884 0 00-1.128-.72l-3.563 1.068a.884.884 0 01-.973-1.36L10.56 5.24a1.767 1.767 0 012.465-.41z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    )
);

const TermItem: React.FC<{ term: Term; user: any; handleUpvote: (id: string) => void }> = ({ term, user, handleUpvote }) => {
    const userVote = user ? (term.upvotedBy.includes(user._id) ? 'upvote' : term.downvotedBy.includes(user._id) ? 'downvote' : null) : null;

    return (
        <li className="flex flex-col justify-between mb-4 p-4 bg-gray-100 rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] transition-transform transform hover:scale-105">
            <div>
                <Link to={`/terms/${term._id}`}>
                    <h3 className="text-xl font-bold text-gray-800">{term.term}</h3>
                    <p className="text-gray-600">{term.translation}</p>
                    <p className="text-gray-800">{term.definition}</p>
                    {term.language && (
                        <p className="text-gray-800">Language {term.language.name} ({term.language.code})</p>
                    )}
                </Link>
            </div>
            <div>
                <div className="mt-2">
                    <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 rounded-full mr-2">
                        {term.grammaticalCategory.name}
                    </span>
                    <span className="inline-block bg-green-200 text-green-800 text-xs px-2 rounded-full">
                        {term.theme.name}
                    </span>
                </div>
                {user && (
                    <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={() => handleUpvote(term._id)}
                            className={`text-3xl rounded-md hover:bg-green-200 focus:outline-none transition duration-200 ${userVote === 'upvote' ? 'text-green-600' : ''}`}
                        >
                            <UpvoteIcon isUpvoted={userVote === 'upvote'} />
                        </button>
                    </div>
                )}
            </div>
        </li>
    );
};

function HomePage() {
    const { user } = useAuth();
    const [terms, setTerms] = useState<Term[]>([]);
    const [filteredTerms, setFilteredTerms] = useState<Term[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [themes, setThemes] = useState<Theme[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<string>('');
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const termsPerPage: number = 10;
    const navigate = useNavigate();

    const fetchApprovedTerms = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getApprovedTerms( {
                category: selectedCategory,
                theme: selectedTheme,
                language: selectedLanguage,
                searchTerm,
                page: currentPage,
                limit: termsPerPage,
            });
            if (data && data.terms) {
                setTerms(data.terms);
                setFilteredTerms(data.terms);
            }
        } catch (error) {
            handleAuthError(error as AxiosError<ErrorResponse>);
        } finally {
            setLoading(false);
        }
    }, [navigate, selectedCategory, selectedTheme, selectedLanguage, searchTerm, currentPage]);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData.filter((category: Category) => category.isApproved));
        } catch (error) {
            console.error('Erreur de chargement des catégories', error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const fetchThemes = useCallback(async () => {
        setLoading(true);
        try {
            const themesData = await getThemes();
            setThemes(themesData.filter((theme: Theme) => theme.isApproved));
        } catch (error) {
            console.error('Erreur de chargement des thèmes', error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const fetchLanguages = useCallback(async () => {
        setLoading(true);
        try {
            const languagesData = await getLanguages();
            setLanguages(languagesData.filter((language: Language) => language.isApproved));
        } catch (error) {
            console.error('Erreur de chargement des langues', error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchApprovedTerms();
        fetchCategories();
        fetchThemes();
        fetchLanguages();
    }, [fetchApprovedTerms, fetchCategories, fetchThemes, fetchLanguages]);

    useEffect(() => {
        if (terms && terms.length > 0) {
            const filtered = terms.filter((term: Term) =>
                (selectedCategory ? term.grammaticalCategory.name === selectedCategory : true) &&
                (selectedTheme ? term.theme.name === selectedTheme : true) &&
                (selectedLanguage ? term.language.name === selectedLanguage : true) &&
                (term.term.toLowerCase().includes(searchTerm.toLowerCase()) || term.definition.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredTerms(filtered);
        }
    }, [selectedCategory, selectedTheme, selectedLanguage, searchTerm, terms]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const indexOfLastTerm = currentPage * termsPerPage;
    const indexOfFirstTerm = indexOfLastTerm - termsPerPage;
    const currentTerms = filteredTerms.length > 0 ? filteredTerms.slice(indexOfFirstTerm, indexOfLastTerm) : [];

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleUpvote = async (id: string) => {
        try {
            await upvoteTerm(id);
            setTerms(prevTerms =>
                prevTerms.map(term => {
                    if (term._id === id) {
                        const isUpvoted = term.upvotedBy.includes(user!._id);
                        const upvotedBy = isUpvoted
                            ? term.upvotedBy.filter(userId => userId !== user!._id)
                            : [...term.upvotedBy, user!._id];
                        const downvotedBy = term.downvotedBy.filter(userId => userId !== user!._id);
                        return { ...term, upvotedBy, downvotedBy };
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error('Erreur lors de l\'upvote', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-100 shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-700">The Words World</h2>
            <input
                type="text"
                placeholder="Rechercher un terme ou une définition..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 mb-6 bg-gray-200 border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <FilterButtons
                title="Categories"
                options={categories.map(cat => cat.name)}
                selectedOption={selectedCategory}
                onSelectOption={(option) => setSelectedCategory(option === selectedCategory ? '' : option)}
                loading={loading}
            />
            <FilterButtons
                title="Themes"
                options={themes.map(theme => theme.name)}
                selectedOption={selectedTheme}
                onSelectOption={(option) => setSelectedTheme(option === selectedTheme ? '' : option)}
                loading={loading}
            />
            <FilterButtons
                title="Languages"
                options={languages.map(lang => lang.name)}
                selectedOption={selectedLanguage}
                onSelectOption={(option) => setSelectedLanguage(option === selectedLanguage ? '' : option)}
                loading={loading}
            />
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
            ) : filteredTerms.length === 0 ? (
                <p className="text-center text-gray-500">No terms found.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentTerms.map((term) => (
                        <TermItem key={term._id} term={term} user={user} handleUpvote={handleUpvote} />
                    ))}
                </ul>
            )}
            <Pagination termsPerPage={termsPerPage} totalTerms={terms.length} paginate={paginate} />
        </div>
    );
}

interface PaginationProps {
    termsPerPage: number;
    totalTerms: number;
    paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ termsPerPage, totalTerms, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalTerms / termsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="mt-4">
            <ul className="inline-flex -space-x-px">
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className="px-3 py-2 leading-tight text-gray-500 bg-gray-100 border border-gray-300 hover:bg-gray-200 hover:text-gray-700 rounded-lg shadow-lg"
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default HomePage;
