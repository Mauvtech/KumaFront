import React from 'react';

interface InputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder, type = 'text' }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 bg-background text-text  rounded-lg shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-primary"
        />
    );
};

export default Input;

