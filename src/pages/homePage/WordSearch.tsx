import Input from "../../components/Common/Input";
import Selector from "../../components/Common/Selector";
import React from "react";

export default function WordSearch({
                                       setSearchTerm,
                                       setCurrentPage,
                                       setTerms,
                                       setAllFetchedTerms,
                                       searchTerm,
                                       categories,
                                       themes,

                                       languages,
                                       selectedCategory,
                                       selectedTheme,
                                       selectedLanguage,
                                       setSelectedCategory,
                                       setSelectedTheme,
                                       setSelectedLanguage,

                                   }: {

    setSearchTerm: (term: string) => void;
    setCurrentPage: (page: number) => void;
    setTerms: (terms: any[]) => void;
    setAllFetchedTerms: (terms: any[]) => void;
    searchTerm: string;
    categories: any[];
    themes: any[];
    languages: any[];
    selectedCategory: string;
    selectedTheme: string;
    selectedLanguage: string;
    setSelectedCategory: (category: string) => void;
    setSelectedTheme: (theme: string) => void;
    setSelectedLanguage: (language: string) => void;
}) {


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset page number when search term changes
        setTerms([]); // Clear current terms
        setAllFetchedTerms([]); // Clear all fetched terms
    };


    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category === selectedCategory ? "" : category);
        setCurrentPage(1); // Reset page number when category changes
        setTerms([]); // Clear current terms
        setAllFetchedTerms([]); // Clear all fetched terms
    };

    const handleThemeChange = (theme: string) => {
        setSelectedTheme(theme === selectedTheme ? "" : theme);
        setCurrentPage(1); // Reset page number when theme changes
        setTerms([]); // Clear current terms
        setAllFetchedTerms([]); // Clear all fetched terms
    };

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language === selectedLanguage ? "" : language);
        setCurrentPage(1); // Reset page number when language changes
        setTerms([]); // Clear current terms
        setAllFetchedTerms([]); // Clear all fetched terms
    };


    return (
        <div className="sm:sticky sm:top-16 bg-background z-10">
            <Input
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Rechercher un terme ou une définition..."
            />

            <div className="flex flex-col sm:flex-row md:justify-evenly sm:space-y-0 sm:space-x-4 mb-12 mt-8">
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
        </div>
    )

}