import React, {useState} from 'react';
import {addTerm} from '../../services/term/termService';
import {useCategories} from '../../services/category/categoryService';
import {useLanguages} from '../../services/language/languageService';
import Selector from '../Common/Selector';
import {motion} from 'framer-motion';
import useTerms from "../../services/term/termMutationService";
import {useTags} from "../../services/tag/tagService";
import {capitalizeWord} from "../../utils/StringUtils";
import AddTermValidationModal from "./AddTermValidationModal";

interface TermFormProps {
    termId?: number;
    initialData?: {
        term: string;
        translation: string;
        definition: string;
        grammaticalCategory: string;
        theme: string;
        language: string;
    };
}

export default function TermForm({termId, initialData}: TermFormProps) {
    const [term, setTerm] = useState(initialData?.term || '');
    const [definition, setDefinition] = useState(initialData?.definition || '');
    const [translation, setTranslation] = useState(initialData?.translation || '');
    const [grammaticalCategory, setGrammaticalCategory] = useState(initialData?.grammaticalCategory || '');
    const [theme, setTheme] = useState(initialData?.theme || '');
    const [language, setLanguage] = useState(initialData?.language || '');
    const [newCategory, setNewCategory] = useState('');
    const [newTheme, setNewTheme] = useState('');
    const [newLanguage, setNewLanguage] = useState('');


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const {saveMutation} = useTerms()

    const {mutate: updateTerm} = saveMutation();

    const {data: fetchedCategories} = useCategories()

    const {data: fetchedThemes} = useTags()

    const {data: fetchedLanguages} = useLanguages()


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
                updateTerm({id: termId, request: termData});
            } else {
                await addTerm(termData);
            }
            setShowModal(true);
        } catch (error) {
            console.error('Error submitting term', error);
            setError('An error occurred while submitting the term.');
        } finally {
            setLoading(false);
        }
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
                        options={fetchedCategories?.map(category => category.name) ?? []}
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
                        options={fetchedThemes?.map(theme => theme.name) ?? []}
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
                        options={fetchedLanguages?.map(language => language.name) ?? []}
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
            <AddTermValidationModal open={showModal}/>
        </div>
    );
}