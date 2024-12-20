import React, {useState} from "react";
import {motion, Variants} from "framer-motion";

interface SelectorProps {
    options: string[];
    selectedOption: string;
    onSelectOption: (option: string) => void;
    placeholder: string;
}

const itemVariants: Variants = {
    open: {
        opacity: 1,
        y: 0,
        transition: {type: "spring", stiffness: 300, damping: 24},
    },
    closed: {opacity: 0, y: 20, transition: {duration: 0.2}},
};

const Selector: React.FC<SelectorProps> = ({
                                               options,
                                               selectedOption,
                                               onSelectOption,
                                               placeholder,
                                           }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Helper function to abbreviate options for mobile devices
    const abbreviateOptionForMobile = (option: string) => {
        const words = option.split(" ");
        if (words.length > 1) {
            // Truncate the first word to 6 letters, if necessary
            const firstWord = words[0].length > 6 ? words[0].slice(0, 6) : words[0];
            // Use the first letter of the second word
            const secondLetter = words[1][0].toUpperCase();
            return `${firstWord} ${secondLetter}.`;
        }
        // Truncate single-word options if they're too long
        return option.length > 6 ? `${option.slice(0, 6)}...` : option;
    };

    return (
        <motion.nav
            initial={false}
            animate={isOpen ? "open" : "closed"}
            className="relative"
        >
            <motion.div
                whileTap={{scale: 0.97}}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center gap-1 w-full p-4 bg-secondary text-white font-bold rounded-lg shadow-lg min-w-[250px]"
            >
                {selectedOption || placeholder}
                <motion.div
                    variants={{
                        open: {rotate: 180},
                        closed: {rotate: 0},
                    }}
                    transition={{duration: 0.2}}
                    style={{originY: 0.55}}
                >
                    <svg width="15" height="15" viewBox="0 0 20 20" className="ml-2">
                        <path d="M0 7 L 20 7 L 10 16" fill="white"/>
                    </svg>
                </motion.div>
            </motion.div>
            <motion.ul
                variants={{
                    open: {
                        clipPath: "inset(0% 0% 0% 0% round 10px)",
                        transition: {
                            type: "spring",
                            bounce: 0,
                            duration: 0.7,
                            delayChildren: 0.3,
                            staggerChildren: 0.05,
                        },
                    },
                    closed: {
                        clipPath: "inset(10% 50% 90% 50% round 10px)",
                        transition: {
                            type: "spring",
                            bounce: 0,
                            duration: 0.3,
                        },
                    },
                }}
                style={{pointerEvents: isOpen ? "auto" : "none"}}
                className="absolute z-10 w-full mt-2 bg-background rounded-lg shadow-lg max-h-32 sm:max-h-48 overflow-y-auto"
            >
                <div
                    className="grid gap-2 p-4 grid-cols-3 md:grid-cols-3 md:flex md:flex-wrap"
                >
                    {options.map((option, index) => (
                        <motion.li
                            key={index}
                            variants={itemVariants}
                            className="cursor-pointer p-2 hover:bg-primary-light hover:text-secondary rounded-md text-white font-bold bg-secondary"
                            onClick={() => {
                                onSelectOption(option);
                                setIsOpen(false);
                            }}
                        >
                            {/* Show abbreviated option on mobile and full option on larger screens */}
                            <span className="block md:hidden">
                                {abbreviateOptionForMobile(option)}
                            </span>
                            <span className="hidden md:block">
                                {option}
                            </span>
                        </motion.li>
                    ))}
                </div>
            </motion.ul>
        </motion.nav>
    );
};

export default Selector;
