import Input from "../../components/Common/Input";
import Selector from "../../components/Common/Selector";
import React from "react";
import {HomePageFilters} from "./HomePage";

export default function WordSearch({
                                       filters,
                                       setFilters,
                                       setCurrentPage,
                                       setTerms,
                                       setAllFetchedTerms,
                                       categories,
                                       themes,
                                       languages,
                                   }: {
    filters: HomePageFilters,
    setFilters: (filters: HomePageFilters) => void;
    setCurrentPage: (page: number) => void;
    setTerms: (terms: any[]) => void;
    setAllFetchedTerms: (terms: any[]) => void;
    categories: any[];
    themes: any[];
    languages: any[];
}) {


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({...filters, searchTerm: e.target.value});
        setCurrentPage(1); // Reset page number when search term changes
        setTerms([]); // Clear current terms
        setAllFetchedTerms([]); // Clear all fetched terms
    };


    const handleCategoryChange = (category: string) => {
        setFilters({...filters, category});
        setCurrentPage(1); // Reset page number when category changes
        setTerms([]); // Clear current terms
        setAllFetchedTerms([]); // Clear all fetched terms
    };

    const handleThemeChange = (theme: string) => {
        setFilters({...filters, theme});
        setCurrentPage(1); // Reset page number when theme changes
        setTerms([]); // Clear current terms
        setAllFetchedTerms([]); // Clear all fetched terms
    };

    const handleLanguageChange = (language: string) => {
        setFilters({...filters, language});
        setCurrentPage(1); // Reset page number when language changes
        setTerms([]); // Clear current terms
        setAllFetchedTerms([]); // Clear all fetched terms
    };


    return (
        <div className="sm:sticky sm:top-16 bg-background z-10">
            <Input
                value={filters.searchTerm ?? ""}
                onChange={handleSearchChange}
                placeholder="Rechercher un terme ou une définition..."
            />

            <div className="flex flex-col sm:flex-row md:justify-evenly sm:space-y-0 sm:space-x-4 mb-12 mt-8">
                <div className="relative w-full sm:w-1/3 mb-4 sm:mb-0">
                    <Selector
                        options={categories.map((cat) => cat.name)}
                        selectedOption={filters.category ?? ""}
                        onSelectOption={handleCategoryChange}
                        placeholder="Select Category"
                    />
                </div>
                <div className="relative w-full sm:w-1/3 mb-4 sm:mb-0">
                    <Selector
                        options={themes.map((theme) => theme.name)}
                        selectedOption={filters.theme ?? ""}
                        onSelectOption={handleThemeChange}
                        placeholder="Select Theme"
                    />
                </div>
                <div className="relative w-full sm:w-1/3">
                    <Selector
                        options={languages.map((lang) => lang.name)}
                        selectedOption={filters.language ?? ""}
                        onSelectOption={handleLanguageChange}
                        placeholder="Select Language"
                    />
                </div>
            </div>
        </div>
    )

}