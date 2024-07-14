import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FlashcardSerieParams: React.FC = () => {
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
    const navigate = useNavigate();

    const handleStartQuiz = () => {
        navigate(`/quiz?questions=${numberOfQuestions}`);
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Set Quiz Parameters </h2>
            <label className="block mb-2 text-lg">Number of Questions</label>
            <input
                type="number"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                className="w-full p-3 bg-gray-200 border-none rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
                min="1"
                max="50"
            />
            <button
                onClick={handleStartQuiz}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:bg-gray-300 transition-transform transform hover:scale-105 focus:outline-none"
            >
                Start Quiz
            </button>
        </div>
    );
};

export default FlashcardSerieParams;
