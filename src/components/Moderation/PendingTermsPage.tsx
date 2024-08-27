import React, {useEffect, useState} from "react";
import {approveTerm, getPendingTerms, rejectTerm,} from "../../services/term/termService";
import {getCurrentUser} from "../../services/auth/authService";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";

const PendingTermsPage: React.FC = () => {
    const [terms, setTerms] = useState<any[]>([]);
    const user = getCurrentUser();
    const navigate = useNavigate();
    const [language, setLanguage] = useState("");
    const [languageCode, setLanguageCode] = useState("");
    const [grammaticalCategory, setGrammaticalCategory] = useState("");
    const [theme, setTheme] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTerms = async () => {
            if (!user || !user.token) {
                navigate("/login"); // Redirect to login if user is not authenticated
                return;
            }

            try {
                const response = await getPendingTerms();
                setTerms(response);
            } catch (error) {
                console.error("Erreur de chargement des termes en attente", error);

            }
        };

        fetchTerms();
    }, [user.token, navigate]);

    const handleApprove = async (termId: number) => {
        try {
            setLoading(true);
            const approveData = {
                language,
                languageCode,
                grammaticalCategory,
                theme,
            };

            await approveTerm(termId, approveData);
            setTerms(terms.filter((term: any) => term._id !== termId));
        } catch (error) {
            console.error("Erreur d'approbation du terme", error);

        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (termId: string) => {
        try {
            setLoading(true);
            await rejectTerm(termId);
            setTerms(terms.filter((term: any) => term._id !== termId));
        } catch (error) {
            console.error("Erreur de rejet du terme", error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto mt-10 p-4 bg-background rounded-lg shadow-neumorphic"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <h2 className="text-2xl font-bold mb-4 text-text">Pending Terms</h2>
            {loading && <p className="text-text">Loading...</p>}
            {error && <p className="text-error">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block mb-2 text-text">Language</label>
                    <input
                        type="text"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-2 bg-backgroundHover border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primaryLight"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 text-text">Language Code</label>
                    <input
                        type="text"
                        value={languageCode}
                        onChange={(e) => setLanguageCode(e.target.value)}
                        className="w-full p-2 bg-backgroundHover border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primaryLight"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 text-text">Grammatical Category</label>
                    <input
                        type="text"
                        value={grammaticalCategory}
                        onChange={(e) => setGrammaticalCategory(e.target.value)}
                        className="w-full p-2 bg-backgroundHover border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primaryLight"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 text-text">Theme</label>
                    <input
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full p-2 bg-backgroundHover border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primaryLight"
                        required
                    />
                </div>
            </div>
            <ul>
                {terms.map((term: any) => (
                    <motion.li
                        key={term._id}
                        className="mb-4 p-4 bg-backgroundHover border-none rounded-lg shadow-inner transition-transform transform hover:scale-105"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3, delay: 0.1}}
                    >
                        <h3 className="text-xl font-bold text-text">{term.term}</h3>
                        <p className="text-text">{term.definition}</p>
                        <div className="mt-2">
                            <button
                                onClick={() => handleApprove(term._id)}
                                className="mr-2 p-2 bg-success text-white rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                                disabled={loading}
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleReject(term._id)}
                                className="p-2 bg-error text-white rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                                disabled={loading}
                            >
                                Reject
                            </button>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
};

export default PendingTermsPage;
