import React, { useEffect, useState } from 'react';
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
    const [categories, setCategories] = useState<{ _id: string, name: string }[]>([]);
    const [themeOptions, setThemeOptions] = useState<{ _id: string, name: string }[]>([]);
    const [languageOptions, setLanguageOptions] = useState<{ _id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await getCategories();
                const themesData = await getThemes();
                const languagesData = await getLanguages(navigate);
                setCategories([...categoriesData, { _id: 'other', name: 'Autre' }]);
                setThemeOptions([...themesData, { _id: 'other', name: 'Autre' }]);
                setLanguageOptions(Array.isArray(languagesData) ? [...languagesData, { _id: 'other', name: 'Autre' }] : []);
            } catch (error) {
                console.error('Erreur de chargement des données', error);
                setError('Erreur de chargement des données');
            }
        };

        fetchData();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const termData = {
            term,
            definition,
            grammaticalCategory: grammaticalCategory === 'Autre' ? grammaticalCategory : grammaticalCategory,
            theme: theme === 'Autre' ? theme : theme,
            language: language === 'Autre' ? language : language,
            languageCode: language === 'Autre' ? languageCode : languageCode,
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
        setGrammaticalCategory(e.target.value);
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(e.target.value);
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value);
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
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="definition">Définition</label>
                <textarea
                    id="definition"
                    value={definition}
                    onChange={(e) => setDefinition(e.target.value)}
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
                        value={grammaticalCategory}
                        onChange={(e) => setGrammaticalCategory(e.target.value)}
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
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
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
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Code de la nouvelle langue"
                            value={languageCode}
                            onChange={(e) => setLanguageCode(e.target.value)}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                        />
                    </>
                )}
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md" disabled={loading}>
                {loading ? 'Chargement...' : termId ? 'Modifier' : 'Ajouter'}
            </button>
            <div className="mt-4">
                <h3 className="text-xl font-bold">Données du formulaire:</h3>
                <pre>{JSON.stringify({ term, definition, grammaticalCategory, theme, language, languageCode }, null, 2)}</pre>
            </div>
        </form>
    );
};

export default TermForm;
