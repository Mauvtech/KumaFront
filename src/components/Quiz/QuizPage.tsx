import React, { useEffect, useState, useCallback } from 'react';
import { getQuiz, getFlashcardById } from '../../services/termService';
import { handleAuthError } from '../../utils/handleAuthError';
import { AxiosError } from 'axios';
import { Term } from '../../models/termModel';
import { useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const QuizPage: React.FC = () => {
    const [flashcardIds, setFlashcardIds] = useState<string[]>([]);
    const [currentFlashcard, setCurrentFlashcard] = useState<Term | null>(null);
    const [nextFlashcard, setNextFlashcard] = useState<Term | null>(null);
    const [prevFlashcard, setPrevFlashcard] = useState<Term | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const numberOfQuestions = Number(queryParams.get('questions')) || 10;

    const fetchQuiz = useCallback(async () => {
        try {
            const ids = await getQuiz(numberOfQuestions.toString());
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
    }, [numberOfQuestions]);

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
        setIsAnimating(true);
        setTimeout(() => {
            setIsFlipped(!isFlipped);
            setIsAnimating(false);
        }, 300);
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
                        <div className="flip-card-front flex justify-center items-center w-full h-full bg-white shadow-md rounded-lg p-4">
                            <h3 className={`text-xl font-bold mb-4 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
                                {currentFlashcard.term}
                            </h3>
                        </div>
                        <div className="flip-card-back flex justify-center items-center w-full h-full bg-white shadow-md rounded-lg p-4">
                            <h3 className={`text-xl font-bold mb-2 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
                                {currentFlashcard.translation}
                            </h3>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between w-full px-6">
                        <button
                            onClick={handlePrevious}
                            className="px-4 py-2 bg-gray-200 text-gray-600 font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            disabled={currentIndex === 0 || isAnimating}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-gray-200 text-gray-600 font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            disabled={currentIndex === flashcardIds.length - 1 || isAnimating}
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
        </div>
    );
};

export default QuizPage;
