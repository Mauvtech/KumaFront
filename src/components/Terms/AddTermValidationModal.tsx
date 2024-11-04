import {AnimatePresence, motion} from "framer-motion";
import React from "react";
import {useNavigate} from "react-router-dom";


export default function AddTermValidationModal({open}: { open: boolean }) {

    const navigate = useNavigate();


    return (
        <AnimatePresence>
            {open && (
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
                        <p className="mb-4">{"Your term has been submitted successfully. A moderator is going to review it soon."}</p>
                        <motion.button
                            onClick={() => {
                                navigate("/")
                            }}

                            className="px-4 py-2 bg-primaryLight text-gray-600 rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                            whileTap={{scale: 0.95}}
                        >
                            OK
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}