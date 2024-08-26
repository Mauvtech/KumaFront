import React, {useCallback, useEffect, useState} from "react";
import {handleAuthError} from "../../utils/handleAuthError";
import {AxiosError} from "axios";
import {Term} from "../../models/termModel";
import {useLocation, useNavigate} from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {FaArrowLeft, FaArrowRight, FaCheck, FaTimes} from "react-icons/fa";
import Modal from "react-modal";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {AnimatePresence, motion} from "framer-motion";
import {getFlashcardById, getQuiz} from "../../services/quizService";

// Set up modal accessibility root
Modal.setAppElement("#root");

const QuizPage: React.FC = () => {
    const [flashcardIds, setFlashcardIds] = useState<string[]>([]);
    const [flashcards, setFlashcards] = useState<Term[]>([]);
    const [currentFlashcard, setCurrentFlashcard] = useState<Term | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showDefinition, setShowDefinition] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const numberOfQuestions = Number(queryParams.get("questions")) || 10;
    const grammaticalCategory = queryParams.get("grammaticalCategory") || "";
    const language = queryParams.get("language") || "";
    const theme = queryParams.get("theme") || "";
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const navigate = useNavigate();

    const fetchQuiz = useCallback(async () => {
        try {
            const ids = await getQuiz(
                numberOfQuestions.toString(),
                grammaticalCategory,
                language,
                theme
            );
            if (ids) {
                setFlashcardIds(ids);
                const flashcardPromises = ids.map((id: string) =>
                    getFlashcardById(id)
                );
                const flashcards = await Promise.all(flashcardPromises);
                setFlashcards(flashcards);
                setCurrentFlashcard(flashcards[0]);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                handleAuthError(error);
            } else {
                console.error("Unexpected error:", error);
            }
        } finally {
            setLoading(false);
        }
    }, [numberOfQuestions, grammaticalCategory, language, theme]);

    useEffect(() => {
        fetchQuiz();
    }, [fetchQuiz]);

    const handleNext = () => {
        if (isAnimating || currentIndex >= flashcardIds.length - 1) return;

        setIsAnimating(true);
        setTimeout(() => {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentFlashcard(flashcards[nextIndex]);
            setIsFlipped(false);
            setShowDefinition(false);
            setIsAnimating(false);
        }, 300);
    };

    const handlePrevious = () => {
        if (isAnimating || currentIndex <= 0) return;

        setIsAnimating(true);
        setTimeout(() => {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            setCurrentFlashcard(flashcards[prevIndex]);
            setIsFlipped(false);
            setShowDefinition(false);
            setIsAnimating(false);
        }, 300);
    };

    const handleFlip = () => {
        if (isAnimating) return;
        setIsFlipped(!isFlipped);
        setShowDefinition(false);
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
        navigate("/");
    };

    const getGaugeColor = () => {
        const score = (correctAnswers / numberOfQuestions) * 100;
        if (score >= 70) return "#00FF00"; // green
        if (score >= 30) return "#FFA500"; // orange
        return "#FF0000"; // red
    };

    return (
        <div className="mt-10 p-6 bg-background flex justify-center items-center rounded-lg">
            {loading ? (
                <div className="relative flex flex-col items-center">
                    <div
                        className={`flip-card ${isAnimating ? "animate-slide" : ""}`}
                        style={{width: "300px", height: "400px"}}
                    >
                        <div className="flip-card-inner">
                            <div
                                className="flip-card-front flex justify-center items-center w-full h-full bg-backgroundHover shadow-md rounded-lg p-4">
                                <Skeleton height={30} width="80%"/>
                            </div>
                            <div
                                className="flip-card-back flex justify-center items-center w-full h-full bg-backgroundHover shadow-md rounded-lg p-4">
                                <Skeleton height={30} width="80%"/>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between w-full px-6">
                        <Skeleton height={40} width={100}/>
                        <Skeleton height={40} width={100}/>
                    </div>
                </div>
            ) : currentFlashcard ? (
                <motion.div
                    className="relative flex flex-col items-center bg-background"
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.8}}
                    transition={{duration: 0.3}}
                >
                    <div
                        className={`flip-card cursor-pointer w-full h-[50vh] ${isAnimating ? "animate-slide" : ""
                        }`}
                        onClick={handleFlip}

                    >
                        <div
                            className={`flip-card-inner h-full ${isFlipped ? "rotate-y-180" : ""
                            } ${isAnimating ? "animate-slide" : ""}`}
                        >
                            <motion.div
                                className="flip-card-front flex flex-col justify-center items-center w-full h-full bg-backgroundHover shadow-md rounded-lg p-4"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.5}}
                            >
                                <h3
                                    className={`text-xl font-bold mb-4 text-text ${isAnimating ? "opacity-0" : "opacity-100"
                                    } transition-opacity duration-500`}
                                >
                                    {currentFlashcard.term}
                                </h3>
                                {currentFlashcard.language && (
                                    <p className="absolute top-2 right-2 inline-block bg-accentLight text-accent text-xs px-2 rounded-full">
                                        {currentFlashcard.language.name} (
                                        {currentFlashcard.language.code})
                                    </p>
                                )}
                                <p className="text-accent">Click to see the translation</p>
                            </motion.div>
                            <motion.div
                                className="flip-card-back flex flex-col justify-center items-center w-full h-full bg-backgroundHover shadow-md rounded-lg p-4"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.5}}
                            >
                                <h3
                                    className={`text-xl font-bold mb-2 text-text ${isAnimating ? "opacity-0" : "opacity-100"
                                    } transition-opacity duration-500`}
                                >
                                    {currentFlashcard.translation}
                                </h3>
                                {showDefinition && (
                                    <h3 className="text-xl text-text">
                                        {currentFlashcard.definition}
                                    </h3>
                                )}
                                {currentFlashcard.language && (
                                    <p className="absolute top-2 right-2 inline-block bg-accentLight text-accent text-xs px-2 rounded-full">
                                        {currentFlashcard.language.name} (
                                        {currentFlashcard.language.code})
                                    </p>
                                )}
                                <button
                                    onClick={handleShowDefinition}
                                    className="mt-2 px-4 py-2 bg-backgroundHover text-text font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                                >
                                    {showDefinition ? "Hide Definition" : "Show Definition"}
                                </button>
                            </motion.div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center gap-12 w-full">
                        <motion.button
                            onClick={handlePrevious}
                            className="px-4 py-2 bg-backgroundHover text-text font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            style={{visibility: currentIndex === 0 ? "hidden" : "visible"}}
                            disabled={isAnimating}
                            whileTap={{scale: 0.95}}
                        >
                            <FaArrowLeft/>
                        </motion.button>
                        <motion.button
                            onClick={handleMarkIncorrect}
                            className="px-4 py-2 bg-errorHover text-error font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            disabled={isAnimating}
                            whileTap={{scale: 0.95}}
                        >
                            <FaTimes/>
                        </motion.button>
                        <motion.button
                            onClick={handleMarkCorrect}
                            className="px-4 py-2 bg-successHover text-success font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            disabled={isAnimating}
                            whileTap={{scale: 0.95}}
                        >
                            <FaCheck/>
                        </motion.button>
                        <motion.button
                            onClick={handleNext}
                            className="px-4 py-2 bg-backgroundHover text-text font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            style={{
                                visibility:
                                    currentIndex === flashcardIds.length - 1
                                        ? "hidden"
                                        : "visible",
                            }}
                            disabled={isAnimating}
                            whileTap={{scale: 0.95}}
                        >
                            <FaArrowRight/>
                        </motion.button>
                    </div>
                </motion.div>
            ) : null}
            <AnimatePresence>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="Quiz Summary"
                        className="modal bg-background p-6 rounded-lg shadow-neumorphic"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                        style={{overlay: {}, content: {}}}
                    >
                        <motion.div
                            initial={{opacity: 0, y: -50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 50}}
                            transition={{duration: 0.5}}
                        >
                            <h2 className="text-2xl font-bold mb-4 text-text">
                                Quiz Summary
                            </h2>
                            <div className="flex justify-center items-center mb-4">
                                <div className="w-32 h-32 relative">
                                    <CircularProgressbar
                                        value={(correctAnswers / numberOfQuestions) * 100}
                                        styles={buildStyles({
                                            textSize: "24px",
                                            pathColor: getGaugeColor(),
                                            textColor: getGaugeColor(),
                                            trailColor: "#d6d6d6",
                                        })}
                                    />
                                    <div
                                        className="absolute inset-0 flex justify-center items-center text-xl"
                                        style={{color: getGaugeColor()}}
                                    >
                                        {`${Math.round(
                                            (correctAnswers / numberOfQuestions) * 100
                                        )}%`}
                                    </div>
                                </div>
                            </div>
                            <p className="text-lg text-success mb-2">
                                <span className="font-bold text-3xl">{correctAnswers}</span>{" "}
                                Correct Answers
                            </p>
                            <p className="text-lg mb-2 text-error">
                                <span className="font-bold text-3xl">{incorrectAnswers}</span>{" "}
                                Incorrect Answers
                            </p>
                            <p className="text-lg text-text mb-2">
                                <span className="font-bold text-3xl">{numberOfQuestions}</span>{" "}
                                Flashcards
                            </p>
                            <motion.button
                                onClick={closeModal}
                                className="mt-4 px-4 py-2 bg-accentLight text-accent font-bold rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                                whileTap={{scale: 0.95}}
                            >
                                Close
                            </motion.button>
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuizPage;
