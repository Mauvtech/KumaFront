import React, { useEffect, useState, useCallback } from 'react';
import { getApprovedTerms } from '../../services/termService';
import { getCategories } from '../../services/categoryService';
import { getThemes } from '../../services/themeService';
import { getLanguages } from '../../services/languageService';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { handleAuthError } from '../../utils/handleAuthError';
import FilterButtons from '../FilterButtons';

const HomePage: React.FC = () => {
    const [terms, setTerms] = useState<any[]>([]);
    const [filteredTerms, setFilteredTerms] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [themes, setThemes] = useState<string[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<string>('');
    const [languages, setLanguages] = useState<string[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [termsPerPage] = useState(10);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchApprovedTerms = useCallback(async () => {
        try {
            const data = await getApprovedTerms(navigate);
            if (data) {
                setTerms(data);
                setFilteredTerms(data);
                // Extraire les catégories, thèmes et langues uniques des termes
                const uniqueThemes = Array.from(new Set(data.flatMap((term: any) => term.themes))) as string[];
                const uniqueLanguages = Array.from(new Set(data.map((term: any) => term.language?.name))) as string[];
                setThemes(uniqueThemes);
                setLanguages(uniqueLanguages);
            }
        } catch (error) {
            console.error('Erreur de chargement des termes approuvés', error);
            if (error instanceof AxiosError) {
                handleAuthError(error, navigate); // Gérer les erreurs d'authentification
            } else {
                alert('Une erreur inattendue est survenue.');
            }
        }
    }, [user, navigate]);

    const fetchCategories = useCallback(async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData.map((category: any) => category.name));
        } catch (error) {
            console.error('Erreur de chargement des catégories', error);
        }
    }, []);

    const fetchThemes = useCallback(async () => {
        try {
            const themesData = await getThemes();
            setThemes(themesData.map((theme: any) => theme.name));
        } catch (error) {
            console.error('Erreur de chargement des thèmes', error);
        }
    }, []);

    const fetchLanguages = useCallback(async () => {
        try {
            const languagesData = await getLanguages(navigate);
            setLanguages(languagesData.map((language: any) => language.name));
        } catch (error) {
            console.error('Erreur de chargement des langues', error);
        }
    }, [navigate]);

    useEffect(() => {
        fetchApprovedTerms();
        fetchCategories();
        fetchThemes();
        fetchLanguages();
    }, [fetchApprovedTerms, fetchCategories, fetchThemes, fetchLanguages]);

    useEffect(() => {
        const filtered = terms.filter((term: any) =>
            (selectedCategory ? term.grammaticalCategory === selectedCategory : true) &&
            (selectedTheme ? term.themes.includes(selectedTheme) : true) &&
            (selectedLanguage ? term.language?.name === selectedLanguage : true) &&
            (term.term.toLowerCase().includes(searchTerm.toLowerCase()) || term.definition.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredTerms(filtered);
    }, [selectedCategory, selectedTheme, selectedLanguage, searchTerm, terms]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const indexOfLastTerm = currentPage * termsPerPage;
    const indexOfFirstTerm = indexOfLastTerm - termsPerPage;
    const currentTerms = filteredTerms.slice(indexOfFirstTerm, indexOfLastTerm);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="max-w-6xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Liste des Termes Approuvés</h2>
            <input
                type="text"
                placeholder="Rechercher un terme ou une définition..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <FilterButtons
                title="Catégories"
                options={categories}
                selectedOption={selectedCategory}
                onSelectOption={(option) => setSelectedCategory(option === selectedCategory ? '' : option)}
            />
            <FilterButtons
                title="Thèmes"
                options={themes}
                selectedOption={selectedTheme}
                onSelectOption={(option) => setSelectedTheme(option === selectedTheme ? '' : option)}
            />
            <FilterButtons
                title="Langues"
                options={languages}
                selectedOption={selectedLanguage}
                onSelectOption={(option) => setSelectedLanguage(option === selectedLanguage ? '' : option)}
            />
            {terms.length === 0 ? (
                <p className="text-center text-gray-500">Aucun terme approuvé trouvé.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentTerms.map((term) => (
                        <li key={term._id} className="mb-4 p-4 border border-gray-200 rounded-md transition transform hover:scale-105">
                            <h3 className="text-xl font-bold">{term.term}</h3>
                            <p>{term.definition}</p>
                            {term.language && (
                                <p>Langue: {term.language.name} (Code: {term.language.code})</p>
                            )}
                            <div className="mt-2">
                                {term.themes.map((theme: string) => (
                                    <span key={theme} className="inline-block bg-blue-200 text-blue-800 text-xs px-2 rounded-full mr-2">
                                        {theme}
                                    </span>
                                ))}
                                <span className="inline-block bg-green-200 text-green-800 text-xs px-2 rounded-full">
                                    {term.grammaticalCategory}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <Pagination termsPerPage={termsPerPage} totalTerms={filteredTerms.length} paginate={paginate} />
        </div>
    );
};

interface PaginationProps {
    termsPerPage: number;
    totalTerms: number;
    paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ termsPerPage, totalTerms, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalTerms / termsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="mt-4">
            <ul className="inline-flex -space-x-px">
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default HomePage;
