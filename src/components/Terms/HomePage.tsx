import React, { useEffect, useState, useCallback } from 'react';
import { downvoteTerm, getApprovedTerms, upvoteTerm, bookmarkTerm, unbookmarkTerm } from '../../services/termService';
import { getCategories } from '../../services/categoryService';
import { getThemes } from '../../services/themeService';
import { getLanguages } from '../../services/languageService';
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
import TermItem from './TermItem';
import Input from '../Common/Input';

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
    const [currentPage, setCurrentPage] = useState<number>(parseInt(sessionStorage.getItem('currentPage') || '1'));
    const [termsLoading, setTermsLoading] = useState<boolean>(true);
    const [filtersLoading, setFiltersLoading] = useState<boolean>(true);
    const [totalTerms, setTotalTerms] = useState<number>(0);
    const termsPerPage: number = 9;

    const fetchApprovedTerms = useCallback(async () => {
        setTermsLoading(true);
        try {
            const data = await getApprovedTerms({
                category: selectedCategory,
                theme: selectedTheme,
                language: selectedLanguage,
                searchTerm,
                page: currentPage,
                limit: termsPerPage,
            });
            if (data && data.terms) {
                setTerms(data.terms);
                setTotalTerms(data.totalTerms);
            }
        } catch (error) {
            handleAuthError(error as AxiosError<ErrorResponse>);
        } finally {
            setTermsLoading(false);
        }
    }, [selectedCategory, selectedTheme, selectedLanguage, searchTerm, currentPage, termsPerPage]);

    const fetchCategories = useCallback(async () => {
        setFiltersLoading(true);
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData.filter((category: Category) => category.isApproved));
        } catch (error) {
            console.error('Erreur de chargement des catégories', error);
        } finally {
            setFiltersLoading(false);
        }
    }, []);

    const fetchThemes = useCallback(async () => {
        setFiltersLoading(true);
        try {
            const themesData = await getThemes();
            setThemes(themesData.filter((theme: Theme) => theme.isApproved));
        } catch (error) {
            console.error('Erreur de chargement des thèmes', error);
        } finally {
            setFiltersLoading(false);
        }
    }, []);

    const fetchLanguages = useCallback(async () => {
        setFiltersLoading(true);
        try {
            const languagesData = await getLanguages();
            setLanguages(languagesData.filter((language: Language) => language.isApproved));
        } catch (error) {
            console.error('Erreur de chargement des langues', error);
        } finally {
            setFiltersLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
        fetchThemes();
        fetchLanguages();
    }, [fetchCategories, fetchThemes, fetchLanguages]);

    useEffect(() => {
        fetchApprovedTerms();
    }, [fetchApprovedTerms]);

    useEffect(() => {
        if (!termsLoading) {
            const filtered = terms.filter((term: Term) =>
                (selectedCategory ? term.grammaticalCategory.name === selectedCategory : true) &&
                (selectedTheme ? term.theme.name === selectedTheme : true) &&
                (selectedLanguage ? term.language.name === selectedLanguage : true) &&
                (term.term.toLowerCase().includes(searchTerm.toLowerCase()) || term.definition.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredTerms(filtered);
        }
    }, [terms, selectedCategory, selectedTheme, selectedLanguage, searchTerm, termsLoading]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset page number when search term changes
        sessionStorage.setItem('currentPage', '1');
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category === selectedCategory ? '' : category);
        setCurrentPage(1); // Reset page number when category changes
        sessionStorage.setItem('currentPage', '1');
    };

    const handleThemeChange = (theme: string) => {
        setSelectedTheme(theme === selectedTheme ? '' : theme);
        setCurrentPage(1); // Reset page number when theme changes
        sessionStorage.setItem('currentPage', '1');
    };

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language === selectedLanguage ? '' : language);
        setCurrentPage(1); // Reset page number when language changes
        sessionStorage.setItem('currentPage', '1');
    };

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        sessionStorage.setItem('currentPage', pageNumber.toString());
    };

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

    const handleDownvote = async (id: string) => {
        try {
            await downvoteTerm(id);
            setTerms(prevTerms =>
                prevTerms.map(term => {
                    if (term._id === id) {
                        const isDownvoted = term.downvotedBy.includes(user!._id);
                        const downvotedBy = isDownvoted
                            ? term.downvotedBy.filter(userId => userId !== user!._id)
                            : [...term.downvotedBy, user!._id];
                        const upvotedBy = term.upvotedBy.filter(userId => userId !== user!._id);
                        return { ...term, upvotedBy, downvotedBy };
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error('Erreur lors de l\'downvote', error);
        }
    };

    const handleBookmark = async (id: string) => {
        try {
            await bookmarkTerm(id);
            setTerms(prevTerms =>
                prevTerms.map(term => {
                    if (term._id === id) {
                        return { ...term, bookmarkedBy: [...term.bookmarkedBy, user!._id] };
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error('Erreur lors de l\'bookmark', error);
        }
    };

    const handleUnbookmark = async (id: string) => {
        try {
            await unbookmarkTerm(id);
            setTerms(prevTerms =>
                prevTerms.map(term => {
                    if (term._id === id) {
                        return { ...term, bookmarkedBy: term.bookmarkedBy.filter(userId => userId !== user!._id) };
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error('Erreur lors de l\'unbookmark', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-background shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-text">The Words World</h2>
            <Input
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Rechercher un terme ou une définition..."
            />
            <FilterButtons
                title="Categories"
                options={categories.map(cat => cat.name)}
                selectedOption={selectedCategory}
                onSelectOption={handleCategoryChange}
                loading={filtersLoading}
            />
            <FilterButtons
                title="Themes"
                options={themes.map(theme => theme.name)}
                selectedOption={selectedTheme}
                onSelectOption={handleThemeChange}
                loading={filtersLoading}
            />
            <FilterButtons
                title="Languages"
                options={languages.map(lang => lang.name)}
                selectedOption={selectedLanguage}
                onSelectOption={handleLanguageChange}
                loading={filtersLoading}
            />
            {termsLoading ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: termsPerPage }).map((_, index) => (
                        <li key={index} className="flex flex-col justify-between mb-4 p-4 bg-background rounded-lg shadow-neumorphic">
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
                <p className="text-center text-text">No terms found.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTerms.map((term) => (
                        <TermItem
                            key={term._id}
                            term={term}
                            user={user}
                            handleUpvote={handleUpvote}
                            handleDownvote={handleDownvote}
                            handleBookmark={handleBookmark}
                            handleUnbookmark={handleUnbookmark}
                        />
                    ))}
                </ul>
            )}
            <Pagination termsPerPage={termsPerPage} totalTerms={totalTerms} paginate={paginate} currentPage={currentPage} />
        </div>
    );
}

interface PaginationProps {
    termsPerPage: number;
    totalTerms: number;
    paginate: (pageNumber: number) => void;
    currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ termsPerPage, totalTerms, paginate, currentPage }) => {
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
                            className={`px-3 py-2 leading-tight text-text bg-background border border-gray-300 hover:bg-gray-200 hover:text-gray-700 rounded-lg shadow-md ${currentPage === number ? 'bg-gray-300' : ''}`}
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
