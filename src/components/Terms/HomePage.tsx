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
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

interface Category {
    _id: string;
    name: string;
    isApproved: boolean;
}

interface Theme {
    _id: string;
    name: string;
    isApproved: boolean;
}

interface Language {
    _id: string;
    name: string;
    code: string;
    isApproved: boolean;
}

export interface Term {
    _id: string;
    term: string;
    translation: string;
    definition: string;
    grammaticalCategory: Category;
    theme: Theme;
    language: Language;
    status: string;
    comments?: Array<{ author: string; text: string; createdAt: Date }>;
    upvotedBy: string[];
    downvotedBy: string[];
    userVote?: 'upvote' | 'downvote' | null;
}

const HomePage: React.FC = () => {
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
    const termsPerPage: number = 10;
    const navigate = useNavigate();

    const fetchApprovedTerms = useCallback(async () => {
        try {
            const data = await getApprovedTerms(navigate, {
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
            if(data){
                console.log("data",data)
            }
        } catch (error) {
            handleAuthError(error as AxiosError<ErrorResponse>, navigate);
        }
    }, [navigate, selectedCategory, selectedTheme, selectedLanguage, searchTerm, currentPage]);

    const fetchCategories = useCallback(async () => {
        try {
            const categoriesData = await getCategories(navigate);
            setCategories(categoriesData.filter((category: Category) => category.isApproved));
        } catch (error) {
            console.error('Erreur de chargement des catégories', error);
        }
    }, [navigate]);

    const fetchThemes = useCallback(async () => {
        try {
            const themesData = await getThemes(navigate);
            setThemes(themesData.filter((theme: Theme) => theme.isApproved));
        } catch (error) {
            console.error('Erreur de chargement des thèmes', error);
        }
    }, [navigate]);

    const fetchLanguages = useCallback(async () => {
        try {
            const languagesData = await getLanguages(navigate);
            setLanguages(languagesData.filter((language: Language) => language.isApproved));
        } catch (error) {
            console.error('Erreur de chargement des langues', error);
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
            await upvoteTerm(id, navigate);
            fetchApprovedTerms();
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
            />
            <FilterButtons
                title="Themes"
                options={themes.map(theme => theme.name)}
                selectedOption={selectedTheme}
                onSelectOption={(option) => setSelectedTheme(option === selectedTheme ? '' : option)}
            />
            <FilterButtons
                title="Languages"
                options={languages.map(lang => lang.name)}
                selectedOption={selectedLanguage}
                onSelectOption={(option) => setSelectedLanguage(option === selectedLanguage ? '' : option)}
            />
            {filteredTerms && filteredTerms.length === 0 ? (
                <p className="text-center text-gray-500">No terms found.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentTerms.map((term) => {
                        const userVote = user ? (term.upvotedBy.includes(user._id) ? 'upvote' : term.downvotedBy.includes(user._id) ? 'downvote' : null) : null;
                        return (
                            <li key={term._id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] transition-transform transform hover:scale-105">
                                <Link to={`/terms/${term._id}`}>
                                    <h3 className="text-xl font-bold text-gray-800">{term.term}</h3>
                                    <p className="text-gray-600">{term.translation}</p>
                                    <p className="text-gray-800">{term.definition}</p>
                                    {term.language && (
                                        <p className="text-gray-800">Language {term.language.name} (Code {term.language.code})</p>
                                    )}
                                    <div className="mt-2">
                                        <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 rounded-full mr-2">
                                            {term.grammaticalCategory.name}
                                        </span>
                                        <span className="inline-block bg-green-200 text-green-800 text-xs px-2 rounded-full">
                                            {term.theme.name}
                                        </span>
                                    </div>
                                </Link>
                                {user && (
                                    <div className="mt-4 flex justify-between items-center">
                                        <button
                                            onClick={() => handleUpvote(term._id)}
                                            className="text-3xl"
                                            style={{ color: userVote === 'upvote' ? 'green' : 'black' }}
                                        >
                                            {userVote === 'upvote' ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                        </button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
            <Pagination termsPerPage={termsPerPage} totalTerms={terms.length} paginate={paginate} />
        </div>
    );
};

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
