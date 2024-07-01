import React, { useState, useEffect } from 'react';
import { addTerm, updateTerm } from '../../services/termService';
import { getCategories } from '../../services/categoryService';
import { getThemes } from '../../services/themeService';
import { getLanguages } from '../../services/languageService';
import { useNavigate } from 'react-router-dom';

interface TermFormProps {
    termId?: string;
    initialData?: {
        term: string;
        definition: string;
        grammaticalCategory: string;
        theme: string;
        language: string;
        languageCode: string;
    };
}

const TermForm: React.FC<TermFormProps> = ({ termId, initialData }) => {
    const [term, setTerm] = useState(initialData?.term || '');
    const [definition, setDefinition] = useState(initialData?.definition || '');
    const [grammaticalCategory, setGrammaticalCategory] = useState(initialData?.grammaticalCategory || '');
    const [theme, setTheme] = useState(initialData?.theme || '');
    const [language, setLanguage] = useState(initialData?.language || '');
    const [languageCode, setLanguageCode] = useState(initialData?.languageCode || '');
    const [newCategory, setNewCategory] = useState('');
    const [newTheme, setNewTheme] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [categories, setCategories] = useState<{ _id: string, name: string }[]>([]);
    const [themeOptions, setThemeOptions] = useState<{ _id: string, name: string }[]>([]);
    const [languageOptions, setLanguageOptions] = useState<{ _id: string, name: string, code: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rawValues, setRawValues] = useState({});
    const navigate = useNavigate();

    const updateRawValues = (updatedValues: Partial<typeof rawValues>) => {
        setRawValues((prevValues) => ({
            ...prevValues,
            ...updatedValues,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await getCategories(navigate);
                const themesData = await getThemes(navigate);
                const languagesData = await getLanguages(navigate);
                setCategories([...categoriesData, { _id: 'other', name: 'Autre' }]);
                setThemeOptions([...themesData, { _id: 'other', name: 'Autre' }]);
                setLanguageOptions(Array.isArray(languagesData) ? [...languagesData, { _id: 'other', name: 'Autre', code: '' }] : []);

                // Set initial values based on the first available option
                if (categoriesData.length > 0 && !initialData?.grammaticalCategory) {
                    setGrammaticalCategory(categoriesData[0].name);
                }
                if (themesData.length > 0 && !initialData?.theme) {
                    setTheme(themesData[0].name);
                }
                if (languagesData.length > 0 && !initialData?.language) {
                    setLanguage(languagesData[0].name);
                    setLanguageCode(languagesData[0].code);
                }
            } catch (error) {
                console.error('Erreur de chargement des données', error);
                setError('Erreur de chargement des données');
            }
        };

        fetchData();
    }, [navigate, initialData]);

    useEffect(() => {
        if (categories.length > 0 && !initialData?.grammaticalCategory) {
            setGrammaticalCategory(categories[0].name);
        }
        if (themeOptions.length > 0 && !initialData?.theme) {
            setTheme(themeOptions[0].name);
        }
        if (languageOptions.length > 0 && !initialData?.language) {
            setLanguage(languageOptions[0].name);
            setLanguageCode(languageOptions[0].code);
        }
    }, [categories, themeOptions, languageOptions, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const termData = {
            term,
            definition,
            grammaticalCategory: grammaticalCategory === 'Autre' ? newCategory : grammaticalCategory,
            theme: theme === 'Autre' ? newTheme : theme,
            language: language === 'Autre' ? newLanguage : language,
            languageCode: language === 'Autre' ? languageCode : "",
        };

        console.log("Term Data: ", termData); // Log the term data

        try {
            if (termId) {
                await updateTerm(termId, termData, navigate);
            } else {
                await addTerm(termData, navigate);
            }
            navigate('/');
        } catch (error) {
            console.error('Erreur de soumission du terme', error);
            setError('Une erreur est survenue lors de la soumission du terme.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setGrammaticalCategory(value);
        if (value !== 'Autre') {
            setNewCategory('');
        }
        updateRawValues({ grammaticalCategory: value });
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setTheme(value);
        if (value !== 'Autre') {
            setNewTheme('');
        }
        updateRawValues({ theme: value });
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setLanguage(value);
        if (value !== 'Autre') {
            setNewLanguage('');
            const selectedLanguage = languageOptions.find(lang => lang.name === value);
            setLanguageCode(selectedLanguage ? selectedLanguage.code : '');
            updateRawValues({ language: value, languageCode: selectedLanguage ? selectedLanguage.code : '' });
        } else {
            setLanguageCode('');
            updateRawValues({ language: value, languageCode: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">{termId ? 'Modifier Terme' : 'Ajouter Terme'}</h2>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <div className="mb-4">
                <label className="block mb-2" htmlFor="term">Terme</label>
                <input
                    type="text"
                    id="term"
                    value={term}
                    onChange={(e) => {
                        setTerm(e.target.value);
                        updateRawValues({ term: e.target.value });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="definition">Définition</label>
                <textarea
                    id="definition"
                    value={definition}
                    onChange={(e) => {
                        setDefinition(e.target.value);
                        updateRawValues({ definition: e.target.value });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="grammaticalCategory">Catégorie grammaticale</label>
                <select
                    id="grammaticalCategory"
                    value={grammaticalCategory}
                    onChange={handleCategoryChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                >
                    {categories.map(category => (
                        <option key={category._id} value={category.name}>{category.name}</option>
                    ))}
                </select>
                {grammaticalCategory === 'Autre' && (
                    <input
                        type="text"
                        placeholder="Nouvelle catégorie grammaticale"
                        value={newCategory}
                        onChange={(e) => {
                            setNewCategory(e.target.value);
                            updateRawValues({ newCategory: e.target.value });
                        }}
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    />
                )}
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="theme">Thème</label>
                <select
                    id="theme"
                    value={theme}
                    onChange={handleThemeChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                >
                    {themeOptions.map(theme => (
                        <option key={theme._id} value={theme.name}>{theme.name}</option>
                    ))}
                </select>
                {theme === 'Autre' && (
                    <input
                        type="text"
                        placeholder="Nouveau thème"
                        value={newTheme}
                        onChange={(e) => {
                            setNewTheme(e.target.value);
                            updateRawValues({ newTheme: e.target.value });
                        }}
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    />
                )}
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="language">Langue</label>
                <select
                    id="language"
                    value={language}
                    onChange={handleLanguageChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                >
                    {languageOptions.map(language => (
                        <option key={language._id} value={language.name}>{language.name}</option>
                    ))}
                </select>
                {language === 'Autre' && (
                    <>
                        <input
                            type="text"
                            placeholder="Nouvelle langue"
                            value={newLanguage}
                            onChange={(e) => {
                                setNewLanguage(e.target.value);
                                updateRawValues({ newLanguage: e.target.value });
                            }}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Code de la nouvelle langue"
                            value={languageCode}
                            onChange={(e) => {
                                setLanguageCode(e.target.value);
                                updateRawValues({ languageCode: e.target.value });
                            }}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                        />
                    </>
                )}
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md" disabled={loading}>
                {loading ? 'Chargement...' : termId ? 'Modifier' : 'Ajouter'}
            </button>
            <div className="mt-4">
                <h3 className="text-lg font-bold">Raw Values</h3>
                <pre className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rawValues, null, 2)}</pre>
            </div>
        </form>
    );
};

export default TermForm;
