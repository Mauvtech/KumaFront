import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface InputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
}

const Input: React.FC<InputProps> = ({
    value,
    onChange,
    placeholder = "Start typing...",
    type = "text",
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [displayedText, setDisplayedText] = useState("");
    const cursorControls = useAnimation();

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (!isFocused) {
            let currentIndex = 0;
            const placeholderText = placeholder;

            interval = setInterval(() => {
                setDisplayedText((prevText) =>
                    placeholderText.substring(0, currentIndex)
                );
                currentIndex = (currentIndex + 1) % (placeholderText.length + 1);
            }, 150); // Controls typing speed
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [placeholder, isFocused]);

    useEffect(() => {
        cursorControls.start({
            opacity: [0, 1, 0],
            transition: {
                duration: 1.1, // Controls cursor blinking speed
                repeat: Infinity,
                repeatType: "loop",
                ease: "backInOut",
            },
        });
    }, [cursorControls, isFocused]);

    const handleFocus = () => {
        setIsFocused(true);
        if (inputRef.current) {
            inputRef.current.placeholder = ""; // Remove placeholder on focus
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full h-16 p-4 text-lg md:text-2xl lg:text-3xl bg-primaryLight text-text text-center mt-2 focus:outline-none rounded-lg transition-all duration-300 placeholder-transparent"
            />
            {!isFocused && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-md md:text-2xl lg:text-3xl text-gray-500">
                        {displayedText}
                        <motion.span
                            className="md:text-4xl text-lg font-extralight"
                            animate={cursorControls}
                        >
                            |
                        </motion.span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default Input;
