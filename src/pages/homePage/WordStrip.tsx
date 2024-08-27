import {motion, Variants} from "framer-motion";
import React from "react";
import {TermForUser} from "../../services/term/termModel";


export const verticalUpScrollVariants: Variants = {
    animate: {
        y: ["0%", "-100%"],
        transition: {
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
        },
    },
};

export const verticalDownScrollVariants: Variants = {
    animate: {
        y: ["-100%", "0%"],
        transition: {
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
        },
    },
};

// TODO inutilement complexe, à passer en offline

export default function WordStrip({terms}: {
    terms: TermForUser[]
}) {
    return (
        <>
            <div className="fixed left-12 hidden top-0 h-full w-20 sm:flex flex-col justify-center overflow-hidden">
                <motion.div
                    className="flex flex-col gap-32 items-center"
                    style={{height: "200vh"}}
                    variants={verticalUpScrollVariants}
                    animate="animate"
                >
                    {terms.map((termForUser, index) => (
                        <div
                            key={`left-${index}`}
                            className="text-2xl text-primary transform rotate-90 whitespace-nowrap"
                        >
                            {termForUser.term.term}
                        </div>
                    ))}
                    {terms.map((termForUser, index) => (
                        <div
                            key={`left-repeat-${index}`}
                            className="text-2xl text-primary transform rotate-90 whitespace-nowrap"
                        >
                            {termForUser.term.term}
                        </div>
                    ))}
                </motion.div>
            </div>
            <div
                className="fixed hidden right-10 top-0 h-full  w-20 sm:flex flex-col justify-center overflow-hidden">
                <motion.div
                    className="flex flex-col gap-32  items-center"
                    style={{height: "200vh"}}
                    variants={verticalDownScrollVariants}
                    animate="animate"
                >
                    {terms.map((termForUser, index) => (
                        <div
                            key={`right-${index}`}
                            className="text-2xl text-secondary transform rotate-90 whitespace-nowrap"
                        >
                            {termForUser.term.term}
                        </div>
                    ))}
                    {terms.map((termForUser, index) => (
                        <div
                            key={`right-repeat-${index}`}
                            className="text-2xl text-secondary transform rotate-90 whitespace-nowrap"
                        >
                            {termForUser.term.term}
                        </div>
                    ))}
                </motion.div>
            </div>
        </>
    )
}