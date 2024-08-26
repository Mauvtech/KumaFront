import React, {useEffect, useState} from 'react';
import {addTerm, updateTerm} from '../../services/termService/termService';
import {getCategories} from '../../services/categoryService';
import {getThemes} from '../../services/themeService';
import {getLanguages} from '../../services/languageService';
import {useNavigate} from 'react-router-dom';
import Selector from '../Common/Selector';
import {AnimatePresence, motion} from 'framer-motion';

interface TermFormProps {
    termId?: string;
    initialData?: {
        term: string;
        translation: string;
        definition: string;
        grammaticalCategory: string;
        theme: string;
        language: string;
    };
}

const TermForm: React.FC<TermFormProps> = ({termId, initialData}) => {
    const [term, setTerm] = useState(initialData?.term || '');
    const [definition, setDefinition] = useState(initialData?.definition || '');
    const [translation, setTranslation] = useState(initialData?.translation || '');
    const [grammaticalCategory, setGrammaticalCategory] = useState(initialData?.grammaticalCategory || '');
    const [theme, setTheme] = useState(initialData?.theme || '');
    const [language, setLanguage] = useState(initialData?.language || '');
    const [newCategory, setNewCategory] = useState('');
    const [newTheme, setNewTheme] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [categories, setCategories] = useState<{
        _id: string,
        name: string
    }[]>([]);
    const [themeOptions, setThemeOptions] = useState<{
        _id: string,
        name: string
    }[]>([]);
    const [languageOptions, setLanguageOptions] = useState<{
        _id: string,
        name: string,
        code: string
    }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await getCategories();
                const themesData = await getThemes();
                const languagesData = await getLanguages();
                setCategories([...categoriesData, {_id: 'other', name: 'Other'}]);
                setThemeOptions([...themesData, {_id: 'other', name: 'Other'}]);
                setLanguageOptions(Array.isArray(languagesData) ? [...languagesData, {_id: 'other', name: 'Other', code: ''}] : []);

                if (categoriesData.length > 0 && !initialData?.grammaticalCategory) {
                    setGrammaticalCategory(categoriesData[0].name);
                }
                if (themesData.length > 0 && !initialData?.theme) {
                    setTheme(themesData[0].name);
                }
                if (languagesData.length > 0 && !initialData?.language) {
                    setLanguage(languagesData[0].name);
                }
            } catch (error) {
                console.error('Error loading data', error);
                setError('Error loading data');
            }
        };

        fetchData();
    }, [initialData]);

    useEffect(() => {
        if (categories.length > 0 && !initialData?.grammaticalCategory) {
            setGrammaticalCategory(categories[0].name);
        }
        if (themeOptions.length > 0 && !initialData?.theme) {
            setTheme(themeOptions[0].name);
        }
        if (languageOptions.length > 0 && !initialData?.language) {
            setLanguage(languageOptions[0].name);
        }
    }, [categories, themeOptions, languageOptions, initialData]);

    const capitalizeWord = (word: string): string => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const termData = {
            term,
            translation,
            definition,
            grammaticalCategory: grammaticalCategory === 'Other' ? newCategory : grammaticalCategory,
            theme: theme === 'Other' ? newTheme : theme,
            language: language === 'Other' ? newLanguage : language,
        };

        try {
            if (termId) {
                await updateTerm(termId, termData);
            } else {
                await addTerm(termData);
            }
            setModalMessage("Your term has been submitted successfully. A moderator is going to review it soon.");
            setShowModal(true);
        } catch (error) {
            console.error('Error submitting term', error);
            setError('An error occurred while submitting the term.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/');
    };

    const renderInput = (
        id: string,
        value: string,
        label: string,
        placeholder: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
        isTextArea: boolean = false
    ) => (
        <div className="mb-4">
            <label className="block mb-2 text-primary" htmlFor={id}>{label}</label>
            {isTextArea ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full p-3 rounded-lg shadow-inner bg-primaryLight focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
            ) : (
                <input
                    type="text"
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full p-3 rounded-lg shadow-inner bg-primaryLight focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
            )}
        </div>
    );

    return (
        <div className=' w-full h-screen flex flex-col justify-center'>
            <form onSubmit={handleSubmit}
                  className="mx-auto  mt-10 p-6 bg-background flex flex-col gap-3 rounded-lg sm:shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                <h2 className="text-2xl font-bold mb-4 text-primary text-center">{termId ? 'Edit Term' : 'Add a new Term'}</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}

                {renderInput('term', term, 'Term', 'Enter term...', (e) => {
                    const value = capitalizeWord(e.target.value);
                    setTerm(value);
                })}

                {renderInput('translation', translation, 'Translation', 'Enter translation...', (e) => {
                    const value = capitalizeWord(e.target.value);
                    setTranslation(value);
                })}

                {renderInput('definition', definition, 'Definition', 'Enter definition...', (e) => {
                    setDefinition(e.target.value);
                }, true)}
                <div className='flex sm:flex-row flex-col justify-center w-full gap-2'>
                    <Selector
                        options={categories.map(category => category.name)}
                        selectedOption={grammaticalCategory}
                        onSelectOption={(option) => {
                            setGrammaticalCategory(option);
                            setNewCategory('');
                        }}
                        placeholder="Select Grammatical Category"
                    />
                    {grammaticalCategory === 'Other' && (
                        <motion.input
                            type="text"
                            placeholder="New Grammatical Category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(capitalizeWord(e.target.value))}
                            className="w-full p-3 mt-2 rounded-lg shadow-inner bg-primaryLight focus:outline-none focus:ring-2 focus:ring-primary"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.3}}
                        />
                    )}

                    <Selector
                        options={themeOptions.map(theme => theme.name)}
                        selectedOption={theme}
                        onSelectOption={(option) => {
                            setTheme(option);
                            setNewTheme('');
                        }}
                        placeholder="Select Theme"
                    />
                    {theme === 'Other' && (
                        <motion.input
                            type="text"
                            placeholder="New Theme"
                            value={newTheme}
                            onChange={(e) => setNewTheme(capitalizeWord(e.target.value))}
                            className="w-full p-3 mt-2 rounded-lg shadow-inner bg-primaryLight focus:outline-none focus:ring-2 focus:ring-primary"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.3}}
                        />
                    )}

                    <Selector
                        options={languageOptions.map(language => language.name)}
                        selectedOption={language}
                        onSelectOption={(option) => {
                            setLanguage(option);
                            setNewLanguage('');
                        }}
                        placeholder="Select Language"
                    />
                    {language === 'Other' && (
                        <motion.input
                            type="text"
                            placeholder="New Language"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(capitalizeWord(e.target.value))}
                            className="w-full p-3 mt-2 rounded-lg shadow-inner bg-primaryLight focus:outline-none focus:ring-2 focus:ring-primary"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.3}}
                        />
                    )}

                </div>
                <motion.button
                    type="submit"
                    className="w-full p-3 text-2xl font-bold text-white rounded-lg bg-secondary shadow-[5px_5px_10px_#b3b3b3,-5px_-5px_10px_#ffffff] hover:bg-secondaryDark focus:outline-none"
                    disabled={loading}
                    whileTap={{scale: 0.97}}
                    transition={{type: 'spring', stiffness: 400, damping: 10}}
                >
                    {loading ? 'Loading...' : termId ? 'Edit' : '+'}
                </motion.button>
            </form>
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.3}}
                    >
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow-lg text-center"
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                            transition={{duration: 0.3}}
                        >
                            <h2 className="text-xl font-bold mb-4">Success</h2>
                            <p className="mb-4">{modalMessage}</p>
                            <motion.button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-primaryLight text-gray-600 rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                                whileTap={{scale: 0.95}}
                            >
                                OK
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TermForm;
