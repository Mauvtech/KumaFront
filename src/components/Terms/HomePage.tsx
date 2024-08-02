import React, { useEffect, useState, useCallback } from "react";
import {
    downvoteTerm,
    getApprovedTerms,
    upvoteTerm,
    bookmarkTerm,
    unbookmarkTerm,
} from "../../services/termService";
import { getCategories } from "../../services/categoryService";
import { getThemes } from "../../services/themeService";
import { getLanguages } from "../../services/languageService";
import { AxiosError } from "axios";
import { handleAuthError } from "../../utils/handleAuthError";
import { ErrorResponse } from "../../utils/types";
import { useAuth } from "../../contexts/authContext";
import { Theme } from "../../models/themeModel";
import { Category } from "../../models/categoryModel";
import { Language } from "../../models/languageModel";
import { Term } from "../../models/termModel";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TermItem from "./TermItem";
import Input from "../Common/Input";
import { Pagination } from "../Common/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import Selector from "../Common/Selector";

function HomePage() {
    const { user } = useAuth();
    const [terms, setTerms] = useState<Term[]>([]);
    const [filteredTerms, setFilteredTerms] = useState<Term[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [themes, setThemes] = useState<Theme[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<string>("");
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(
        parseInt(sessionStorage.getItem("currentPage") || "1")
    );
    const [termsLoading, setTermsLoading] = useState<boolean>(true);
    const [filtersLoading, setFiltersLoading] = useState<boolean>(true);
    const [totalTerms, setTotalTerms] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const termsPerPage: number = 9;

    // State for managing word slideshow
    const [currentWord, setCurrentWord] = useState<string>("LES MOTS");

    // Animation Variants
    const wordVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    // Fetch Data
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
                setTotalPages(data.totalPages);
                if (!currentWord) {
                    setCurrentWord(data.terms[0]?.term || "LES MOTS.");
                }
            }
        } catch (error) {
            handleAuthError(error as AxiosError<ErrorResponse>);
        } finally {
            setTermsLoading(false);
        }
    }, [
        selectedCategory,
        selectedTheme,
        selectedLanguage,
        searchTerm,
        currentPage,
        termsPerPage,
    ]);

    const fetchCategories = useCallback(async () => {
        setFiltersLoading(true);
        try {
            const categoriesData = await getCategories();
            setCategories(
                categoriesData.filter((category: Category) => category.isApproved)
            );
        } catch (error) {
            console.error("Erreur de chargement des catégories", error);
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
            console.error("Erreur de chargement des thèmes", error);
        } finally {
            setFiltersLoading(false);
        }
    }, []);

    const fetchLanguages = useCallback(async () => {
        setFiltersLoading(true);
        try {
            const languagesData = await getLanguages();
            setLanguages(
                languagesData.filter((language: Language) => language.isApproved)
            );
        } catch (error) {
            console.error("Erreur de chargement des langues", error);
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
            const filtered = terms.filter(
                (term: Term) =>
                    (selectedCategory
                        ? term.grammaticalCategory.name === selectedCategory
                        : true) &&
                    (selectedTheme ? term.theme.name === selectedTheme : true) &&
                    (selectedLanguage ? term.language.name === selectedLanguage : true) &&
                    (term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        term.definition.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredTerms(filtered);
        }
    }, [
        terms,
        selectedCategory,
        selectedTheme,
        selectedLanguage,
        searchTerm,
        termsLoading,
    ]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset page number when search term changes
        sessionStorage.setItem("currentPage", "1");
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category === selectedCategory ? "" : category);
        setCurrentPage(1); // Reset page number when category changes
        sessionStorage.setItem("currentPage", "1");
    };

    const handleThemeChange = (theme: string) => {
        setSelectedTheme(theme === selectedTheme ? "" : theme);
        setCurrentPage(1); // Reset page number when theme changes
        sessionStorage.setItem("currentPage", "1");
    };

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language === selectedLanguage ? "" : language);
        setCurrentPage(1); // Reset page number when language changes
        sessionStorage.setItem("currentPage", "1");
    };

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        sessionStorage.setItem("currentPage", pageNumber.toString());
    };

    const handleUpvote = async (id: string) => {
        try {
            await upvoteTerm(id);
            setTerms((prevTerms) =>
                prevTerms.map((term) => {
                    if (term._id === id) {
                        const isUpvoted = term.upvotedBy.includes(user!._id);
                        const upvotedBy = isUpvoted
                            ? term.upvotedBy.filter((userId) => userId !== user!._id)
                            : [...term.upvotedBy, user!._id];
                        const downvotedBy = term.downvotedBy.filter(
                            (userId) => userId !== user!._id
                        );
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
            setTerms((prevTerms) =>
                prevTerms.map((term) => {
                    if (term._id === id) {
                        const isDownvoted = term.downvotedBy.includes(user!._id);
                        const downvotedBy = isDownvoted
                            ? term.downvotedBy.filter((userId) => userId !== user!._id)
                            : [...term.downvotedBy, user!._id];
                        const upvotedBy = term.upvotedBy.filter(
                            (userId) => userId !== user!._id
                        );
                        return { ...term, upvotedBy, downvotedBy };
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error("Erreur lors de l'downvote", error);
        }
    };

    const handleBookmark = async (id: string) => {
        try {
            await bookmarkTerm(id);
            setTerms((prevTerms) =>
                prevTerms.map((term) => {
                    if (term._id === id) {
                        return { ...term, bookmarkedBy: [...term.bookmarkedBy, user!._id] };
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error("Erreur lors de l'bookmark", error);
        }
    };

    const handleUnbookmark = async (id: string) => {
        try {
            await unbookmarkTerm(id);
            setTerms((prevTerms) =>
                prevTerms.map((term) => {
                    if (term._id === id) {
                        return {
                            ...term,
                            bookmarkedBy: term.bookmarkedBy.filter(
                                (userId) => userId !== user!._id
                            ),
                        };
                    }
                    return term;
                })
            );
        } catch (error) {
            console.error("Erreur lors de l'unbookmark", error);
        }
    };

    // Slide show for words with smooth transitions
    useEffect(() => {
        const interval = setInterval(() => {
            if (filteredTerms.length > 0) {
                // Shuffle the filteredTerms array
                const shuffledTerms = [...filteredTerms].sort(() => 0.5 - Math.random());
                const randomIndex = Math.floor(Math.random() * shuffledTerms.length);
                setCurrentWord(shuffledTerms[randomIndex].term);
            }
        }, 3000); // Change word every 3 seconds

        return () => clearInterval(interval);
    }, [filteredTerms]);

    return (
        <div>
            {/* Hero Section */}
            <div
                className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-background via-primaryLight to-secondaryLight text-center"
                style={{ backdropFilter: "blur(20px)" }}
            >
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={currentWord}
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary leading-none"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={wordVariants}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                        {currentWord}
                    </motion.h1>
                </AnimatePresence>
            </div>

            {/* Main Content */}
            <div className="max-w-screen-lg mx-auto mt-10 p-6 bg-background rounded-lg">
                <Input
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Rechercher un terme ou une définition..."
                />

                <div className="flex flex-col sm:flex-row justify-evenly space-y-4 sm:space-y-0 sm:space-x-4 mb-12 mt-8">
                    <div className="relative w-full sm:w-1/3 mb-4 sm:mb-0">
                        <Selector
                            options={categories.map((cat) => cat.name)}
                            selectedOption={selectedCategory}
                            onSelectOption={handleCategoryChange}
                            placeholder="Select Category"
                        />
                    </div>
                    <div className="relative w-full sm:w-1/3 mb-4 sm:mb-0">
                        <Selector
                            options={themes.map((theme) => theme.name)}
                            selectedOption={selectedTheme}
                            onSelectOption={handleThemeChange}
                            placeholder="Select Theme"
                        />
                    </div>
                    <div className="relative w-full sm:w-1/3">
                        <Selector
                            options={languages.map((lang) => lang.name)}
                            selectedOption={selectedLanguage}
                            onSelectOption={handleLanguageChange}
                            placeholder="Select Language"
                        />
                    </div>
                </div>

                {termsLoading ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: termsPerPage }).map((_, index) => (
                            <li
                                key={index}
                                className="flex flex-col justify-between mb-4 p-4 bg-background rounded-lg shadow-neumorphic"
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
                ) : filteredTerms.length === 0 ? (
                    <p className="text-center text-text">No terms found.</p>
                ) : (
                    <ul
                        className={`grid ${filteredTerms.length > 5
                                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 gap-6"
                                : "grid-cols-1"
                            }`}
                    >
                        {filteredTerms.map((term) => (
                            <TermItem
                                isFeed={true}
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
                <Pagination
                    termsPerPage={termsPerPage}
                    totalPages={totalPages}
                    totalTerms={totalTerms}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}

export default HomePage;
