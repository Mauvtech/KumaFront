import React, {useCallback, useEffect, useState} from "react";
import {downvoteTerm, upvoteTerm, usePaginatedApprovedTerms,} from "../../services/termService/termService";
import {getCategories} from "../../services/categoryService";
import {getThemes} from "../../services/themeService";
import {getLanguages} from "../../services/languageService";
import {useAuth} from "../../contexts/authContext";
import {Theme} from "../../models/themeModel";
import {Category} from "../../models/categoryModel";
import {Language} from "../../models/languageModel";
import {Term} from "../../models/termModel";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TermItem from "../../components/Terms/TermItem";
import {AnimatePresence, motion} from "framer-motion";
import CobeGlobe from "../../components/Common/CobeGlobe";
import HomeDisplayWord from "./HomeDisplayWord";
import ScrollToTopButton from "./ScrollToTopButton";
import WordStrip from "./WordStrip";
import ScrollDownMouseIcon from "./ScrollDownMouseIcon";
import WordSearch from "./WordSearch";
import {bookmarkTerm, unbookmarkTerm} from "../../services/termService/bookmarkService";


const termsPerPage: number = 9;


export type HomePageFilters = {
    category?: string;
    theme?: string;
    language?: string;
    searchTerm?: string;
}


export default function HomePage() {
    const {user} = useAuth();
    const [terms, setTerms] = useState<Term[]>([]);

    const [allFetchedTerms, setAllFetchedTerms] = useState<Term[]>([]); // Persistent state for all fetched terms
    const [categories, setCategories] = useState<Category[]>([]);
    const [themes, setThemes] = useState<Theme[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);

    const [filtersLoading, setFiltersLoading] = useState<boolean>(true);
    const [totalTerms, setTotalTerms] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [showScrollDownIcon, setShowScrollDownIcon] = useState<boolean>(true);

    const [filters, setFilters] = useState<HomePageFilters>({})

    // State for managing word slideshow
    const [currentWord, setCurrentWord] = useState<string>("LES MOTS.");

    const termVariants = {
        hidden: {opacity: 0, y: 50},
        visible: {opacity: 1, y: 0, transition: {duration: 0.6}},
    };

    const {data: approvedTerms, isLoading: termsLoading} = usePaginatedApprovedTerms({
        category: filters.category,
        theme: filters.theme,
        language: filters.language,
        searchTerm: filters.searchTerm,
        page: currentPage,
        limit: termsPerPage,
    })

    /*   // Fetch Data
       const fetchApprovedTerms = useCallback(async () => {
           setTermsLoading(true);
           try {
               const data = await getApprovedTerms({
                   category: filters.category,
                   theme: filters.theme,
                   language: filters.language,
                   searchTerm: filters.searchTerm,
                   page: currentPage,
                   limit: termsPerPage,
               });
               if (data && data.terms) {
                   setTerms((prevTerms) => [...prevTerms, ...data.terms]);
                   setAllFetchedTerms((prevTerms) => [...prevTerms, ...data.terms]); // Add fetched terms to persistent state
                   setTotalTerms(data.totalTerms);
                   setHasMore(currentPage < data.totalPages);
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
           filters,
           currentPage,
           termsPerPage,
       ]);*/

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
                        return {...term, upvotedBy, downvotedBy};
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
                        return {...term, upvotedBy, downvotedBy};
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
                        return {...term, bookmarkedBy: [...term.bookmarkedBy, user!._id]};
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
            if (allFetchedTerms.length > 0) {
                // Shuffle the terms array
                const shuffledTerms = [...allFetchedTerms].sort(() => 0.5 - Math.random());
                const randomIndex = Math.floor(Math.random() * shuffledTerms.length);
                setCurrentWord(shuffledTerms[randomIndex].term);
            }
        }, 3000); // Change word every 3 seconds

        return () => clearInterval(interval);
    }, [allFetchedTerms]);

    // Show scroll-to-top button after a certain scroll distance
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setShowScrollButton(scrollPosition > 300);
            setShowScrollDownIcon(scrollPosition < 100);

            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 500
            ) {
                if (hasMore && !termsLoading) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, termsLoading]);


    return (
        <div className="w-full bg-background">
            <div
                className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background via-primaryLight to-secondaryLight text-center relative">
                <CobeGlobe/>
                <HomeDisplayWord currentWord={currentWord}/>
                <AnimatePresence>
                    {showScrollDownIcon && (
                        <ScrollDownMouseIcon/>
                    )}
                </AnimatePresence>
            </div>

            <WordStrip terms={allFetchedTerms}/>


            {/* Main Content */}
            <div className="max-w-screen-lg mx-auto mt-10 p-6 bg-background rounded-lg">
                <WordSearch
                    filters={filters}
                    setFilters={setFilters}
                    setCurrentPage={setCurrentPage}
                    setTerms={setTerms}
                    setAllFetchedTerms={setAllFetchedTerms}
                    categories={categories}
                    themes={themes}
                    languages={languages}
                />

                {termsLoading && currentPage === 1 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-6">
                        {Array.from({length: termsPerPage}).map((_, index) => (
                            <li
                                key={index}
                                className="flex flex-col justify-between mb-4 p-6 bg-background rounded-lg shadow-neumorphic h-[60vh]"
                            >
                                <div className="flex items-center mb-4">
                                    <Skeleton
                                        circle={true}
                                        height={80}
                                        width={80}
                                        className="mr-4"
                                    />
                                    <Skeleton height={30} width="50%"/>
                                </div>
                                <div className="flex-1">
                                    <Skeleton height={35} width="90%" className="mb-2"/>
                                    <Skeleton height={25} width="100%" className="mb-2"/>
                                    <Skeleton height={20} width="95%" className="mb-2"/>
                                    <Skeleton height={20} width="95%"/>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <Skeleton height={25} width="35%"/>
                                    <Skeleton height={50} width="50px" circle={true}/>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : terms.length === 0 && currentPage === 1 ? (
                    <p className="text-center text-text">No terms found.</p>
                ) : (
                    <motion.ul
                        className={`grid ${terms.length > 5
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 gap-6"
                            : "grid-cols-1"
                        }`}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: {transition: {staggerChildren: 0.1}},
                        }}
                    >
                        {terms.map((term) => (
                            <motion.li key={term._id} variants={termVariants}>
                                <TermItem
                                    isFeed={true}
                                    term={term}
                                    user={user}
                                    handleUpvote={handleUpvote}
                                    handleDownvote={handleDownvote}
                                    handleBookmark={handleBookmark}
                                    handleUnbookmark={handleUnbookmark}
                                />
                            </motion.li>
                        ))}
                        {termsLoading && currentPage > 1 && (
                            <li className="flex justify-center">
                                <Skeleton height={35} width="90%"/>
                            </li>
                        )}
                    </motion.ul>
                )}
            </div>
            <AnimatePresence>
                {showScrollButton && <ScrollToTopButton/>}
            </AnimatePresence>
        </div>
    );
}