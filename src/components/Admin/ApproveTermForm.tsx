import React, { useState, useEffect } from 'react';
import { approveTerm } from '../../services/termService';
import { getAllCategories, approveCategory } from '../../services/categoryService';
import { getAllThemes, approveTheme } from '../../services/themeService';
import { getAllLanguages, approveLanguage } from '../../services/languageService';
import { useNavigate } from 'react-router-dom';

interface Category {
    _id: string;
    name: string;
    isApproved: boolean;
}

interface Theme {
    _id: string;
    name: string;
    isApproved: boolean;
}

interface Language {
    _id: string;
    name: string;
    code: string;
    isApproved: boolean;
}

interface Term {
    _id: string;
    term: string;
    translation: string;
    definition: string;
    grammaticalCategory: string | Category;
    theme: string | Theme;
    language: string | Language;
    languageCode: string;
    status: string;
}

interface ApproveTermFormProps {
    term: Term;
    onCancel: () => void;
}

const ApproveTermForm: React.FC<ApproveTermFormProps> = ({ term, onCancel }) => {
    const [updatedTerm, setUpdatedTerm] = useState<Term>({ ...term });
    const [newCategory, setNewCategory] = useState<string>('');
    const [newTheme, setNewTheme] = useState<string>('');
    const [newLanguage, setNewLanguage] = useState<{ name: string, code: string }>({ name: '', code: '' });
    const [categories, setCategories] = useState<Category[]>([]);
    const [themeOptions, setThemeOptions] = useState<Theme[]>([]);
    const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
    const [approveData, setApproveData] = useState<{ term: string; translation: string; definition: string; grammaticalCategory: string; theme: string; language: string; languageCode: string; }>({ term: '', translation: '', definition: '', grammaticalCategory: '', theme: '', language: '', languageCode: '' });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoriesThemesLanguages = async () => {
            try {
                const categoriesData = await getAllCategories(navigate);
                const themesData = await getAllThemes(navigate);
                const languagesData = await getAllLanguages(navigate);
                setCategories([...categoriesData, { _id: 'other', name: 'Other', isApproved: true }]);
                setThemeOptions([...themesData, { _id: 'other', name: 'Other', isApproved: true }]);
                setLanguageOptions([...languagesData, { _id: 'other', name: 'Other', code: '', isApproved: true }]);
            } catch (error) {
                console.error('Error loading categories, themes, and languages', error);
            }
        };

        fetchCategoriesThemesLanguages();
    }, [navigate]);

    useEffect(() => {
        const updatedApproveData = {
            term: updatedTerm.term,
            translation: updatedTerm.translation.trim(), // Trim to remove extra spaces
            definition: updatedTerm.definition,
            grammaticalCategory: typeof updatedTerm.grammaticalCategory === 'string' ? updatedTerm.grammaticalCategory : (updatedTerm.grammaticalCategory as Category).name,
            theme: typeof updatedTerm.theme === 'string' ? updatedTerm.theme : (updatedTerm.theme as Theme).name,
            language: updatedTerm.language === 'Other' ? newLanguage.name : (updatedTerm.language as Language).name,
            languageCode: updatedTerm.language === 'Other' ? newLanguage.code : updatedTerm.languageCode,
        };
        setApproveData(updatedApproveData);
    }, [updatedTerm, newLanguage]);

    const capitalizeWord = (word: string): string => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    };

    const validateField = (fieldName: string, value: string): string | null => {
        if (!value && fieldName !== 'Language Code') return `${fieldName} ne doit pas être vide.`;
        if (fieldName !== 'Definition' && !/^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(value) && fieldName !== 'Language Code') return `${fieldName} doit commencer par une majuscule suivie de lettres minuscules.`;
        if (fieldName === 'Language Code' && value && !/^[A-Z]+$/.test(value)) return `${fieldName} doit être en majuscules.`;
        if (fieldName !== 'Definition' && /[^a-zA-Z\s]/.test(value) && fieldName !== 'Language Code') return `${fieldName} ne doit pas contenir de caractères spéciaux.`;
        return null;
    };

    const validateApproveData = (data: any): boolean => {
        const errors: string[] = [];
        const fieldsToValidate = [
            { name: 'Term', value: data.term },
            { name: 'Translation', value: data.translation },
            { name: 'Grammatical Category', value: data.grammaticalCategory },
            { name: 'Theme', value: data.theme },
            { name: 'Language', value: data.language },
            { name: 'Language Code', value: data.languageCode },
        ];

        fieldsToValidate.forEach(field => {
            const error = validateField(field.name, field.value);
            if (error) errors.push(error);
        });

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const finalApproveData = {
            ...approveData,
            language: updatedTerm.language === 'Other' ? newLanguage.name : approveData.language,
            languageCode: updatedTerm.language === 'Other' ? newLanguage.code : approveData.languageCode,
        };

        console.log('Final approve data:', finalApproveData)

        if (!validateApproveData(finalApproveData)) {
            setLoading(false);
            return;
        }

        try {
            // Approve new category if necessary
            if ((typeof updatedTerm.grammaticalCategory === 'string' && updatedTerm.grammaticalCategory === 'Other' && newCategory) ||
                (typeof updatedTerm.grammaticalCategory !== 'string' && !(updatedTerm.grammaticalCategory as Category).isApproved)) {
                const categoryId = categories.find(cat => cat.name === newCategory || (typeof updatedTerm.grammaticalCategory !== 'string' && updatedTerm.grammaticalCategory.name === cat.name))?._id;
                if (categoryId) {
                    await approveCategory(categoryId);
                }
            }

            // Approve new theme if necessary
            if ((typeof updatedTerm.theme === 'string' && updatedTerm.theme === 'Other' && newTheme) ||
                (typeof updatedTerm.theme !== 'string' && !(updatedTerm.theme as Theme).isApproved)) {
                const themeId = themeOptions.find(theme => theme.name === newTheme || (typeof updatedTerm.theme !== 'string' && updatedTerm.theme.name === theme.name))?._id;
                if (themeId) {
                    await approveTheme(themeId);
                }
            }

            // Approve new language if necessary
            if ((typeof updatedTerm.language === 'string' && updatedTerm.language === 'Other' && newLanguage.name && newLanguage.code) ||
                (typeof updatedTerm.language !== 'string' && !(updatedTerm.language as Language).isApproved)) {
                const languageId = languageOptions.find(lang => lang.name === newLanguage.name && lang.code === newLanguage.code ||
                    (typeof updatedTerm.language !== 'string' && updatedTerm.language.name === lang.name && updatedTerm.language.code === lang.code))?._id;
                if (languageId) {
                    await approveLanguage(languageId);
                }
            }

            console.log('Approve data:', finalApproveData);

            await approveTerm(term._id, finalApproveData, navigate);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting term', error);
            setError('An error occurred while submitting the term.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const capitalizedValue = (name === 'definition') ? value : capitalizeWord(value);
        setUpdatedTerm((prev: Term) => ({ ...prev, [name]: capitalizedValue }));
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setUpdatedTerm((prev: Term) => ({
            ...prev,
            language: value,
            languageCode: value === 'Other' ? '' : languageOptions.find(lang => lang.name === value)?.code || ''
        }));
        if (value !== 'Other') {
            setNewLanguage({ name: '', code: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 bg-white rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
            <h2 className="text-2xl font-bold mb-4">Approve and Modify Term</h2>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            {validationErrors.length > 0 && (
                <div className="mb-4 text-red-500">
                    <ul>
                        {validationErrors.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mb-4">
                <label className="block mb-2" htmlFor="term">Term</label>
                <input
                    type="text"
                    id="term"
                    name="term"
                    value={updatedTerm.term}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="translation">Translation</label>
                <input
                    type="text"
                    id="translation"
                    name="translation"
                    value={updatedTerm.translation}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="definition">Definition</label>
                <textarea
                    id="definition"
                    name="definition"
                    value={updatedTerm.definition}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="grammaticalCategory">Grammatical Category</label>
                <select
                    id="grammaticalCategory"
                    name="grammaticalCategory"
                    value={typeof updatedTerm.grammaticalCategory === 'string' ? updatedTerm.grammaticalCategory : (updatedTerm.grammaticalCategory as Category).name}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                >
                    {categories.map(category => (
                        <option key={category._id} value={category.name}>{category.name}</option>
                    ))}
                </select>
                {updatedTerm.grammaticalCategory === 'Other' && (
                    <input
                        type="text"
                        placeholder="New Grammatical Category"
                        value={newCategory}
                        onChange={(e) => {
                            const value = capitalizeWord(e.target.value);
                            setNewCategory(value);
                        }}
                        className="w-full p-3 mt-2 bg-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                )}
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="theme">Theme</label>
                <select
                    id="theme"
                    name="theme"
                    value={typeof updatedTerm.theme === 'string' ? updatedTerm.theme : (updatedTerm.theme as Theme).name}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                >
                    {themeOptions.map(theme => (
                        <option key={theme._id} value={theme.name}>{theme.name}</option>
                    ))}
                </select>
                {updatedTerm.theme === 'Other' && (
                    <input
                        type="text"
                        placeholder="New Theme"
                        value={newTheme}
                        onChange={(e) => {
                            const value = capitalizeWord(e.target.value);
                            setNewTheme(value);
                        }}
                        className="w-full p-3 mt-2 bg-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                )}
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="language">Language</label>
                <select
                    id="language"
                    name="language"
                    value={typeof updatedTerm.language === 'string' ? updatedTerm.language : (updatedTerm.language as Language).name}
                    onChange={handleLanguageChange}
                    className="w-full p-3 bg-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                >
                    {languageOptions.map(language => (
                        <option key={language._id} value={language.name}>{language.name}</option>
                    ))}
                </select>
                {updatedTerm.language === 'Other' && (
                    <>
                        <input
                            type="text"
                            placeholder="New Language"
                            value={newLanguage.name}
                            onChange={(e) => {
                                const value = capitalizeWord(e.target.value);
                                setNewLanguage(prev => ({ ...prev, name: value }));
                            }}
                            className="w-full p-3 mt-2 bg-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="New Language Code"
                            value={newLanguage.code}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase(); // language code should be uppercase
                                setNewLanguage(prev => ({ ...prev, code: value }));
                            }}
                            className="w-full p-3 mt-2 bg-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </>
                )}
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="languageCode">Language Code</label>
                <input
                    type="text"
                    id="languageCode"
                    name="languageCode"
                    value={updatedTerm.languageCode}
                    onChange={(e) => {
                        const value = e.target.value.toUpperCase(); // language code should be uppercase
                        setUpdatedTerm((prev: Term) => ({ ...prev, languageCode: value }));
                    }}
                    className="w-full p-3 bg-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                />
            </div>
            <button type="submit" className="w-full p-3 text-white rounded-lg bg-gray-400 shadow-[5px_5px_10px_#b3b3b3,-5px_-5px_10px_#ffffff] hover:bg-gray-500 focus:outline-none" disabled={loading}>
                {loading ? 'Loading...' : 'Approve'}
            </button>
            <button type="button" className="w-full p-3 mt-2 text-white rounded-lg bg-gray-400 shadow-[5px_5px_10px_#b3b3b3,-5px_-5px_10px_#ffffff] hover:bg-gray-500 focus:outline-none" onClick={onCancel}>
                Cancel
            </button>
        </form>
    );
};

export default ApproveTermForm;
