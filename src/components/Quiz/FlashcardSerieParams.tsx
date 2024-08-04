import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/categoryService";
import { getLanguages } from "../../services/languageService";
import { getThemes } from "../../services/themeService";
import { Category } from "../../models/categoryModel";
import { Language } from "../../models/languageModel";
import { Theme } from "../../models/themeModel";
import { motion } from "framer-motion";
import Selector from "../Common/Selector"; // Import your custom Selector component

const FlashcardSerieParams: React.FC = () => {
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
    const [grammaticalCategories, setGrammaticalCategories] = useState<Category[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [themes, setThemes] = useState<Theme[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
    const [selectedLanguage, setSelectedLanguage] = useState<string>("All Languages");
    const [selectedTheme, setSelectedTheme] = useState<string>("All Themes");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [categories, langs, thms] = await Promise.all([
                    getCategories(),
                    getLanguages(),
                    getThemes(),
                ]);
                setGrammaticalCategories(categories);
                setLanguages(langs);
                setThemes(thms);
            } catch (error) {
                console.error("Error fetching filters", error);
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
        navigate(
            `/terms/quiz?questions=${numberOfQuestions}&grammaticalCategory=${selectedCategory}&language=${selectedLanguage}&theme=${selectedTheme}`
        );
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
        <motion.div
            className="h-fit mt-10 p-6 flex justify-center items-center flex-col bg-background rounded-lg shadow-neumorphic"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold mb-4 text-text">Set Quiz Parameters</h2>
            <div className="flex flex-col"><label className="block mb-2 text-lg text-text">Number of Questions</label></div>
            <input
                type="number"
                value={numberOfQuestions}
                onChange={handleNumberChange}
                className="w-full p-3 bg-backgroundHover border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primaryLight mb-4"
                min="1"
                max="50"
            />

            <div className="flex items-center gap-4 sm:flex-row flex-col"><div className="flex flex-col"><label className="block text-lg text-text text-center">Grammatical Category</label><Selector
                options={["All Categories", ...grammaticalCategories.map((category) => category.name)]}
                selectedOption={selectedCategory}
                onSelectOption={setSelectedCategory}
                placeholder="Select Category"
            /></div>
            <div className="flex flex-col"><label className="block  text-lg text-text text-center ">Language</label>
            <Selector
                options={["All Languages", ...languages.map((lang) => lang.name)]}
                selectedOption={selectedLanguage}
                onSelectOption={setSelectedLanguage}
                placeholder="Select Language"
            /></div>
            <div className="flex flex-col"><label className="block  text-lg text-text text-center">Theme</label>
            <Selector
                options={["All Themes", ...themes.map((theme) => theme.name)]}
                selectedOption={selectedTheme}
                onSelectOption={setSelectedTheme}
                placeholder="Select Theme"
            /></div></div>

            <motion.button
                onClick={handleStartQuiz}
                className="w-full px-4 py-2 mt-4 bg-backgroundHover text-text rounded-lg shadow-neumorphic hover:bg-background focus:outline-none transition-transform transform hover:scale-105"
                whileTap={{ scale: 0.95 }}
            >
                Start Quiz
            </motion.button>
        </motion.div>
    );
};

export default FlashcardSerieParams;
