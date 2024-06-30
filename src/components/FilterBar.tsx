import React, { useState } from 'react';

interface FilterBarProps {
    categories: string[];
    themes: string[];
    languages: string[];
    onFilterChange: (filters: { category: string; theme: string; language: string }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, themes, languages, onFilterChange }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const handleFilterChange = () => {
        onFilterChange({
            category: selectedCategory,
            theme: selectedTheme,
            language: selectedLanguage,
        });
    };

    return (
        <div className="mb-4">
            <div className="flex space-x-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); handleFilterChange(); }}
                    className="p-2 border border-gray-300 rounded-md"
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select
                    value={selectedTheme}
                    onChange={(e) => { setSelectedTheme(e.target.value); handleFilterChange(); }}
                    className="p-2 border border-gray-300 rounded-md"
                >
                    <option value="">Tous les thèmes</option>
                    {themes.map((theme) => (
                        <option key={theme} value={theme}>{theme}</option>
                    ))}
                </select>
                <select
                    value={selectedLanguage}
                    onChange={(e) => { setSelectedLanguage(e.target.value); handleFilterChange(); }}
                    className="p-2 border border-gray-300 rounded-md"
                >
                    <option value="">Toutes les langues</option>
                    {languages.map((language) => (
                        <option key={language} value={language}>{language}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
