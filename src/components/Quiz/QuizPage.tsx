import React, { useEffect, useState, useCallback } from 'react';
import { getQuiz, getFlashcardById } from '../../services/termService';
import { handleAuthError } from '../../utils/handleAuthError';
import { AxiosError } from 'axios';
import { Term } from '../../models/termModel';

const QuizPage: React.FC = () => {
    const [flashcardIds, setFlashcardIds] = useState<string[]>([]);
    const [currentFlashcard, setCurrentFlashcard] = useState<Term | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const fetchQuiz = useCallback(async () => {
        try {
            const ids = await getQuiz(10);
            if (ids) {
                setFlashcardIds(ids);
                fetchFlashcard(ids[0]);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                handleAuthError(error);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    }, []);

    const fetchFlashcard = useCallback(async (id: string) => {
        try {
            const flashcard = await getFlashcardById(id);
            setCurrentFlashcard(flashcard);
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
        setIsAnimating(true);
        setTimeout(() => {
            const nextIndex = currentIndex + 1;
            if (nextIndex < flashcardIds.length) {
                setCurrentIndex(nextIndex);
                fetchFlashcard(flashcardIds[nextIndex]);
                setIsFlipped(false);
                setIsAnimating(false);
            }
        }, 300);
    };

    const handlePrevious = () => {
        setIsAnimating(true);
        setTimeout(() => {
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
                setCurrentIndex(prevIndex);
                fetchFlashcard(flashcardIds[prevIndex]);
                setIsFlipped(false);
                setIsAnimating(false);
            }
        }, 300);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
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
                            <h3 className="text-xl font-bold mb-4">{currentFlashcard.term}</h3>
                        </div>
                        <div className="flip-card-back flex justify-center items-center w-full h-full bg-white shadow-md rounded-lg p-4">
                            <h3 className="text-xl font-bold mb-2">{currentFlashcard.translation}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between w-full px-6">
                        <button
                            onClick={handlePrevious}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            disabled={currentIndex === flashcardIds.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">Loading...</p>
            )}
        </div>
    );
};

export default QuizPage;
