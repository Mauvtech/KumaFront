import React, {useState} from 'react';
import {useCategories} from '../../services/category/categoryService';
import {useLanguages} from '../../services/language/languageService';
import Selector from '../Common/Selector';
import {motion} from 'framer-motion';
import {useTags} from "../../services/tag/tagService";
import {capitalizeWord} from "../../utils/StringUtils";
import TermCreationValidationModal from "./TermCreationValidationModal";
import {TermSummary} from "./TermDetails/TermSummary";

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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [termData, setTermData] = useState<TermSummary | null>(null)


    const {data: fetchedCategories} = useCategories()

    const {data: fetchedThemes} = useTags()

    const {data: fetchedLanguages} = useLanguages()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const termData: TermSummary = {
            term,
            translation,
            definition,
            grammaticalCategory: grammaticalCategory,
            tags: [theme],
            language: language,
        };

        try {
            setTermData(termData);
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
                    className="w-full p-3 rounded-lg shadow-inner bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
            ) : (
                <input
                    type="text"
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full p-3 rounded-lg shadow-inner bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary"
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
                        }}
                        placeholder="Select Grammatical Category"
                    />

                    <Selector
                        options={fetchedThemes?.map(theme => theme.name) ?? []}
                        selectedOption={theme}
                        onSelectOption={(option) => {
                            setTheme(option);
                        }}
                        placeholder="Select Theme"
                    />

                    <Selector
                        options={fetchedLanguages?.map(language => language.name) ?? []}
                        selectedOption={language}
                        onSelectOption={(option) => {
                            setLanguage(option);
                        }}
                        placeholder="Select Language"
                    />

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
            <TermCreationValidationModal term={termData}/>
        </div>
    );
}