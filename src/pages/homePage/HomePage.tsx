import React, {useEffect, useState} from "react";
import {useInfiniteTerms,} from "../../services/term/termService";
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
import TermItemSkeleton from "./TermItemSkeleton";


const termsPerPage: number = 2;

export type Page = {
    number: number;
    size: number;
}

export type TermFilter = {
    category?: string;
    theme?: string;
    language?: string;
    searchTerm?: string;
}


export type TermPageAndFilter = {
    page: Page;
    filter: TermFilter;
}


export default function HomePage() {
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [showScrollDownIcon, setShowScrollDownIcon] = useState<boolean>(true);

    const [pageAndFilter, setPageAndFilter] = useState<TermPageAndFilter>({
        page: {number: 0, size: termsPerPage},
        filter: {}
    });

    const setFilter = (filter: TermFilter) => {
        setPageAndFilter({...pageAndFilter, filter});
    }


    // State for managing word slideshow
    const [currentWord, setCurrentWord] = useState<string>("LES MOTS.");

    const termVariants = {
        hidden: {opacity: 0, y: 50},
        visible: {opacity: 1, y: 0, transition: {duration: 0.6}},
    };

    const {data: approvedTerms, isLoading: termsLoading, fetchNextPage} = useInfiniteTerms(pageAndFilter.filter)

    const termes = approvedTerms?.pages.map(page => page!!.content).flat()


    // Slide show for words with smooth transitions
    useEffect(() => {
        const interval = setInterval(() => {
            if (termes && termes.length > 0) {
                // Shuffle the terms array
                const shuffledTerms = [...termes].sort(() => 0.5 - Math.random());
                const randomIndex = Math.floor(Math.random() * shuffledTerms.length);
                setCurrentWord(shuffledTerms[randomIndex].term.term);
            }
        }, 3000); // Change word every 3 seconds

        return () => clearInterval(interval);
    }, [approvedTerms, termes]);

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
                if (!termsLoading) {
                    console.log("fetch next")
                    fetchNextPage();
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [termsLoading, fetchNextPage]);


    if (!termes) return <div>Loading...</div>;


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

            <WordStrip terms={termes ?? []}/>

            {/* Main Content */}
            <div className="max-w-screen-lg mx-auto mt-10 p-6 bg-background rounded-lg">
                <WordSearch
                    filters={pageAndFilter.filter}
                    setFilters={setFilter}

                />

                {approvedTerms && termsLoading && termes?.length === 1 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-6">
                        {Array.from({length: termsPerPage}).map((_, index) => (
                            <TermItemSkeleton key={index}/>
                        ))}
                    </ul>
                ) : approvedTerms!.pages.length === 0 && termes?.length === 1 ? (
                    <p className="text-center text-text">No terms found.</p>
                ) : (
                    <motion.ul
                        className={`grid ${approvedTerms!.pages.length > 5
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 gap-6"
                            : "grid-cols-1"
                        }`}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: {transition: {staggerChildren: 0.1}},
                        }}
                    >
                        {termes?.map((term) => (
                            <motion.li key={term.term.id} variants={termVariants}>
                                <TermItem
                                    isFeed={true}
                                    termForUser={term}
                                />
                            </motion.li>
                        ))}
                        {termsLoading && termes && termes.length > 1 && (
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
