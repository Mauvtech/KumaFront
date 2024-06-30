import React from 'react';

interface FilterButtonsProps {
    title: string;
    options: string[];
    selectedOption: string;
    onSelectOption: (option: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ title, options, selectedOption, onSelectOption }) => {
    return (
        <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <div className="flex flex-wrap">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onSelectOption(option)}
                        className={`px-3 py-2 m-1 rounded-full text-sm ${selectedOption === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            } transition-colors duration-300`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterButtons;
