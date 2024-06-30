import React, { useEffect, useState } from 'react';
import { getAllTerms, approveTerm, rejectTerm } from '../../services/termService';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import ApproveTermForm from './ApproveTermForm';

const TermsPage: React.FC = () => {
    const [terms, setTerms] = useState<any[]>([]);
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [selectedTerm, setSelectedTerm] = useState<any>(null);

    useEffect(() => {
        const fetchTerms = async () => {
            if (!user || !user.token) {
                navigate('/login');
                return;
            }

            try {
                const data = await getAllTerms(navigate);
                setTerms(data);
            } catch (error) {
                console.error('Erreur de chargement des termes', error);
            }
        };

        if (!loading && user) {
            fetchTerms();
        }
    }, [user, loading, navigate]);

    const handleApprove = async (termId: string, approveData: any) => {
        try {
            await approveTerm(termId, approveData, navigate);
            setTerms(terms.map(term => term._id === termId ? { ...term, status: 'approved' } : term));
            setSelectedTerm(null);
        } catch (error) {
            console.error('Erreur d\'approbation du terme', error);
        }
    };

    const handleReject = async (termId: string) => {
        try {
            await rejectTerm(termId, navigate);
            setTerms(terms.map(term => term._id === termId ? { ...term, status: 'rejected' } : term));
        } catch (error) {
            console.error('Erreur de rejet du terme', error);
        }
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Gestion des Termes</h2>
            {selectedTerm ? (
                <ApproveTermForm term={selectedTerm} onCancel={() => setSelectedTerm(null)} />
            ) : (
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Terme</th>
                            <th className="py-2 px-4 border-b">Définition</th>
                            <th className="py-2 px-4 border-b">Catégorie Grammaticale</th>
                            <th className="py-2 px-4 border-b">Thème</th>
                            <th className="py-2 px-4 border-b">Langue</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {terms.map(term => (
                            <tr key={term._id}>
                                <td className="py-2 px-4 border-b cursor-pointer" onClick={() => setSelectedTerm(term)}>{term.term}</td>
                                <td className="py-2 px-4 border-b">{term.definition}</td>
                                <td className="py-2 px-4 border-b">{term.grammaticalCategory?.name}</td>
                                <td className="py-2 px-4 border-b">{term.theme?.name}</td>
                                <td className="py-2 px-4 border-b">{term.language?.name}</td>
                                <td className="py-2 px-4 border-b">
                                    {term.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => setSelectedTerm(term)}
                                                className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleReject(term._id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded-md"
                                            >
                                                Rejeter
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TermsPage;
