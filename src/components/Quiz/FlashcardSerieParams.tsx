import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';
import { getLanguages } from '../../services/languageService';
import { getThemes } from '../../services/themeService';
import { Category } from '../../models/categoryModel';
import { Language } from '../../models/languageModel';
import { Theme } from '../../models/themeModel';

function FlashcardSerieParams()  {
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
    const [grammaticalCategories, setGrammaticalCategories] = useState<Category[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [themes, setThemes] = useState<Theme[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [selectedTheme, setSelectedTheme] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [categories, langs, thms] = await Promise.all([
                    getCategories(),
                    getLanguages(),
                    getThemes()
                ]);
                setGrammaticalCategories(categories);
                setLanguages(langs);
                setThemes(thms);
            } catch (error) {
                console.error('Error fetching filters', error);
            }
        };

        fetchFilters();
    }, []);

    const handleStartQuiz = () => {
        navigate(`/terms/quiz?questions=${numberOfQuestions}&grammaticalCategory=${selectedCategory}&language=${selectedLanguage}&theme=${selectedTheme}`);
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Set Quiz Parameters</h2>
            <label className="block mb-2 text-lg">Number of Questions</label>
            <input
                type="number"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                className="w-full p-3 bg-gray-200 border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
                min="1"
                max="50"
            />
            <label className="block mb-2 text-lg">Grammatical Category</label>
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 bg-gray-200 border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
            >
                <option value="">All Categories</option>
                {grammaticalCategories.map((category) => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                ))}
            </select>
            <label className="block mb-2 text-lg">Language</label>
            <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 bg-gray-200 border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
            >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                    <option key={lang._id} value={lang.name}>{lang.name}</option>
                ))}
            </select>
            <label className="block mb-2 text-lg">Theme</label>
            <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full p-3 bg-gray-200 border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
            >
                <option value="">All Themes</option>
                {themes.map((theme) => (
                    <option key={theme._id} value={theme.name}>{theme.name}</option>
                ))}
            </select>
            <button
                onClick={handleStartQuiz}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:bg-gray-300 transition-transform transform hover:scale-105 focus:outline-none"
            >
                Start Quiz
            </button>
        </div>
    );
};

export default FlashcardSerieParams;
