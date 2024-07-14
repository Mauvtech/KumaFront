import React, { useState } from 'react';

interface FilterBarProps {
    categories: string[];
    themes: string[];
    languages: string[];
    onFilterChange: (filters: { category: string; theme: string; language: string }) => void;
}

function FilterBar ({ categories, themes, languages, onFilterChange }:FilterBarProps) {
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
                    <option value="">All categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select
                    value={selectedTheme}
                    onChange={(e) => { setSelectedTheme(e.target.value); handleFilterChange(); }}
                    className="p-2 border border-gray-300 rounded-md"
                >
                    <option value="">All themes</option>
                    {themes.map((theme) => (
                        <option key={theme} value={theme}>{theme}</option>
                    ))}
                </select>
                <select
                    value={selectedLanguage}
                    onChange={(e) => { setSelectedLanguage(e.target.value); handleFilterChange(); }}
                    className="p-2 border border-gray-300 rounded-md"
                >
                    <option value="">All languages</option>
                    {languages.map((language) => (
                        <option key={language} value={language}>{language}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
