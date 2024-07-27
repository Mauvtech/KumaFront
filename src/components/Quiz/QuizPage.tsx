import React, { useEffect, useState, useCallback } from 'react';
import { getQuiz, getFlashcardById } from '../../services/termService';
import { handleAuthError } from '../../utils/handleAuthError';
import { AxiosError } from 'axios';
import { Term } from '../../models/termModel';
import { useLocation, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

Modal.setAppElement('#root'); // Cette ligne est nécessaire pour l'accessibilité

const QuizPage: React.FC = () => {
    const [flashcardIds, setFlashcardIds] = useState<string[]>([]);
    const [currentFlashcard, setCurrentFlashcard] = useState<Term | null>(null);
    const [nextFlashcard, setNextFlashcard] = useState<Term | null>(null);
    const [prevFlashcard, setPrevFlashcard] = useState<Term | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showDefinition, setShowDefinition] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const numberOfQuestions = Number(queryParams.get('questions')) || 10;
    const grammaticalCategory = queryParams.get('grammaticalCategory') || '';
    const language = queryParams.get('language') || '';
    const theme = queryParams.get('theme') || '';
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const navigate = useNavigate();

    const fetchQuiz = useCallback(async () => {
        try {
            const ids = await getQuiz(numberOfQuestions.toString(), grammaticalCategory, language, theme);
            if (ids) {
                setFlashcardIds(ids);
                fetchFlashcard(ids[0], setCurrentFlashcard);
                if (ids.length > 1) fetchFlashcard(ids[1], setNextFlashcard);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                handleAuthError(error);
            } else {
                console.error('Unexpected error:', error);
            }
        } finally {
            setLoading(false);
        }
    }, [numberOfQuestions, grammaticalCategory, language, theme]);

    const fetchFlashcard = useCallback(async (id: string, setState: React.Dispatch<React.SetStateAction<Term | null>>) => {
        try {
            const flashcard = await getFlashcardById(id);
            setState(flashcard);
        } catch (error) {
            if (error instanceof AxiosError) {
                handleAuthError(error);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    }, []);

    useEffect(() => {
        fetchQuiz();
    }, [fetchQuiz]);

    const handleNext = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setTimeout(() => {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentFlashcard(nextFlashcard);
            setNextFlashcard(null);
            setIsFlipped(false);
            setShowDefinition(false);
            setIsAnimating(false);

            if (nextIndex + 1 < flashcardIds.length) {
                fetchFlashcard(flashcardIds[nextIndex + 1], setNextFlashcard);
            }
            if (nextIndex - 1 >= 0) {
                fetchFlashcard(flashcardIds[nextIndex - 1], setPrevFlashcard);
            }
        }, 300);
    };

    const handlePrevious = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setTimeout(() => {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            setCurrentFlashcard(prevFlashcard);
            setPrevFlashcard(null);
            setIsFlipped(false);
            setShowDefinition(false);
            setIsAnimating(false);

            if (prevIndex - 1 >= 0) {
                fetchFlashcard(flashcardIds[prevIndex - 1], setPrevFlashcard);
            }
            if (prevIndex + 1 < flashcardIds.length) {
                fetchFlashcard(flashcardIds[prevIndex + 1], setNextFlashcard);
            }
        }, 300);
    };

    const handleFlip = () => {
        if (isAnimating) return;
        setTimeout(() => {
            setIsFlipped(!isFlipped);
            setShowDefinition(false); // Hide the definition when flipping
        }, 300);
    };

    const handleShowDefinition = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowDefinition(!showDefinition);
    };

    const handleMarkCorrect = () => {
        setCorrectAnswers(correctAnswers + 1);
        if (currentIndex === flashcardIds.length - 1) {
            setIsModalOpen(true);
        } else {
            handleNext();
        }
    };

    const handleMarkIncorrect = () => {
        setIncorrectAnswers(incorrectAnswers + 1);
        if (currentIndex === flashcardIds.length - 1) {
            setIsModalOpen(true);
        } else {
            handleNext();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        navigate('/');
    };

    const getGaugeColor = () => {
        const score = (correctAnswers / numberOfQuestions) * 100;
        if (score >= 70) return '#1C4F36'; // green
        if (score >= 30) return '#FFA500'; // orange
        return '#FF0000'; // red
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 shadow-lg rounded-lg">
            {currentFlashcard ? (
                <div className="relative flex flex-col items-center">
                    <div
                        className={`flip-card-inner cursor-pointer ${isFlipped ? 'rotate-y-180' : ''} ${isAnimating ? 'animate-slide' : ''}`}
                        onClick={handleFlip}
                        style={{ width: '300px', height: '400px' }}
                    >
                        <div className="flip-card-front flex flex-col justify-center items-center w-full h-full bg-white shadow-md rounded-lg p-4">
                            <h3 className={`text-xl font-bold mb-4 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
                                {currentFlashcard.term}
                            </h3>
                            {currentFlashcard.language && (
                                <p className="absolute top-2 right-2 inline-block bg-blue-200 text-blue-800 text-xs px-2 rounded-full">{currentFlashcard.language.name} ({currentFlashcard.language.code})</p>
                            )}
                            <p className="text-gray-500">Click to see the translation</p>
                        </div>
                        <div className="flip-card-back flex flex-col justify-center items-center w-full h-full bg-white shadow-md rounded-lg p-4">
                            <h3 className={`text-xl font-bold mb-2 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
                                {currentFlashcard.translation}
                            </h3>
                            {showDefinition && (
                                <h3 className="text-xl text-gray-600">{currentFlashcard.definition}</h3>
                            )}
                            {currentFlashcard.language && (
                                <p className="absolute top-2 right-2 inline-block bg-blue-200 text-blue-800 text-xs px-2 rounded-full">{currentFlashcard.language.name} ({currentFlashcard.language.code})</p>
                            )}
                            <button
                                onClick={handleShowDefinition}
                                className="mt-2 px-4 py-2 bg-gray-200 text-gray-600 font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            >
                                {showDefinition ? 'Hide Definition' : 'Show Definition'}
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between w-full px-6">
                        <button
                            onClick={handlePrevious}
                            className="px-4 py-2 bg-gray-200 text-gray-600 font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
                            disabled={isAnimating}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleMarkIncorrect}
                            className="px-4 py-2 bg-red-200 text-red-600 font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            disabled={isAnimating}
                        >
                            <FaTimes />
                        </button>
                        <button
                            onClick={handleMarkCorrect}
                            className="px-4 py-2 bg-green-200 text-green-600 font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            disabled={isAnimating}
                        >
                            <FaCheck />
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-gray-200 text-gray-600 font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            style={{ visibility: currentIndex === flashcardIds.length - 1 ? 'hidden' : 'visible' }}
                            disabled={isAnimating}
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative flex flex-col items-center">
                    <div
                        className={`flip-card-inner ${isAnimating ? 'animate-slide' : ''}`}
                        style={{ width: '300px', height: '400px' }}
                    >
                        <div className="flip-card-front flex justify-center items-center w-full h-full bg-white shadow-md rounded-lg p-4">
                            <Skeleton height={30} width="80%" />
                        </div>
                        <div className="flip-card-back flex justify-center items-center w-full h-full bg-white shadow-md rounded-lg p-4">
                            <Skeleton height={30} width="80%" />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between w-full px-6">
                        <Skeleton height={40} width={100} />
                        <Skeleton height={40} width={100} />
                    </div>
                </div>
            )}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Quiz Summary"
                className="modal bg-white p-6 rounded-lg shadow-lg flex justify-center items-center"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Quiz Summary</h2>
                    <div className="w-32 h-32 relative mx-auto">
                        <CircularProgressbar
                            value={(correctAnswers / numberOfQuestions) * 100}
                            text={`${Math.round((correctAnswers / numberOfQuestions) * 100)}%`}
                            styles={buildStyles({
                                textSize: '24px',
                                pathColor: getGaugeColor(),
                                textColor: getGaugeColor(),
                                trailColor: '#d6d6d6',
                                backgroundColor: '#3e98c7',
                            })}
                        />
                    </div>
                    <p className="text-lg text-green-900 mb-2"><span className='font-bold text-3xl'>{correctAnswers}</span> Correct Answers</p>
                    <p className="text-lg text-red-500 mb-2"><span className='font-bold text-3xl'>{incorrectAnswers}</span> Incorrect Answers</p>
                    <p className="text-lg text-gray-500 mb-2"><span className='font-bold text-3xl'>{numberOfQuestions}</span> Flashcards</p>
                    <button
                        onClick={closeModal}
                        className="mt-4 px-4 py-2 bg-blue-200 text-blue-600 font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default QuizPage;
