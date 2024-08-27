import Input from "../../components/Common/Input";
import Selector from "../../components/Common/Selector";
import React from "react";
import {TermFilter} from "./HomePage";
import {useCategories} from "../../services/category/categoryService";
import {useTags} from "../../services/tag/tagService";
import {useLanguages} from "../../services/language/languageService";

export default function WordSearch({
                                       filters,
                                       setFilters,

                                   }: {
    filters: TermFilter,
    setFilters: (filters: TermFilter) => void;

}) {

    const {data: fetchedCategories} = useCategories()

    const {data: fetchedTags} = useTags()

    const {data: fetchedLanguages} = useLanguages()


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({...filters, searchTerm: e.target.value});
    };


    const handleCategoryChange = (category: string) => {
        setFilters({...filters, category});
    };

    const handleThemeChange = (theme: string) => {
        setFilters({...filters, theme});
    };

    const handleLanguageChange = (language: string) => {
        setFilters({...filters, language});
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
                        options={fetchedCategories?.map((cat) => cat.name) ?? []}
                        selectedOption={filters.category ?? ""}
                        onSelectOption={handleCategoryChange}
                        placeholder="Select Category"
                    />
                </div>
                <div className="relative w-full sm:w-1/3 mb-4 sm:mb-0">
                    <Selector
                        options={fetchedTags?.map((theme) => theme.name) ?? []}
                        selectedOption={filters.theme ?? ""}
                        onSelectOption={handleThemeChange}
                        placeholder="Select Theme"
                    />
                </div>
                <div className="relative w-full sm:w-1/3">
                    <Selector
                        options={fetchedLanguages?.map((lang) => lang.name) ?? []}
                        selectedOption={filters.language ?? ""}
                        onSelectOption={handleLanguageChange}
                        placeholder="Select Language"
                    />
                </div>
            </div>
        </div>
    )

}