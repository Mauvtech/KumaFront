import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';
import { getLanguages } from '../../services/languageService';
import { getThemes } from '../../services/themeService';
import { Category } from '../../models/categoryModel';
import { Language } from '../../models/languageModel';
import { Theme } from '../../models/themeModel';

function FlashcardSerieParams() {
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
        if (numberOfQuestions < 1) {
            setNumberOfQuestions(1);
            return;
        }
        if (numberOfQuestions > 50) {
            setNumberOfQuestions(50);
            return;
        }
        navigate(`/terms/quiz?questions=${numberOfQuestions}&grammaticalCategory=${selectedCategory}&language=${selectedLanguage}&theme=${selectedTheme}`);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value >= 1 && value <= 50) {
            setNumberOfQuestions(value);
        } else if (value < 1) {
            setNumberOfQuestions(1);
        } else {
            setNumberOfQuestions(50);
        }
    };

    return (
        <div className=" h-fit mt-10 p-6 flex justify-center items-center flex-col bg-background rounded-lg shadow-neumorphic">
            <h2 className="text-2xl font-bold mb-4 text-text">Set Quiz Parameters</h2>
            <label className="block mb-2 text-lg text-text">Number of Questions</label>
            <input
                type="number"
                value={numberOfQuestions}
                onChange={handleNumberChange}
                className="w-full p-3 bg-backgroundHover border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primaryLight mb-4"
                min="1"
                max="50"
            />
            <label className="block mb-2 text-lg text-text">Grammatical Category</label>
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 bg-backgroundHover border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primaryLight mb-4"
            >
                <option value="">All Categories</option>
                {grammaticalCategories.map((category) => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                ))}
            </select>
            <label className="block mb-2 text-lg text-text">Language</label>
            <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 bg-backgroundHover border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primaryLight mb-4"
            >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                    <option key={lang._id} value={lang.name}>{lang.name}</option>
                ))}
            </select>
            <label className="block mb-2 text-lg text-text">Theme</label>
            <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full p-3 bg-backgroundHover border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primaryLight mb-4"
            >
                <option value="">All Themes</option>
                {themes.map((theme) => (
                    <option key={theme._id} value={theme.name}>{theme.name}</option>
                ))}
            </select>
            <button
                onClick={handleStartQuiz}
                className="w-full px-4 py-2 bg-backgroundHover text-text rounded-lg shadow-neumorphic hover:bg-background focus:outline-none transition-transform transform hover:scale-105"
            >
                Start Quiz
            </button>
        </div>
    );
}

export default FlashcardSerieParams;
