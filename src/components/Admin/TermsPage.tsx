import React, { useEffect, useState } from "react";
import {
    getAllTerms,
    approveTerm,
    rejectTerm,
    updateTerm,
} from "../../services/termService";
import { getCategories } from "../../services/categoryService";
import { getThemes } from "../../services/themeService";
import { getLanguages } from "../../services/languageService";
import { useAuth } from "../../contexts/authContext";
import ApproveTermForm from "./ApproveTermForm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Category } from "../../models/categoryModel";
import { Theme } from "../../models/themeModel";
import { Language } from "../../models/languageModel";
import { Pagination } from "../Common/Pagination";
import { motion } from "framer-motion";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

interface TermsPageProps {
    setSelectedTerm: (term: any) => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ setSelectedTerm }) => {
    const [terms, setTerms] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [themes, setThemes] = useState<Theme[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const { user, loading } = useAuth();
    const [termsLoading, setTermsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [editedData, setEditedData] = useState<any>({});
    const [saving, setSaving] = useState<string | null>(null);
    const [totalTerms, setTotalTerms] = useState<number>(0);

    const fetchTerms = async (page: number) => {
        setTermsLoading(true);
        try {
            const data = await getAllTerms(page);
            if (data) {
                setTerms(data.terms);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                setTotalTerms(data.totalTerms);
            }
        } catch (error) {
            console.error("Error loading terms", error);
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
            console.error("Error loading filters", error);
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
            setTerms(
                terms.map((term) =>
                    term._id === termId ? { ...term, status: "approved" } : term
                )
            );
            setSelectedTerm(null);
        } catch (error) {
            console.error("Error approving term", error);
        }
    };

    const handleReject = async (termId: string) => {
        try {
            await rejectTerm(termId);
            setTerms(
                terms.map((term) =>
                    term._id === termId ? { ...term, status: "rejected" } : term
                )
            );
        } catch (error) {
            console.error("Error rejecting term", error);
        }
    };

    const handleEdit = (termId: string) => {
        setEditMode(termId);
        setEditedData(terms.find((term) => term._id === termId));
    };

    const handleSave = async (termId: string) => {
        setSaving(termId);
        try {
            const updatedTerm = { ...editedData };
            setTerms(terms.map((term) => (term._id === termId ? updatedTerm : term)));
            await updateTerm(termId, updatedTerm);
            setEditMode(null);
            setSaving(null);
        } catch (error) {
            console.error("Error updating term", error);
            setSaving(null);
        }
    };

    const handleCancel = () => {
        setEditMode(null);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
        field: string
    ) => {
        setEditedData({ ...editedData, [field]: e.target.value });
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="max-w-6xl mx-auto mt-10 p-4 md:p-6 bg-background rounded-lg shadow-neumorphic overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4 text-text">Term Management</h2>
            <table className="min-w-full bg-background text-sm md:text-base border-collapse">
                <thead>
                    <tr>
                        <th className="py-2 px-2 md:px-4 border-b text-left text-text">
                            Term
                        </th>
                        <th className="py-2 px-2 md:px-4 border-b text-left text-text">
                            Definition
                        </th>
                        <th className="py-2 px-2 md:px-4 border-b text-left text-text hidden md:table-cell">
                            Grammatical Category
                        </th>
                        <th className="py-2 px-2 md:px-4 border-b text-left text-text hidden md:table-cell">
                            Theme
                        </th>
                        <th className="py-2 px-2 md:px-4 border-b text-left text-text hidden md:table-cell">
                            Language
                        </th>
                        <th className="py-2 px-2 md:px-4 border-b text-left text-text">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {termsLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <tr
                                key={index}
                                className="hover:bg-primaryLight transition-colors duration-300"
                            >
                                <td className="py-2 px-2 md:px-4 border-b">
                                    <Skeleton height={20} width={100} />
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b">
                                    <Skeleton height={20} width={200} />
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b hidden md:table-cell">
                                    <Skeleton height={20} width={150} />
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b hidden md:table-cell">
                                    <Skeleton height={20} width={100} />
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b hidden md:table-cell">
                                    <Skeleton height={20} width={100} />
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b">
                                    <Skeleton height={40} width={100} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        terms.map((term) => (
                            <motion.tr
                                key={term._id}
                                className="hover:bg-primaryLight transition-colors duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <td className="py-2 px-2 md:px-4 border-b">
                                    {saving === term._id ? (
                                        <Skeleton height={20} width={100} />
                                    ) : editMode === term._id ? (
                                        <input
                                            type="text"
                                            value={editedData.term}
                                            onChange={(e) => handleInputChange(e, "term")}
                                            className="w-full bg-backgroundHover p-1 rounded"
                                        />
                                    ) : (
                                        <span onClick={() => setSelectedTerm(term)}>
                                            {term.term}
                                        </span>
                                    )}
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b">
                                    {saving === term._id ? (
                                        <Skeleton height={20} width={200} />
                                    ) : editMode === term._id ? (
                                        <input
                                            type="text"
                                            value={editedData.definition}
                                            onChange={(e) => handleInputChange(e, "definition")}
                                            className="w-full bg-backgroundHover p-1 rounded"
                                        />
                                    ) : (
                                        term.definition
                                    )}
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b hidden md:table-cell">
                                    {saving === term._id ? (
                                        <Skeleton height={20} width={150} />
                                    ) : editMode === term._id ? (
                                        <select
                                            value={editedData.grammaticalCategory}
                                            onChange={(e) =>
                                                handleInputChange(e, "grammaticalCategory")
                                            }
                                            className="w-full bg-backgroundHover p-1 rounded"
                                        >
                                            {categories.map((category) => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        term.grammaticalCategory?.name
                                    )}
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b hidden md:table-cell">
                                    {saving === term._id ? (
                                        <Skeleton height={20} width={100} />
                                    ) : editMode === term._id ? (
                                        <select
                                            value={editedData.theme}
                                            onChange={(e) => handleInputChange(e, "theme")}
                                            className="w-full bg-backgroundHover p-1 rounded"
                                        >
                                            {themes.map((theme) => (
                                                <option key={theme._id} value={theme._id}>
                                                    {theme.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        term.theme?.name
                                    )}
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b hidden md:table-cell">
                                    {saving === term._id ? (
                                        <Skeleton height={20} width={100} />
                                    ) : editMode === term._id ? (
                                        <select
                                            value={editedData.language}
                                            onChange={(e) => handleInputChange(e, "language")}
                                            className="w-full bg-backgroundHover p-1 rounded"
                                        >
                                            {languages.map((language) => (
                                                <option key={language._id} value={language._id}>
                                                    {language.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        term.language?.name
                                    )}
                                </td>
                                <td className="py-2 px-2 md:px-4 border-b">
                                    {saving === term._id ? (
                                        <Skeleton height={40} width={100} />
                                    ) : editMode === term._id ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleSave(term._id)}
                                                className="bg-success text-white p-1 rounded-full shadow-neumorphic"
                                            >
                                                <FaPencilAlt />
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="bg-error text-white p-1 rounded-full shadow-neumorphic"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(term._id)}
                                                className="bg-primary text-white p-1 rounded-md shadow-neumorphic"
                                            >
                                                <FaPencilAlt />
                                            </button>
                                            {term.status === "pending" && (
                                                <button
                                                    onClick={() => handleReject(term._id)}
                                                    className="bg-error text-white p-1 rounded-full shadow-neumorphic"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </motion.tr>
                        ))
                    )}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                termsPerPage={15}
                totalTerms={totalTerms}
                paginate={paginate}
            />
        </div>
    );
};

const TermsManagement: React.FC = () => {
    const [selectedTerm, setSelectedTerm] = useState<any>(null);

    return (
        <div className="max-w-6xl mx-auto mt-10 p-4 md:p-6">
            {selectedTerm ? (
                <ApproveTermForm
                    term={selectedTerm}
                    onCancel={() => setSelectedTerm(null)}
                />
            ) : (
                <TermsPage setSelectedTerm={setSelectedTerm} />
            )}
        </div>
    );
};

export default TermsManagement;
