import React, { useEffect, useRef } from "react";

interface InputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
}

const Input: React.FC<InputProps> = ({
    value,
    onChange,
    placeholder,
    type = "text",
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Initially focus the input when the component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleFocus = () => {
        // Keep the cursor blinking when the input is focused
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onClick={handleFocus} // Refocus when clicking the input
            onFocus={handleFocus} // Ensure cursor is blinking when focused
            className="w-full h-20 p-3 text-5xl bg-transparent text-text text-center focus:outline-none"
        />
    );
};

export default Input;
