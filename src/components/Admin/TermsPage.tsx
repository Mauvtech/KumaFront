import React, { useEffect, useState } from 'react';
import { getAllTerms, approveTerm, rejectTerm, updateTerm } from '../../services/termService';
import { getCategories } from '../../services/categoryService';
import { getThemes } from '../../services/themeService';
import { getLanguages } from '../../services/languageService';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import ApproveTermForm from './ApproveTermForm';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Category } from '../../models/categoryModel';
import { Theme } from '../../models/themeModel';
import { Language } from '../../models/languageModel';

interface TermsPageProps {
    setSelectedTerm: (term: any) => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ setSelectedTerm }) => {
    const [terms, setTerms] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [themes, setThemes] = useState<Theme[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [termsLoading, setTermsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [editedData, setEditedData] = useState<any>({});
    const [saving, setSaving] = useState<string | null>(null);

    const fetchTerms = async (page: number) => {
        setTermsLoading(true);
        try {
            const data = await getAllTerms(page);
            if (data) {
                setTerms(data.terms);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error('Erreur de chargement des termes', error);
        } finally {
            setTermsLoading(false);
        }
    };

    const fetchFilters = async () => {
        try {
            const [categoriesData, themesData, languagesData] = await Promise.all([
                getCategories(),
                getThemes(),
                getLanguages(),
            ]);
            setCategories(categoriesData);
            setThemes(themesData);
            setLanguages(languagesData);
        } catch (error) {
            console.error('Erreur de chargement des filtres', error);
        }
    };

    useEffect(() => {
        if (user && !loading) {
            fetchTerms(currentPage);
            fetchFilters();
        }
    }, [user, loading, currentPage]);

    const handleApprove = async (termId: string, approveData: any) => {
        try {
            await approveTerm(termId, approveData);
            setTerms(terms.map(term => term._id === termId ? { ...term, status: 'approved' } : term));
            setSelectedTerm(null);
        } catch (error) {
            console.error('Erreur d\'approbation du terme', error);
        }
    };

    const handleReject = async (termId: string) => {
        try {
            await rejectTerm(termId);
            setTerms(terms.map(term => term._id === termId ? { ...term, status: 'rejected' } : term));
        } catch (error) {
            console.error('Erreur de rejet du terme', error);
        }
    };

    const handleEdit = (termId: string) => {
        setEditMode(termId);
        setEditedData(terms.find(term => term._id === termId));
    };

    const handleSave = async (termId: string) => {
        setSaving(termId);
        try {
            const updatedTerm = { ...editedData };
            setTerms(terms.map(term => term._id === termId ? updatedTerm : term));
            await updateTerm(termId, updatedTerm);
            setEditMode(null);
            setSaving(null);
        } catch (error) {
            console.error('Erreur de mise à jour du terme', error);
            setSaving(null);
        }
    };

    const handleCancel = () => {
        setEditMode(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, field: string) => {
        setEditedData({ ...editedData, [field]: e.target.value });
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-200 rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
            <h2 className="text-2xl font-bold mb-4">Term management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Term</th>
                            <th className="py-2 px-4 border-b text-left">Definition</th>
                            <th className="py-2 px-4 border-b text-left">Grammatical category</th>
                            <th className="py-2 px-4 border-b text-left">Theme</th>
                            <th className="py-2 px-4 border-b text-left">Language</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {termsLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index} className="hover:bg-gray-300 transition-colors duration-300">
                                    <td className="py-2 px-4 border-b"><Skeleton height={20} width={100} /></td>
                                    <td className="py-2 px-4 border-b"><Skeleton height={20} width={200} /></td>
                                    <td className="py-2 px-4 border-b"><Skeleton height={20} width={150} /></td>
                                    <td className="py-2 px-4 border-b"><Skeleton height={20} width={100} /></td>
                                    <td className="py-2 px-4 border-b"><Skeleton height={20} width={100} /></td>
                                    <td className="py-2 px-4 border-b"><Skeleton height={40} width={100} /></td>
                                </tr>
                            ))
                        ) : (
                            terms.map(term => (
                                <tr key={term._id} className="hover:bg-gray-300 transition-colors duration-300">
                                    <td className="py-2 px-4 border-b">
                                        {saving === term._id ? (
                                            <Skeleton height={20} width={100} />
                                        ) : editMode === term._id ? (
                                            <input
                                                type="text"
                                                value={editedData.term}
                                                onChange={(e) => handleInputChange(e, 'term')}
                                                className="w-full bg-gray-100 p-1 rounded"
                                            />
                                        ) : (
                                            <span onClick={() => setSelectedTerm(term)}>{term.term}</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {saving === term._id ? (
                                            <Skeleton height={20} width={200} />
                                        ) : editMode === term._id ? (
                                            <input
                                                type="text"
                                                value={editedData.definition}
                                                onChange={(e) => handleInputChange(e, 'definition')}
                                                className="w-full bg-gray-100 p-1 rounded"
                                            />
                                        ) : (
                                            term.definition
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {saving === term._id ? (
                                            <Skeleton height={20} width={150} />
                                        ) : editMode === term._id ? (
                                            <select
                                                value={editedData.grammaticalCategory}
                                                onChange={(e) => handleInputChange(e, 'grammaticalCategory')}
                                                className="w-full bg-gray-100 p-1 rounded"
                                            >
                                                {categories.map(category => (
                                                    <option key={category._id} value={category._id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            term.grammaticalCategory?.name
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {saving === term._id ? (
                                            <Skeleton height={20} width={100} />
                                        ) : editMode === term._id ? (
                                            <select
                                                value={editedData.theme}
                                                onChange={(e) => handleInputChange(e, 'theme')}
                                                className="w-full bg-gray-100 p-1 rounded"
                                            >
                                                {themes.map(theme => (
                                                    <option key={theme._id} value={theme._id}>
                                                        {theme.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            term.theme?.name
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {saving === term._id ? (
                                            <Skeleton height={20} width={100} />
                                        ) : editMode === term._id ? (
                                            <select
                                                value={editedData.language}
                                                onChange={(e) => handleInputChange(e, 'language')}
                                                className="w-full bg-gray-100 p-1 rounded"
                                            >
                                                {languages.map(language => (
                                                    <option key={language._id} value={language._id}>
                                                        {language.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            term.language?.name
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {saving === term._id ? (
                                            <Skeleton height={40} width={100} />
                                        ) : editMode === term._id ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleSave(term._id)}
                                                    className="bg-green-500 text-white px-2 py-1 rounded-md shadow-[2px_2px_5px_#d1d9e6,-2px_-2px_5px_#ffffff]"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="bg-red-500 text-white px-2 py-1 rounded-md shadow-[2px_2px_5px_#d1d9e6,-2px_-2px_5px_#ffffff]"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(term._id)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded-md shadow-[2px_2px_5px_#d1d9e6,-2px_-2px_5px_#ffffff]"
                                                >
                                                    Modify
                                                </button>
                                                {term.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleReject(term._id)}
                                                        className="bg-red-500 text-white px-2 py-1 rounded-md shadow-[2px_2px_5px_#d1d9e6,-2px_-2px_5px_#ffffff]"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            </div>
        </div>
    );
};

const Pagination: React.FC<{ currentPage: number; totalPages: number; paginate: (pageNumber: number) => void }> = ({ currentPage, totalPages, paginate }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="mt-4">
            <ul className="inline-flex -space-x-px">
                {pageNumbers.map(number => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className={`px-3 py-2 leading-tight text-gray-500 bg-gray-100 border border-gray-300 hover:bg-gray-200 hover:text-gray-700 rounded-lg shadow-lg ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const TermsManagement: React.FC = () => {
    const [selectedTerm, setSelectedTerm] = useState<any>(null);

    return (
        <div>
            {selectedTerm ? (
                <ApproveTermForm term={selectedTerm} onCancel={() => setSelectedTerm(null)} />
            ) : (
                <TermsPage setSelectedTerm={setSelectedTerm} />
            )}
        </div>
    );
};

export default TermsManagement;
