import React, { useState } from 'react';
import { addTerm, updateTerm } from '../../services/termService';
import { getCurrentUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

interface TermFormProps {
    termId?: string;
    initialData?: {
        term: string;
        definition: string;
        grammaticalCategory: string;
        themes: string[];
    };
}

const TermForm: React.FC<TermFormProps> = ({ termId, initialData }) => {
    const [term, setTerm] = useState(initialData?.term || '');
    const [definition, setDefinition] = useState(initialData?.definition || '');
    const [grammaticalCategory, setGrammaticalCategory] = useState(initialData?.grammaticalCategory || '');
    const [themes, setThemes] = useState(initialData?.themes || []);
    const user = getCurrentUser();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const termData = { term, definition, grammaticalCategory, themes };

        try {
            if (termId) {
                await updateTerm(termId, termData, user.token, navigate);
            } else {
                await addTerm(termData, user.token, navigate);
            }
            // Redirection ou notification après soumission réussie
        } catch (error) {
            console.error('Erreur de soumission du terme', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">{termId ? 'Modifier Terme' : 'Ajouter Terme'}</h2>
            <div className="mb-4">
                <label className="block mb-2">Terme</label>
                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Définition</label>
                <textarea
                    value={definition}
                    onChange={(e) => setDefinition(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Catégorie grammaticale</label>
                <input
                    type="text"
                    value={grammaticalCategory}
                    onChange={(e) => setGrammaticalCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Thèmes</label>
                <input
                    type="text"
                    value={themes.join(', ')}
                    onChange={(e) => setThemes(e.target.value.split(', '))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
                {termId ? 'Modifier' : 'Ajouter'}
            </button>
        </form>
    );
};

export default TermForm;
