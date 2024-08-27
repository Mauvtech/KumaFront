import React, {useEffect, useState} from "react";
import {useInfiniteTerms,} from "../../services/term/termService";
import "react-loading-skeleton/dist/skeleton.css";
import {AnimatePresence} from "framer-motion";
import CobeGlobe from "../../components/Common/CobeGlobe";
import HomeDisplayWord from "./HomeDisplayWord";
import ScrollToTopButton from "./ScrollToTopButton";
import WordStrip from "./WordStrip";
import ScrollDownMouseIcon from "./ScrollDownMouseIcon";
import WordSearch from "./WordSearch";
import ApprovedTermsList from "./ApprovedTermsList";


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

export const DEFAULT_TERM_PER_PAGE: number = 2;


export default function HomePage() {
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [showScrollDownIcon, setShowScrollDownIcon] = useState<boolean>(true);

    const [pageAndFilter, setPageAndFilter] = useState<TermPageAndFilter>({
        page: {number: 0, size: DEFAULT_TERM_PER_PAGE},
        filter: {}
    });

    const setFilter = (filter: TermFilter) => {
        setPageAndFilter({...pageAndFilter, filter});
    }


    // State for managing word slideshow
    const [currentWord, setCurrentWord] = useState<string>("LES MOTS.");


    const {data: approvedTerms, isLoading: termsLoading, fetchNextPage} = useInfiniteTerms(pageAndFilter.filter)

    const terms = approvedTerms?.pages.map(page => page!!.content).flat()


    // Slide show for words with smooth transitions
    useEffect(() => {
        const interval = setInterval(() => {
            if (terms && terms.length > 0) {
                // Shuffle the terms array
                const shuffledTerms = [...terms].sort(() => 0.5 - Math.random());
                const randomIndex = Math.floor(Math.random() * shuffledTerms.length);
                setCurrentWord(shuffledTerms[randomIndex].term.term);
            }
        }, 3000); // Change word every 3 seconds

        return () => clearInterval(interval);
    }, [approvedTerms, terms]);

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


    if (!terms) return <div>Loading...</div>;


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

            <WordStrip terms={terms ?? []}/>

            {/* Main Content */}
            <div className="max-w-screen-lg mx-auto mt-10 p-6 bg-background rounded-lg">
                <WordSearch
                    filters={pageAndFilter.filter}
                    setFilters={setFilter}

                />

                <ApprovedTermsList loading={termsLoading} terms={terms}/>
            </div>
            <AnimatePresence>
                {showScrollButton && <ScrollToTopButton/>}
            </AnimatePresence>
        </div>
    );
}
