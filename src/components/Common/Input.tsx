import React, { useRef, useEffect, useState } from "react";

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

    // Placeholder typing animation
    useEffect(() => {
        if (inputRef.current && !isFocused) {
            let currentIndex = 0;
            const placeholderText = placeholder;
            const cursor = "|";
            const interval = setInterval(() => {
                if (inputRef.current) {
                    // Toggle cursor visibility
                    const displayText = placeholderText.substring(0, currentIndex) + cursor;
                    inputRef.current.placeholder = displayText;
                    currentIndex =
                        currentIndex >= placeholderText.length ? 0 : currentIndex + 1;
                }
            }, 200);
            return () => clearInterval(interval);
        }
    }, [placeholder, isFocused]);

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
        <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full h-16 p-4 text-lg md:text-2xl lg:text-3xl bg-transparent text-text text-center focus:outline-none rounded-lg transition-all duration-300 placeholder:text-gray-500 placeholder-blink"
        />
    );
};

export default Input;
