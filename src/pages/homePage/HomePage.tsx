import React, {useState} from "react";
import {useInfiniteTerms,} from "../../services/term/termService";
import "react-loading-skeleton/dist/skeleton.css";
import CobeGlobe from "../../components/Common/CobeGlobe";
import HomeDisplayWord from "./HomeDisplayWord";
import ScrollToTopButton from "../../components/scrollButtons/ScrollToTopButton";
import WordStrip from "./WordStrip";
import ScrollDownMouseIcon from "../../components/scrollButtons/ScrollDownMouseIcon";
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

export const DEFAULT_TERM_PER_PAGE: number = 9;


export default function HomePage() {
    const [pageAndFilter, setPageAndFilter] = useState<TermPageAndFilter>({
        page: {number: 0, size: DEFAULT_TERM_PER_PAGE},
        filter: {}
    });

    const setFilter = (filter: TermFilter) => setPageAndFilter({...pageAndFilter, filter});


    const {data: approvedTerms, isLoading: termsLoading, fetchNextPage} = useInfiniteTerms(pageAndFilter.filter)

    const terms = approvedTerms?.pages.map(page => page!!.content).flat()


    if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500
    ) {
        if (!termsLoading) {
            fetchNextPage();
        }
    }


    return (
        <div className="w-full bg-background">
            <div
                className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background via-primaryLight to-secondaryLight text-center relative">
                <CobeGlobe/>
                <HomeDisplayWord terms={terms ?? []}/>

                <ScrollDownMouseIcon/>
            </div>

            <WordStrip terms={terms ?? []}/>

            {/* Main Content */}
            <div className="max-w-screen-lg mx-auto mt-10 p-6 bg-background rounded-lg">
                <WordSearch
                    filters={pageAndFilter.filter}
                    setFilters={setFilter}
                />

                <ApprovedTermsList loading={termsLoading} terms={terms!}/>
            </div>
            <ScrollToTopButton/>
        </div>
    );
}
