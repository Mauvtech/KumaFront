import {AnimatePresence, motion} from "framer-motion";
import React from "react";


const wordVariants = {
    hidden: {opacity: 0, y: 20, scale: 0.95},
    visible: {opacity: 1, y: 0, scale: 1},
    exit: {opacity: 0, y: -20, scale: 1.05},
};

export default function HomeDisplayWord({currentWord}: {
    currentWord: string
}) {
    return (
        <AnimatePresence mode="wait">
            <motion.h1
                key={currentWord}
                className="text-6xl sm:text-7xl md:text-8xl sm:-mt-24 -mt-12 lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary leading-tight"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={wordVariants}
                transition={{duration: 1.5, ease: "easeInOut"}}
                style={{
                    lineHeight: "2em",
                    overflow: "visible",
                }}
            >
                {currentWord}
            </motion.h1>
        </AnimatePresence>
    )
}