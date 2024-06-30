import React, { useState, useEffect } from 'react';
import { approveTerm } from '../../services/termService';
import { getCategories, addCategory } from '../../services/categoryService';
import { getThemes, addTheme } from '../../services/themeService';
import { getLanguages, addLanguage } from '../../services/languageService';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

interface Category {
    _id: string;
    name: string;
}

interface Theme {
    _id: string;
    name: string;
}

interface Language {
    _id: string;
    name: string;
    code: string;
}

interface Term {
    _id: string;
    term: string;
    definition: string;
    grammaticalCategory: string;
    theme: string;
    language: string;
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
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoriesThemesLanguages = async () => {
            try {
                const categoriesData = await getCategories();
                const themesData = await getThemes();
                const languagesData = await getLanguages(navigate);
                setCategories([...categoriesData, { _id: 'other', name: 'Autre' }]);
                setThemeOptions([...themesData, { _id: 'other', name: 'Autre' }]);
                setLanguageOptions([...languagesData, { _id: 'other', name: 'Autre', code: '' }]);
            } catch (error) {
                console.error('Erreur de chargement des catégories, des thèmes et des langues', error);
            }
        };

        fetchCategoriesThemesLanguages();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const approveData = {
            grammaticalCategory: updatedTerm.grammaticalCategory === 'Autre' ? newCategory : updatedTerm.grammaticalCategory,
            theme: updatedTerm.theme === 'Autre' ? newTheme : updatedTerm.theme,
            language: updatedTerm.language === 'Autre' ? newLanguage.name : updatedTerm.language,
            languageCode: updatedTerm.language === 'Autre' ? newLanguage.code : updatedTerm.languageCode,
        };

        try {
            if (updatedTerm.grammaticalCategory === 'Autre' && newCategory) {
                await addCategory(newCategory);
            }
            if (updatedTerm.theme === 'Autre' && newTheme) {
                await addTheme(newTheme, navigate);
            }
            if (updatedTerm.language === 'Autre' && newLanguage.name) {
                await addLanguage(newLanguage.name, newLanguage.code, navigate);
            }

            await approveTerm(term._id, approveData, navigate);
            navigate('/dashboard');
        } catch (error) {
            console.error('Erreur de soumission du terme', error);
            setError('Une erreur est survenue lors de la soumission du terme.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedTerm((prev: Term) => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Approuver et Modifier Terme</h2>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <div className="mb-4">
                <label className="block mb-2" htmlFor="term">Terme</label>
                <input
                    type="text"
                    id="term"
                    name="term"
                    value={updatedTerm.term}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="definition">Définition</label>
                <textarea
                    id="definition"
                    name="definition"
                    value={updatedTerm.definition}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="grammaticalCategory">Catégorie grammaticale</label>
                <select
                    id="grammaticalCategory"
                    name="grammaticalCategory"
                    value={updatedTerm.grammaticalCategory}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                >
                    {categories.map(category => (
                        <option key={category._id} value={category.name}>{category.name}</option>
                    ))}
                </select>
                {updatedTerm.grammaticalCategory === 'Autre' && (
                    <input
                        type="text"
                        placeholder="Nouvelle catégorie grammaticale"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    />
                )}
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="theme">Thème</label>
                <select
                    id="theme"
                    name="theme"
                    value={updatedTerm.theme}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                >
                    {themeOptions.map(theme => (
                        <option key={theme._id} value={theme.name}>{theme.name}</option>
                    ))}
                </select>
                {updatedTerm.theme === 'Autre' && (
                    <input
                        type="text"
                        placeholder="Nouveau thème"
                        value={newTheme}
                        onChange={(e) => setNewTheme(e.target.value)}
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    />
                )}
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="language">Langue</label>
                <select
                    id="language"
                    name="language"
                    value={updatedTerm.language}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                >
                    {languageOptions.map(language => (
                        <option key={language._id} value={language.name}>{language.name}</option>
                    ))}
                </select>
                {updatedTerm.language === 'Autre' && (
                    <>
                        <input
                            type="text"
                            placeholder="Nouvelle langue"
                            value={newLanguage.name}
                            onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Code de la nouvelle langue"
                            value={newLanguage.code}
                            onChange={(e) => setNewLanguage(prev => ({ ...prev, code: e.target.value }))}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                        />
                    </>
                )}
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md" disabled={loading}>
                {loading ? 'Chargement...' : 'Approuver'}
            </button>
            <button type="button" className="w-full p-2 mt-2 bg-gray-500 text-white rounded-md" onClick={onCancel}>
                Annuler
            </button>
        </form>
    );
};

export default ApproveTermForm;
