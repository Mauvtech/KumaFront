import React from "react";
import {AnimatePresence, motion} from "framer-motion";
import {clsx} from "clsx";

export function Modal({children, open, onOk, className}: {
    children: React.ReactNode,
    open: boolean,
    onOk: () => void,
    className?: string
}) {
    return <AnimatePresence>
        {open && (
            <motion.div
                className={clsx("fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75")}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3}}
            >
                <motion.div
                    className={clsx("bg-white p-6 rounded-lg shadow-lg text-center", className)}
                    initial={{scale: 0.8, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.8, opacity: 0}}
                    transition={{duration: 0.3}}
                >
                    {children}
                    <motion.button
                        onClick={onOk}

                        className="px-4 py-2 bg-primary-light text-gray-600 rounded-lg shadow-neumorphic transition-transform transform hover:scale-105 focus:outline-none"
                        whileTap={{scale: 0.95}}
                    >
                        OK
                    </motion.button>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
}